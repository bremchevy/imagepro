'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function VerifyEmail() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Check your email
          </h1>
          <p className="text-sm text-muted-foreground">
            We&apos;ve sent you a verification link. Please check your email to verify your account.
          </p>
        </div>
        <div className="flex flex-col space-y-4">
          <Button asChild>
            <Link href="/login">
              Return to sign in
            </Link>
          </Button>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Didn&apos;t receive an email?{' '}
            <Link
              href="/signup"
              className="hover:text-brand underline underline-offset-4"
            >
              Try again
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}