'use client'

import { useState } from 'react'
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
import { useAuth } from '@/components/providers/auth-provider'
import { Label } from '@/components/ui/label'
import { Loader2, Mail, ArrowLeft } from 'lucide-react'

interface SignUpDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SignUpDialog({ open, onOpenChange }: SignUpDialogProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isVerificationSent, setIsVerificationSent] = useState(false)
  const { signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await signUp(email, password, `${firstName} ${lastName}`)
      setIsVerificationSent(true)
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
      await signUp(email, password, `${firstName} ${lastName}`)
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

  if (isVerificationSent) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] min-h-[600px] flex flex-col">
          <DialogHeader className="flex-1 flex flex-col items-center justify-center space-y-6">
            <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2 text-center">
              <DialogTitle className="text-2xl font-bold">Check your email</DialogTitle>
              <DialogDescription className="text-base">
                We've sent you a verification link to
                <div className="font-medium text-foreground mt-1">{email}</div>
              </DialogDescription>
            </div>
          </DialogHeader>
          <div className="flex flex-col items-center gap-6">
            <Button 
              variant="outline" 
              className="w-full h-12"
              onClick={() => onOpenChange(false)}
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
                onClick={handleResendEmail}
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
          <DialogTitle className="text-2xl font-bold">Create an account</DialogTitle>
          <DialogDescription className="text-base">
            Enter your information to create a new account
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="text-sm text-red-500">
                {error}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </Button>
          </DialogFooter>
        </form>
        <div className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Button 
            variant="link" 
            className="text-primary hover:text-primary/90 h-auto p-0"
            onClick={() => {
              // TODO: Switch to sign in view
            }}
          >
            Sign in
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 