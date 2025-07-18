"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { MicIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/components/auth-provider"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, rememberMe: checked }))
  }

  const validateForm = () => {
    let valid = true
    const newErrors = { email: "", password: "" }

    if (!formData.email) {
      newErrors.email = "Email is required"
      valid = false
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const success = await login(formData.email, formData.password)

      if (success) {
        router.push("/")
      } else {
        setErrors({
          email: "",
          password: "Invalid username or password. Please try again.",
        })
      }
    } catch (error) {
      console.error("Login failed:", error)
      setErrors({
        email: "",
        password: "An error occurred during login. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 subtle-pattern">
      <div className="w-full px-4 py-8">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-md gradient-bg text-white">
              <MicIcon className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold tracking-tight text-primary">Conversation AI</h1>
              <p className="text-xs text-muted-foreground">Multilingual Voice Call Analysis</p>
            </div>
          </div>
        </div>
        {/* MODIFIED: Changed max-w classes for better desktop width */}
        <Card className="shadow-lg border-primary/10 w-full max-w-md mx-auto sm:max-w-lg md:max-w-xl lg:max-w-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
            <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Username</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="Enter username"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={formData.rememberMe}
                  onCheckedChange={handleCheckboxChange}
                  disabled={isLoading}
                />
                <Label htmlFor="remember" className="text-sm font-normal">
                  Remember me for 30 days
                </Label>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-100 dark:border-blue-800/30">
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  <strong>Demo Credentials:</strong>
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                  Username: <strong>guest</strong>
                  <br />
                  Password: <strong>guuest@123</strong>
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </CardFooter>
          </form>
          <div className="px-8 pb-6 text-center">
            <div className="mt-2 text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </Card>
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Protected by reCAPTCHA and subject to the</p>
          <div className="flex justify-center gap-1">
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            <span>and</span>
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
