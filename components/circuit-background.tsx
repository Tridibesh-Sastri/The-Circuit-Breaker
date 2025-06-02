"use client"

import { useEffect, useRef } from "react"

interface Node {
  x: number
  y: number
  vx: number
  vy: number
}

interface Line {
  start: Node
  end: Node
  opacity: number
}

export function CircuitBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const nodesRef = useRef<Node[]>([])
  const linesRef = useRef<Line[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set up responsive canvas
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1

      // Use lower DPR on mobile for performance
      const effectiveDpr = window.innerWidth < 768 ? Math.min(dpr, 1.5) : dpr

      canvas.width = rect.width * effectiveDpr
      canvas.height = rect.height * effectiveDpr

      ctx.scale(effectiveDpr, effectiveDpr)
      canvas.style.width = rect.width + "px"
      canvas.style.height = rect.height + "px"
    }

    resizeCanvas()

    // Responsive node count based on screen size
    const getNodeCount = () => {
      const area = window.innerWidth * window.innerHeight
      if (window.innerWidth < 768) return Math.min(30, Math.floor(area / 15000)) // Mobile
      if (window.innerWidth < 1024) return Math.min(50, Math.floor(area / 12000)) // Tablet
      return Math.min(80, Math.floor(area / 10000)) // Desktop
    }

    // Initialize nodes
    const initNodes = () => {
      const nodeCount = getNodeCount()
      const nodes: Node[] = []

      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * canvas.clientWidth,
          y: Math.random() * canvas.clientHeight,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
        })
      }

      nodesRef.current = nodes
    }

    // Initialize lines
    const initLines = () => {
      const lines: Line[] = []
      const nodes = nodesRef.current
      const maxDistance = window.innerWidth < 768 ? 100 : 150

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const distance = Math.sqrt(Math.pow(nodes[i].x - nodes[j].x, 2) + Math.pow(nodes[i].y - nodes[j].y, 2))

          if (distance < maxDistance) {
            lines.push({
              start: nodes[i],
              end: nodes[j],
              opacity: Math.max(0, 1 - distance / maxDistance),
            })
          }
        }
      }

      linesRef.current = lines
    }

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)

      // Update nodes
      nodesRef.current.forEach((node) => {
        node.x += node.vx
        node.y += node.vy

        // Bounce off edges
        if (node.x <= 0 || node.x >= canvas.clientWidth) node.vx *= -1
        if (node.y <= 0 || node.y >= canvas.clientHeight) node.vy *= -1

        // Keep nodes in bounds
        node.x = Math.max(0, Math.min(canvas.clientWidth, node.x))
        node.y = Math.max(0, Math.min(canvas.clientHeight, node.y))
      })

      // Update lines
      const maxDistance = window.innerWidth < 768 ? 100 : 150
      linesRef.current = []

      for (let i = 0; i < nodesRef.current.length; i++) {
        for (let j = i + 1; j < nodesRef.current.length; j++) {
          const distance = Math.sqrt(
            Math.pow(nodesRef.current[i].x - nodesRef.current[j].x, 2) +
              Math.pow(nodesRef.current[i].y - nodesRef.current[j].y, 2),
          )

          if (distance < maxDistance) {
            linesRef.current.push({
              start: nodesRef.current[i],
              end: nodesRef.current[j],
              opacity: Math.max(0, 1 - distance / maxDistance),
            })
          }
        }
      }

      // Draw lines
      linesRef.current.forEach((line) => {
        ctx.beginPath()
        ctx.moveTo(line.start.x, line.start.y)
        ctx.lineTo(line.end.x, line.end.y)
        ctx.strokeStyle = `rgba(59, 130, 246, ${line.opacity * 0.3})`
        ctx.lineWidth = 1
        ctx.stroke()
      })

      // Draw nodes
      nodesRef.current.forEach((node) => {
        ctx.beginPath()
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(59, 130, 246, 0.6)"
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    // Initialize and start animation
    initNodes()
    initLines()
    animate()

    // Handle resize
    const handleResize = () => {
      resizeCanvas()
      initNodes()
      initLines()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        opacity: 0.1,
      }}
    />
  )
}
