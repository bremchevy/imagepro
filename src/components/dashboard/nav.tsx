'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Settings, LogOut, Image, LayoutDashboard } from 'lucide-react'

export function DashboardNav() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const router = useRouter()

  return (
    <header className="sticky top-4 z-50 w-full">
      <nav className="container mx-auto max-w-6xl">
        <div className="flex h-16 items-center justify-between rounded-full border bg-background/95 px-6 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex">
            <Link 
              href="/dashboard" 
              className="flex items-center space-x-2"
            >
              <span className="font-bold text-xl text-primary">Imagepro</span>
            </Link>
          </div>
          <div className="flex items-center space-x-3 md:space-x-6">
            <div className="hidden md:flex items-center space-x-3">
              <Link
                href="/dashboard"
                className={`nav-link ${
                  pathname === "/dashboard" ? "nav-link-active" : ""
                }`}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/dashboard/images"
                className={`nav-link ${
                  pathname === "/dashboard/images" ? "nav-link-active" : ""
                }`}
              >
                <Image className="mr-2 h-4 w-4" />
                My Images
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 hover:opacity-80 cursor-pointer">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push('/dashboard/account/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Account Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={async () => {
                      await signOut();
                      router.push('/');
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
} 