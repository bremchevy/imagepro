'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/components/providers/auth-provider'
import { Twitter, Mail, User, Lock } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { Checkbox } from '@/components/ui/checkbox'

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signUp, user, signInWithTwitter, signInWithGoogle } = useAuth()

  // Check if user is already authenticated
  useEffect(() => {
    if (user) {
      const redirectPath = searchParams.get('redirectedFrom') || '/tools';
      router.push(redirectPath);
    }
  }, [user, router, searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match", {
        description: "Please make sure your passwords match and try again.",
      });
      setIsLoading(false)
      return
    }

    // Validate password strength
    if (formData.password.length < 6) {
      toast.error("Password too short", {
        description: "Password must be at least 6 characters long.",
      });
      setIsLoading(false)
      return
    }

    // Validate terms agreement
    if (!agreeToTerms) {
      toast.error("Terms and conditions required", {
        description: "Please agree to our terms and conditions to continue.",
      });
      setIsLoading(false)
      return
    }

    try {
      // Start redirecting immediately to improve perceived performance
      setIsRedirecting(true)
      
      // Show a loading toast that will be replaced by success
      const loadingToast = toast.loading("Creating your account...", {
        duration: 2000,
      });
      
      const { error } = await signUp(
        formData.email,
        formData.password,
        formData.name
      )

      if (error) {
        toast.dismiss(loadingToast);
        toast.error("Failed to sign up", {
          description: error instanceof Error ? error.message : "Please try again.",
        });
        setIsRedirecting(false)
      } else {
        // Update the loading toast to success
        toast.dismiss(loadingToast);
        toast.success("Account created successfully!", {
          description: "Please check your email to verify your account.",
        });
        
        // Navigate to verify email page
        router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`)
      }
    } catch (err) {
      setIsRedirecting(false)
      toast.error("An unexpected error occurred", {
        description: err instanceof Error ? err.message : "Please try again later.",
      });
    } finally {
      setIsLoading(false)
    }
  }

  const handleTwitterSignUp = async () => {
    try {
      setIsLoading(true)
      setIsRedirecting(true)
      
      // Show a loading toast
      const loadingToast = toast.loading("Signing up with Twitter...", {
        duration: 2000,
      });
      
      await signInWithTwitter()
      
      // Success notification will be shown after redirect
      toast.dismiss(loadingToast);
    } catch (err) {
      setIsRedirecting(false)
      toast.error("Failed to sign up with Twitter", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true)
      setIsRedirecting(true)
      
      // Show a loading toast
      const loadingToast = toast.loading("Signing up with Google...", {
        duration: 2000,
      });
      
      await signInWithGoogle()
      
      // Success notification will be shown after redirect
      toast.dismiss(loadingToast);
    } catch (err) {
      setIsRedirecting(false)
      toast.error("Failed to sign up with Google", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50/50 to-white">
      <Card className="w-full max-w-md p-6 mx-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create an Account</h1>
          <p className="text-sm text-gray-600">Sign up to access all features</p>
        </div>

        <div className="space-y-4">
          {/* Social Sign Up Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleTwitterSignUp}
              disabled={isLoading || isRedirecting}
            >
              <Twitter className="mr-2 h-4 w-4" />
              Twitter
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
              onClick={handleGoogleSignUp}
              disabled={isLoading || isRedirecting}
            >
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
              </svg>
              Google
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  className="pl-9"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isRedirecting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-9"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isRedirecting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isRedirecting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={isRedirecting}
                />
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox 
                id="terms" 
                checked={agreeToTerms} 
                onCheckedChange={(checked: boolean | 'indeterminate') => setAgreeToTerms(checked === true)}
                disabled={isRedirecting}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || isRedirecting}>
              {isLoading ? "Creating account..." : isRedirecting ? "Redirecting..." : "Sign Up"}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/auth/signin" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}