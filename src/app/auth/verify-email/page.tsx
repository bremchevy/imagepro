'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Mail, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react'

export default function VerifyEmail() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50/50 to-white">
      <Card className="w-full max-w-md p-6 mx-4">
        <div className="text-center mb-6">
          <Mail className="h-10 w-10 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
          <p className="text-gray-600">
            We've sent a verification link to <span className="font-medium">{email}</span>
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
            </div>
            <div>
              <h3 className="font-medium">Open your email</h3>
              <p className="text-sm text-gray-600">Look for an email from us with the verification link</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              <ArrowRight className="h-5 w-5 text-primary mt-0.5" />
            </div>
            <div>
              <h3 className="font-medium">Click the link</h3>
              <p className="text-sm text-gray-600">This will verify your email and complete your registration</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
            </div>
            <div>
              <h3 className="font-medium">Check spam folder</h3>
              <p className="text-sm text-gray-600">If you don't see the email, check your spam folder</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-4">
            Didn't receive the email? Try signing up with a different email address.
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link href="/auth/signup">
              Try a different email
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  )
}