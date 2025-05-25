"use client"

import type React from "react"

import { useState } from "react"
import { ArrowRight, Cpu, Users, Calendar, BookOpen, Github, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CircuitBackground } from "./circuit-background"
import { SimpleProjectCard } from "./landing/simple-project-card"
import { SimpleEventCard } from "./landing/simple-event-card"
import { TestimonialCard } from "./testimonial-card"
import Link from "next/link"

export function LandingPage() {
  const [email, setEmail] = useState("")

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    console.log("Newsletter signup:", email)
    setEmail("")
  }

  const featuredProjects = [
    {
      id: 1,
      title: "Smart Home Automation",
      description: "IoT-based home automation system using Arduino and ESP32",
      image: "/placeholder.svg?height=200&width=300",
      tags: ["IoT", "Arduino", "ESP32"],
      author: "Alex Chen",
      likes: 42,
      difficulty: "Intermediate" as const,
    },
    {
      id: 2,
      title: "Wireless Charging Pad",
      description: "Efficient wireless charging solution with custom coil design",
      image: "/placeholder.svg?height=200&width=300",
      tags: ["Wireless", "Power", "PCB"],
      author: "Sarah Kim",
      likes: 38,
      difficulty: "Advanced" as const,
    },
    {
      id: 3,
      title: "LED Matrix Display",
      description: "Programmable LED matrix for dynamic visual displays",
      image: "/placeholder.svg?height=200&width=300",
      tags: ["LED", "Display", "Programming"],
      author: "Mike Johnson",
      likes: 35,
      difficulty: "Beginner" as const,
    },
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "PCB Design Workshop",
      date: "2024-02-15",
      time: "2:00 PM",
      location: "Lab 101",
      type: "workshop" as const,
      description: "Learn the fundamentals of PCB design using KiCad",
      attendees: 25,
      maxAttendees: 30,
    },
    {
      id: 2,
      title: "Arduino Bootcamp",
      date: "2024-02-20",
      time: "10:00 AM",
      location: "Main Hall",
      type: "bootcamp" as const,
      description: "Intensive Arduino programming session for beginners",
      attendees: 18,
      maxAttendees: 20,
    },
    {
      id: 3,
      title: "Tech Talk: Future of Electronics",
      date: "2024-02-25",
      time: "6:00 PM",
      location: "Auditorium",
      type: "seminar" as const,
      description: "Industry expert discusses emerging trends in electronics",
      attendees: 45,
      maxAttendees: 100,
    },
  ]

  const testimonials = [
    {
      id: 1,
      name: "Emily Rodriguez",
      role: "Alumni, Hardware Engineer at Tesla",
      content:
        "The Circuit Breaker club gave me the practical skills and confidence I needed to excel in my career. The hands-on projects and mentorship were invaluable.",
      avatar: "/placeholder.svg?height=60&width=60",
      rating: 5,
    },
    {
      id: 2,
      name: "David Park",
      role: "Current Member, CS Major",
      content:
        "Being part of this club has been amazing. I've learned so much about electronics and made great friends who share my passion for technology.",
      avatar: "/placeholder.svg?height=60&width=60",
      rating: 5,
    },
    {
      id: 3,
      name: "Lisa Chen",
      role: "Alumni, Startup Founder",
      content:
        "The entrepreneurial spirit and technical knowledge I gained here helped me start my own electronics company. Forever grateful!",
      avatar: "/placeholder.svg?height=60&width=60",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <CircuitBackground />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 bg-black/50 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
            <span className="font-bold text-black">CB</span>
          </div>
          <span className="font-bold text-xl">Circuit Breaker</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#about" className="hover:text-emerald-400 transition-colors">
            About
          </a>
          <a href="#projects" className="hover:text-emerald-400 transition-colors">
            Projects
          </a>
          <a href="#events" className="hover:text-emerald-400 transition-colors">
            Events
          </a>
          <a href="#contact" className="hover:text-emerald-400 transition-colors">
            Contact
          </a>
        </div>

        <Link href="/auth">
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold">Join Club</Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
        <Badge variant="outline" className="mb-6 border-emerald-500/50 text-emerald-400">
          Electronics • Innovation • Community
        </Badge>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-emerald-400 to-white bg-clip-text text-transparent">
          The Circuit Breaker
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl">
          Join our community of electronics enthusiasts, innovators, and makers. Build amazing projects, learn
          cutting-edge skills, and shape the future of technology.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/auth">
            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
            Learn More
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Join Circuit Breaker?</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-gray-900/50 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <Cpu className="h-12 w-12 text-emerald-400 mb-4" />
                <CardTitle className="text-white">Hands-on Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  Work on real-world electronics projects from IoT devices to robotics
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <Users className="h-12 w-12 text-emerald-400 mb-4" />
                <CardTitle className="text-white">Expert Mentorship</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  Learn from industry professionals and experienced club alumni
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <Calendar className="h-12 w-12 text-emerald-400 mb-4" />
                <CardTitle className="text-white">Regular Workshops</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  Attend weekly workshops on PCB design, programming, and more
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-emerald-400 mb-4" />
                <CardTitle className="text-white">Resource Library</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  Access our extensive library of components, tools, and documentation
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section id="projects" className="relative z-10 py-20 px-6 bg-gray-900/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Featured Projects</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <SimpleProjectCard key={project.id} project={project} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/auth">
              <Button variant="outline" className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10">
                View All Projects
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section id="events" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Upcoming Events</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <SimpleEventCard key={event.id} event={event} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/auth">
              <Button variant="outline" className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10">
                View All Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-20 px-6 bg-gray-900/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What Our Members Say</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Stay Updated</h2>
          <p className="text-xl text-gray-300 mb-8">Get the latest news about projects, events, and opportunities</p>

          <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-md bg-gray-900/50 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
              required
            />
            <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold">
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="relative z-10 bg-gray-900/50 border-t border-white/10 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                  <span className="font-bold text-black text-sm">CB</span>
                </div>
                <span className="font-bold">Circuit Breaker</span>
              </div>
              <p className="text-gray-400 text-sm">Building the future of electronics, one project at a time.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#about" className="hover:text-emerald-400 transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#projects" className="hover:text-emerald-400 transition-colors">
                    Projects
                  </a>
                </li>
                <li>
                  <a href="#events" className="hover:text-emerald-400 transition-colors">
                    Events
                  </a>
                </li>
                <li>
                  <Link href="/auth" className="hover:text-emerald-400 transition-colors">
                    Join
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-emerald-400 transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-400 transition-colors">
                    Tutorials
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-400 transition-colors">
                    Component Library
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-400 transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>info@circuitbreaker.edu</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  <span>github.com/circuitbreaker</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Circuit Breaker Electronics Club. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
