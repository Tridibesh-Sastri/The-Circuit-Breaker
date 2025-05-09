"use client"

import Link from "next/link"
import { ArrowRight, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CircuitBackground } from "@/components/circuit-background"
import { ProjectCard } from "@/components/project-card"
import { EventCard } from "@/components/event-card"
import { TestimonialCard } from "@/components/testimonial-card"

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* 3D Circuit Animation Background */}
      <div className="fixed inset-0 z-0">
        <CircuitBackground />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header/Navigation */}
        <header className="border-b border-white/10 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                <span className="font-bold text-black">CB</span>
              </div>
              <span className="font-bold text-xl">The Circuit Breaker</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#about" className="text-sm hover:text-emerald-400 transition-colors">
                About
              </Link>
              <Link href="#projects" className="text-sm hover:text-emerald-400 transition-colors">
                Projects
              </Link>
              <Link href="#events" className="text-sm hover:text-emerald-400 transition-colors">
                Events
              </Link>
              <Link href="#library" className="text-sm hover:text-emerald-400 transition-colors">
                Library
              </Link>
              <Link href="#forum" className="text-sm hover:text-emerald-400 transition-colors">
                Forum
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="border-emerald-500 text-emerald-500 hover:bg-emerald-500/10">
                Sign In
              </Button>
              <Button className="bg-emerald-500 text-black hover:bg-emerald-600">Join Now</Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="min-h-[90vh] flex items-center">
          <div className="container mx-auto px-4 py-24">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="text-emerald-500">Connect</span>, <span className="text-blue-500">Create</span>, and{" "}
                <span className="text-purple-500">Innovate</span> with Electronics
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Join our community of electronics enthusiasts, share projects, learn from experts, and build the future
                together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-emerald-500 text-black hover:bg-emerald-600">
                  Become a Member <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10">
                  Explore Projects
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="h-8 w-8 text-emerald-500" />
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 backdrop-blur-sm bg-black/40">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission & Vision</h2>
              <div className="w-24 h-1 bg-emerald-500 mx-auto mb-6"></div>
              <p className="text-lg text-gray-300">
                The Circuit Breaker is dedicated to fostering innovation and knowledge sharing in the field of
                electronics and electrical engineering. We aim to create a collaborative environment where students can
                learn, experiment, and grow their technical skills.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-900/60 p-8 rounded-xl border border-white/10 hover:border-emerald-500/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                  <span className="text-emerald-500 text-xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Learn</h3>
                <p className="text-gray-400">
                  Access our extensive library of resources, tutorials, and workshops to build your electronics
                  knowledge.
                </p>
              </div>
              <div className="bg-gray-900/60 p-8 rounded-xl border border-white/10 hover:border-blue-500/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                  <span className="text-blue-500 text-xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Create</h3>
                <p className="text-gray-400">
                  Build innovative projects with our resources, mentorship, and collaborative environment.
                </p>
              </div>
              <div className="bg-gray-900/60 p-8 rounded-xl border border-white/10 hover:border-purple-500/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                  <span className="text-purple-500 text-xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Share</h3>
                <p className="text-gray-400">
                  Showcase your work, get feedback from peers, and inspire the next generation of engineers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Preview Section */}
        <section id="projects" className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Featured Projects</h2>
              <div className="w-24 h-1 bg-blue-500 mx-auto mb-6"></div>
              <p className="text-lg text-gray-300">
                Explore innovative electronics projects created by our community members.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ProjectCard
                title="Smart Home Automation System"
                author="Alex Chen"
                year="2023"
                components={["Arduino Uno", "ESP8266", "Relay Module"]}
                image="/placeholder.svg?height=200&width=400"
                tags={["IoT", "Home Automation"]}
              />
              <ProjectCard
                title="Gesture Controlled Robot"
                author="Priya Sharma"
                year="2023"
                components={["Arduino Nano", "MPU6050", "L298N Motor Driver"]}
                image="/placeholder.svg?height=200&width=400"
                tags={["Robotics", "Sensors"]}
              />
              <ProjectCard
                title="Solar Powered Weather Station"
                author="Michael Johnson"
                year="2022"
                components={["ESP32", "DHT22", "Solar Panel"]}
                image="/placeholder.svg?height=200&width=400"
                tags={["Renewable Energy", "IoT"]}
              />
            </div>
            <div className="text-center mt-12">
              <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-500/10">
                View All Projects <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Events Preview Section */}
        <section id="events" className="py-24 backdrop-blur-sm bg-black/40">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Upcoming Events</h2>
              <div className="w-24 h-1 bg-purple-500 mx-auto mb-6"></div>
              <p className="text-lg text-gray-300">
                Join our workshops, hackathons, and tech talks to enhance your skills and network with fellow
                enthusiasts.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <EventCard
                title="PCB Design Workshop"
                date="May 15, 2025"
                location="Engineering Building, Room 302"
                description="Learn the fundamentals of PCB design using Eagle CAD. Perfect for beginners!"
                image="/placeholder.svg?height=200&width=400"
              />
              <EventCard
                title="Electronics Hackathon"
                date="June 10-12, 2025"
                location="Innovation Center"
                description="48-hour hackathon to build innovative electronic solutions for real-world problems."
                image="/placeholder.svg?height=200&width=400"
              />
            </div>
            <div className="text-center mt-12">
              <Button variant="outline" className="border-purple-500 text-purple-500 hover:bg-purple-500/10">
                View All Events <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">What Our Members Say</h2>
              <div className="w-24 h-1 bg-emerald-500 mx-auto mb-6"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <TestimonialCard
                quote="Joining The Circuit Breaker was the best decision I made in college. The resources and mentorship helped me land my dream job at a tech company."
                name="Sarah Williams"
                role="Alumni, Class of 2022"
                avatar="/placeholder.svg?height=100&width=100"
              />
              <TestimonialCard
                quote="The project collaborations and workshops expanded my knowledge beyond the classroom. I've built a network that will last throughout my career."
                name="David Kumar"
                role="Senior Member"
                avatar="/placeholder.svg?height=100&width=100"
              />
              <TestimonialCard
                quote="As a freshman with no prior electronics experience, the club provided a supportive environment to learn and experiment. Now I'm leading my own projects!"
                name="Emma Chen"
                role="Junior Member"
                avatar="/placeholder.svg?height=100&width=100"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 backdrop-blur-sm bg-black/60">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join Our Community?</h2>
              <p className="text-xl text-gray-300 mb-8">
                Become a member today and start your journey in electronics innovation.
              </p>
              <Button size="lg" className="bg-emerald-500 text-black hover:bg-emerald-600">
                Sign Up Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <Link href="/" className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                    <span className="font-bold text-black text-xs">CB</span>
                  </div>
                  <span className="font-bold">The Circuit Breaker</span>
                </Link>
                <p className="text-sm text-gray-400">Empowering the next generation of electronics innovators.</p>
              </div>
              <div>
                <h3 className="font-bold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                      Projects
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                      Events
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                      Library
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                      Tutorials
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                      Datasheets
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                      Question Papers
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                      Blog
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4">Contact Us</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Engineering Building, Room 105
                  <br />
                  University Campus
                  <br />
                  contact@circuitbreaker.edu
                </p>
                <div className="flex gap-4">
                  <Link href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                    <span className="sr-only">Twitter</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                  </Link>
                  <Link href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                    <span className="sr-only">Instagram</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </Link>
                  <Link href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                    <span className="sr-only">GitHub</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                  </Link>
                  <Link href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                    <span className="sr-only">YouTube</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            <div className="border-t border-white/10 mt-12 pt-6 text-center">
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} The Circuit Breaker. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
