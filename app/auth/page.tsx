"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { supabase } from "@/lib/supabase"
import { CircuitBackground } from "@/components/circuit-background"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

export default function AuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectedFrom = searchParams.get("redirectedFrom") || "/dashboard"
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("signin")

  // Custom registration form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [selectedRole, setSelectedRole] = useState("member")
  const [requestReason, setRequestReason] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setMounted(true)

    const checkInitialAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) {
        router.push(redirectedFrom)
      }
    }

    checkInitialAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        // Ensure profile exists before redirecting
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

        if (!profile) {
          // Create profile if it doesn't exist
          await supabase.from("profiles").insert({
            id: session.user.id,
            email: session.user.email,
            username: session.user.email?.split("@")[0] || `user_${Date.now()}`,
            full_name: session.user.user_metadata.full_name || "",
            avatar_url: session.user.user_metadata.avatar_url || "",
            role: "member",
            points: 0,
          })
        }

        router.push(redirectedFrom)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, redirectedFrom])

  // Custom registration handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Register the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            requested_role: selectedRole,
          },
        },
      })

      if (error) throw error

      if (data.user) {
        // Create profile
        await supabase.from("profiles").insert({
          id: data.user.id,
          username: email.split("@")[0],
          full_name: fullName,
          role: "member", // Default role until approved
          points: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        // Create role request if not member
        if (selectedRole !== "member") {
          await supabase.from("role_requests").insert({
            user_id: data.user.id,
            requested_role: selectedRole,
            request_reason: requestReason,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
        }

        toast({
          title: "Registration successful!",
          description:
            selectedRole !== "member"
              ? "Your account has been created and your role request has been submitted for approval."
              : "Your account has been created successfully.",
        })

        // Redirect to dashboard
        router.push("/dashboard")
      }
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* 3D Circuit Animation Background */}
      <div className="fixed inset-0 z-0">
        <CircuitBackground />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                <span className="font-bold text-black">CB</span>
              </div>
              <span className="font-bold text-xl">The Circuit Breaker</span>
            </Link>
          </div>
        </header>

        {/* Auth Container */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md p-8 space-y-8 bg-gray-900/80 backdrop-blur-md rounded-xl border border-white/10">
            <div className="text-center">
              <h1 className="text-3xl font-bold">Welcome</h1>
              <p className="mt-2 text-gray-400">Sign in to your account or create a new one</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="mt-4">
                <Auth
                  supabaseClient={supabase}
                  view="sign_in"
                  appearance={{
                    theme: ThemeSupa,
                    variables: {
                      default: {
                        colors: {
                          brand: "#4ade80",
                          brandAccent: "#22c55e",
                          inputBackground: "rgb(17, 24, 39)",
                          inputBorder: "rgb(75, 85, 99)",
                          inputText: "white",
                          inputPlaceholder: "rgb(156, 163, 175)",
                        },
                      },
                    },
                    className: {
                      button: "bg-emerald-500 hover:bg-emerald-600 text-black",
                      input: "bg-gray-800 border-gray-700 text-white",
                      label: "text-gray-300",
                      anchor: "text-emerald-500 hover:text-emerald-400",
                      message: "text-gray-300",
                    },
                  }}
                  providers={["google"]}
                  redirectTo={`${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback`}
                  theme="dark"
                  socialLayout="horizontal"
                />
              </TabsContent>

              <TabsContent value="register" className="mt-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-gray-800 border-gray-700 text-white"
                      minLength={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Role Request</Label>
                    <RadioGroup
                      value={selectedRole}
                      onValueChange={setSelectedRole}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="member" id="member" />
                        <Label htmlFor="member">Member</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="alumni" id="alumni" />
                        <Label htmlFor="alumni">Alumni</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {selectedRole !== "member" && (
                    <div className="space-y-2">
                      <Label htmlFor="requestReason">Request Reason</Label>
                      <Textarea
                        id="requestReason"
                        value={requestReason}
                        onChange={(e) => setRequestReason(e.target.value)}
                        required
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="Why are you requesting this role?"
                      />
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-black"
                    disabled={loading}
                  >
                    {loading ? "Registering..." : "Register"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="text-center text-sm text-gray-400">
              <p>
                By signing in, you agree to our{" "}
                <Link href="#" className="text-emerald-500 hover:text-emerald-400">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-emerald-500 hover:text-emerald-400">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/10 py-4 backdrop-blur-md">
          <div className="container mx-auto px-4 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} The Circuit Breaker. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
