import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h2 className="text-4xl font-bold mb-4">404 - Page Not Found</h2>
      <p className="text-muted-foreground mb-8">The page you're looking for doesn't exist.</p>
      <Link href="/">
        <Button>Return Home</Button>
      </Link>
    </div>
  )
} 