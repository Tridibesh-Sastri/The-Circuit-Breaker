"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CircuitBackground } from "@/components/circuit-background"

export function AuthForm() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState("member")
  const [activeTab, setActiveTab] = useState("login")

  // Store the selected role in localStorage when it changes
  const handleRoleChange = (value: string) => {
    setSelectedRole(value)
    localStorage.setItem("requestedRole", value)
  }

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <CircuitBackground className="absolute inset-0 z-0" />

      <Card className="w-full max-w-md z-10 bg-white/90 backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">The Circuit Breaker</CardTitle>
          <CardDescription className="text-center">Electronics Club Web Portal</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Auth
                supabaseClient={supabase}
                appearance={{
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: "#2563eb",
                        brandAccent: "#1d4ed8",
                      },
                    },
                  },
                  className: {
                    container: "auth-container",
                    button: "auth-button",
                    input: "auth-input",
                  },
                }}
                providers={["google"]}
                redirectTo={`${window.location.origin}/auth/callback`}
                view={activeTab === "login" ? "sign_in" : "sign_up"}
              />
            </TabsContent>

            <TabsContent value="signup">
              <div className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Select your role:</h3>
                  <RadioGroup value={selectedRole} onValueChange={handleRoleChange} className="flex flex-col space-y-2">
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

                <Auth
                  supabaseClient={supabase}
                  appearance={{
                    theme: ThemeSupa,
                    variables: {
                      default: {
                        colors: {
                          brand: "#2563eb",
                          brandAccent: "#1d4ed8",
                        },
                      },
                    },
                    className: {
                      container: "auth-container",
                      button: "auth-button",
                      input: "auth-input",
                    },
                  }}
                  providers={["google"]}
                  redirectTo={`${window.location.origin}/auth/callback`}
                  view="sign_up"
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-xs text-center text-gray-500">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
