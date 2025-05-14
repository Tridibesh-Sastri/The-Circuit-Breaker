"use client"

import { useRef, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import * as THREE from "three"

// Circuit Node component
function CircuitNode({ position, color = "#4ade80", size = 0.1, pulse = false }) {
  const ref = useRef()

  useFrame(({ clock }) => {
    if (pulse) {
      const time = clock.getElapsedTime()
      ref.current.scale.setScalar(1 + Math.sin(time * 2) * 0.2)
    }
  })

  return (
    <mesh position={position} ref={ref}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
    </mesh>
  )
}

// Circuit Line component
function CircuitLine({ start, end, color = "#4ade80", width = 0.02, animate = false }) {
  const ref = useRef()

  useEffect(() => {
    const direction = new THREE.Vector3().subVectors(end, start)
    const length = direction.length()
    ref.current.scale.set(width, width, length)
    ref.current.position.copy(start).add(direction.multiplyScalar(0.5))
    ref.current.lookAt(end)
    ref.current.rotateX(Math.PI / 2)
  }, [start, end])

  useFrame(({ clock }) => {
    if (animate) {
      const time = clock.getElapsedTime()
      ref.current.material.opacity = ((Math.sin(time * 3) + 1) / 2) * 0.8 + 0.2
    }
  })

  return (
    <mesh ref={ref}>
      <cylinderGeometry args={[1, 1, 1, 8, 1, false]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        transparent={true}
        opacity={animate ? 0.5 : 1}
      />
    </mesh>
  )
}

// Data Pulse component
function DataPulse({ path, color = "#4ade80", speed = 1 }) {
  const ref = useRef()
  const startPoint = path[0]
  const progress = useRef(0)

  useFrame(({ clock }) => {
    progress.current = (progress.current + 0.005 * speed) % 1

    if (path.length > 1) {
      const pathLength = path.length
      const segmentIndex = Math.floor(progress.current * (pathLength - 1))
      const segmentProgress = (progress.current * (pathLength - 1)) % 1

      const start = path[segmentIndex]
      const end = path[segmentIndex + 1]

      const position = new THREE.Vector3().lerpVectors(
        new THREE.Vector3(...start),
        new THREE.Vector3(...end),
        segmentProgress,
      )

      ref.current.position.copy(position)
    }
  })

  return (
    <mesh position={startPoint} ref={ref}>
      <sphereGeometry args={[0.06, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
    </mesh>
  )
}

// Circuit Grid component
function CircuitGrid() {
  // Create a grid of nodes
  const gridSize = 5
  const spacing = 1.5
  const nodes = []
  const lines = []
  const dataPaths = []

  // Generate nodes
  for (let x = -gridSize; x <= gridSize; x += 2) {
    for (let y = -gridSize; y <= gridSize; y += 2) {
      for (let z = -gridSize; z <= gridSize; z += 2) {
        // Skip some nodes randomly for a more natural look
        if (Math.random() > 0.7) continue

        const position = [x * spacing, y * spacing, z * spacing]
        const isPulse = Math.random() > 0.8
        const nodeColor =
          Math.random() > 0.7
            ? "#3b82f6" // blue
            : Math.random() > 0.5
              ? "#4ade80" // green
              : "#a855f7" // purple

        nodes.push({ position, color: nodeColor, pulse: isPulse })
      }
    }
  }

  // Generate lines between some nodes
  nodes.forEach((node, i) => {
    // Find closest nodes
    const closestNodes = nodes
      .filter((_, j) => i !== j)
      .map((otherNode, j) => {
        const dist = new THREE.Vector3(...node.position).distanceTo(new THREE.Vector3(...otherNode.position))
        return { node: otherNode, dist, index: j }
      })
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 2) // Connect to 2 closest nodes

    closestNodes.forEach(({ node: otherNode }) => {
      // Avoid duplicate lines
      const lineExists = lines.some(
        (line) =>
          (line.start === node.position && line.end === otherNode.position) ||
          (line.start === otherNode.position && line.end === node.position),
      )

      if (!lineExists && Math.random() > 0.3) {
        const animate = Math.random() > 0.7
        lines.push({
          start: node.position,
          end: otherNode.position,
          color: node.color,
          animate,
        })
      }
    })
  })

  // Generate data paths (sequences of connected nodes)
  for (let i = 0; i < 10; i++) {
    const pathLength = Math.floor(Math.random() * 5) + 3
    const startNodeIndex = Math.floor(Math.random() * nodes.length)
    let currentNode = nodes[startNodeIndex]
    const path = [currentNode.position]

    for (let j = 0; j < pathLength; j++) {
      // Find connected lines
      const connectedLines = lines.filter(
        (line) => line.start === currentNode.position || line.end === currentNode.position,
      )

      if (connectedLines.length === 0) break

      // Pick a random connected line
      const randomLine = connectedLines[Math.floor(Math.random() * connectedLines.length)]

      // Get the node at the other end
      const nextNodePosition = randomLine.start === currentNode.position ? randomLine.end : randomLine.start

      // Find the node object
      const nextNode = nodes.find((n) => n.position === nextNodePosition)
      if (!nextNode) break

      path.push(nextNodePosition)
      currentNode = nextNode
    }

    if (path.length > 1) {
      dataPaths.push({
        path,
        color: Math.random() > 0.5 ? "#4ade80" : "#3b82f6",
        speed: Math.random() * 2 + 0.5,
      })
    }
  }

  return (
    <>
      {nodes.map((node, i) => (
        <CircuitNode key={`node-${i}`} position={node.position} color={node.color} pulse={node.pulse} />
      ))}

      {lines.map((line, i) => (
        <CircuitLine
          key={`line-${i}`}
          start={new THREE.Vector3(...line.start)}
          end={new THREE.Vector3(...line.end)}
          color={line.color}
          animate={line.animate}
        />
      ))}

      {dataPaths.map((path, i) => (
        <DataPulse key={`pulse-${i}`} path={path.path} color={path.color} speed={path.speed} />
      ))}
    </>
  )
}

// Camera controller
function CameraController() {
  const { camera } = useThree()
  const controls = useRef()

  useEffect(() => {
    camera.position.set(10, 5, 10)
    camera.lookAt(0, 0, 0)
  }, [camera])

  useFrame(() => {
    controls.current.update()
  })

  return (
    <OrbitControls
      ref={controls}
      enableZoom={false}
      enablePan={false}
      rotateSpeed={0.2}
      autoRotate
      autoRotateSpeed={0.5}
    />
  )
}

// Main component
export function CircuitBackground() {
  return (
    <Canvas className="w-full h-full">
      <CameraController />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <CircuitGrid />
      <Environment preset="night" />
      <fog attach="fog" args={["#000", 10, 30]} />
    </Canvas>
  )
}
