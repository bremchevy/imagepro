'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAuth } from '@/contexts/auth-context'
import { Label } from '@/components/ui/label'
import { Loader2, Mail, ArrowLeft } from 'lucide-react'

interface AuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultView?: 'signin' | 'signup'
}

export function AuthDialog({ open, onOpenChange, defaultView = 'signup' }: AuthDialogProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isVerificationSent, setIsVerificationSent] = useState(false)
  const [view, setView] = useState<'signin' | 'signup' | 'forgot-password'>(defaultView)
  const { signIn, signUp, resetPassword, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      onOpenChange(false)
      router.push('/dashboard')
    }
  }, [user, onOpenChange, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (view === 'signup') {
        await signUp(email, password)
        onOpenChange(false)
        router.push('/dashboard')
      } else {
        await signIn(email, password)
        onOpenChange(false)
        router.push('/dashboard')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleResendEmail = async () => {
    setError(null)
    setLoading(true)

    try {
      await signUp(email, password)
      setError('A new verification email has been sent.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    setIsVerificationSent(false)
    setError(null)
  }

  const toggleView = () => {
    setView(view === 'signin' ? 'signup' : 'signin')
    setError(null)
  }

  const handleForgotPassword = async () => {
    setError(null)
    setLoading(true)

    try {
      await resetPassword(email)
      setIsVerificationSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (isVerificationSent) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] min-h-[600px] flex flex-col">
          <DialogHeader className="flex-1 flex flex-col items-center justify-center space-y-6">
            <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2 text-center">
              <DialogTitle className="text-2xl font-bold">
                {view === 'forgot-password' ? 'Check your email' : 'Check your email'}
              </DialogTitle>
              <DialogDescription className="text-base">
                {view === 'forgot-password'
                  ? 'We\'ve sent you a password reset link to'
                  : 'We\'ve sent you a verification link to'}
                <div className="font-medium text-foreground mt-1">{email}</div>
              </DialogDescription>
            </div>
          </DialogHeader>
          <div className="flex flex-col items-center gap-6">
            <Button 
              variant="outline" 
              className="w-full h-12"
              onClick={() => {
                setView('signin')
                setIsVerificationSent(false)
                setError(null)
              }}
            >
              Return to sign in
            </Button>
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Didn't receive an email?
              </p>
              <Button
                variant="ghost"
                disabled={loading}
                onClick={view === 'forgot-password' ? handleForgotPassword : handleResendEmail}
                className="h-auto p-0 text-primary hover:text-primary/90"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Try again"
                )}
              </Button>
            </div>
            <Button
              variant="ghost"
              className="absolute top-4 left-4"
              onClick={handleBack}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] min-h-[600px]">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-2xl font-bold">
            {view === 'signup' ? 'Create an account' : 'Welcome back'}
          </DialogTitle>
          <DialogDescription className="text-base">
            {view === 'signup' 
              ? 'Enter your email below to create your account'
              : 'Enter your email and password to sign in'
            }
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoCapitalize="none"
                autoComplete={view === 'signup' ? 'new-password' : 'current-password'}
                autoCorrect="off"
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12"
              />
              {view === 'signin' && (
                <Button
                  variant="link"
                  className="justify-end h-auto p-0 text-sm text-primary hover:text-primary/90"
                  onClick={() => {
                    setView('forgot-password')
                    setError(null)
                  }}
                >
                  Forgot password?
                </Button>
              )}
            </div>
          </div>
          {error && (
            <div className="text-sm text-red-500">
              {error}
            </div>
          )}
          <Button 
            disabled={loading} 
            className="h-12"
            onClick={handleSubmit}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {view === 'signup' ? 'Creating account...' : 'Signing in...'}
              </>
            ) : (
              view === 'signup' ? 'Create account' : 'Sign in'
            )}
          </Button>
        </div>
        <div className="mt-6 text-center text-sm">
          {view === 'signup' ? (
            <>
              Already have an account?{" "}
              <Button 
                variant="link" 
                className="text-primary hover:text-primary/90 h-auto p-0"
                onClick={toggleView}
              >
                Sign in
              </Button>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <Button 
                variant="link" 
                className="text-primary hover:text-primary/90 h-auto p-0"
                onClick={toggleView}
              >
                Sign up
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}