import { Mail, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VerifyEmailCardProps {
  email: string;
}

export function VerifyEmailCard({ email }: VerifyEmailCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-lg bg-gradient-to-b from-background to-muted/20">
      <CardHeader className="space-y-2 pb-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-4 ring-8 ring-primary/5">
            <Mail className="h-8 w-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Check your email
        </CardTitle>
        <CardDescription className="text-center text-base">
          We've sent a verification link to
          <span className="font-semibold text-foreground mx-1">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-muted-foreground/20" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Next steps</span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <div className="mt-0.5 h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-[10px] font-semibold text-primary">1</span>
            </div>
            <div>
              <p className="text-xs font-medium">Open your email</p>
              <p className="text-[11px] text-muted-foreground">Look for an email from us with the verification link</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <div className="mt-0.5 h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-[10px] font-semibold text-primary">2</span>
            </div>
            <div>
              <p className="text-xs font-medium">Click the link</p>
              <p className="text-[11px] text-muted-foreground">This will verify your email and complete your registration</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <div className="mt-0.5 h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-[10px] font-semibold text-primary">3</span>
            </div>
            <div>
              <p className="text-xs font-medium">Check spam folder</p>
              <p className="text-[11px] text-muted-foreground">If you don't see the email, check your spam folder</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="w-full rounded-lg bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground text-center">
            Didn't receive the email? Try signing up with a different email address.
          </p>
        </div>
        <Button 
          variant="ghost" 
          className="w-full text-muted-foreground hover:text-foreground"
          onClick={() => window.location.href = '/auth/signup'}
        >
          Try a different email
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
} 