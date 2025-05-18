import Link from "next/link"
import { CircuitBackground } from "./circuit-background"
import { TestNavigation } from "./test-navigation"

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <CircuitBackground />

      {/* Header */}
      <header className="relative z-10 p-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-green-500 text-black font-bold rounded-full h-10 w-10 flex items-center justify-center mr-2">
            CB
          </div>
          <h1 className="text-xl font-bold">Circuit Breaker</h1>
        </div>

        <nav className="hidden md:flex space-x-4">
          <Link href="/dashboard" className="hover:text-green-400 transition-colors">
            Member Dashboard
          </Link>
          <Link href="/dashboard/admin" className="hover:text-green-400 transition-colors">
            Admin Dashboard
          </Link>
          <Link href="/dashboard/alumni" className="hover:text-green-400 transition-colors">
            Alumni Dashboard
          </Link>
        </nav>

        <div>
          <Link
            href="/dashboard"
            className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-md font-medium transition-colors"
          >
            Enter Portal
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <h2 className="text-5xl md:text-7xl font-bold mb-6">
          Welcome to <span className="text-green-500">Circuit Breaker</span>
        </h2>
        <p className="text-xl md:text-2xl max-w-3xl mb-8">
          The premier electronics club for innovation, learning, and community.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/dashboard"
            className="bg-green-500 hover:bg-green-600 text-black px-6 py-3 rounded-md font-medium text-lg transition-colors"
          >
            Join the Club
          </Link>
          <Link
            href="/dashboard/projects"
            className="bg-transparent border border-green-500 text-green-500 hover:bg-green-500 hover:text-black px-6 py-3 rounded-md font-medium text-lg transition-colors"
          >
            Explore Projects
          </Link>
        </div>
      </main>

      {/* Testing Navigation */}
      <TestNavigation />
    </div>
  )
}
