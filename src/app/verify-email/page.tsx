'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { VerifyEmailCard } from '@/components/auth/verify-email-card';
import { useAuth } from '@/components/providers/auth-provider';

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    // Check if we have an email in the URL params
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    } else if (user?.email) {
      setEmail(user.email);
    } else {
      // If no email is found, redirect to signup
      router.push('/auth/signup');
    }
  }, [searchParams, user, router]);

  if (!email) {
    return null;
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <VerifyEmailCard email={email} />
    </div>
  );
} 