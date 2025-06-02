"use client"

import React from "react"

interface AuthErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface AuthErrorBoundaryProps {
  children: React.ReactNode
}

export class AuthErrorBoundary extends React.Component<AuthErrorBoundaryProps, AuthErrorBoundaryState> {
  constructor(props: AuthErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): AuthErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Authentication error:", error.message, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-red-400">Authentication Error</h2>
            <p className="text-gray-400">Something went wrong with authentication. Please try refreshing the page.</p>
            <button
              onClick={() => {
                this.setState({ hasError: false })
                window.location.reload()
              }}
              className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
