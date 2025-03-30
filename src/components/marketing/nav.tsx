"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { User, LogOut, Image, LayoutDashboard, Loader2, Settings } from "lucide-react";
import { useProfile } from '@/features/user-management/hooks/useProfile';

export function MarketingNav() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { profile, loading } = useProfile();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDashboard = pathname.startsWith('/dashboard');

  const handleUserManagementClick = () => {
    if (user) {
      router.push('/dashboard/account/user-management');
    } else {
      // Store the intended destination
      sessionStorage.setItem('redirectAfterAuth', '/dashboard/account/user-management');
      router.push('/login');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto max-w-6xl">
        <div className="flex h-16 items-center justify-between px-4">
          {/* Left side - Company name and navigation */}
          <div className="flex items-center space-x-8">
            <Link 
              href="/" 
              className="flex items-center space-x-2"
            >
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">ImagePro</span>
            </Link>
            <div className="hidden md:flex items-center space-x-4">
                  {isDashboard ? (
                    <>
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
                    </>
                  ) : (
                    <>
                      <Link
                        href="/tools"
                        className={`nav-link ${
                          pathname === "/tools" ? "nav-link-active" : ""
                        }`}
                      >
                        Tools
                      </Link>
                      <Link
                        href="/pricing"
                        className={`nav-link ${
                          pathname === "/pricing" ? "nav-link-active" : ""
                        }`}
                      >
                        Pricing
                      </Link>
                      <Link
                        href="/about"
                        className={`nav-link ${
                          pathname === "/about" ? "nav-link-active" : ""
                        }`}
                      >
                        About
                      </Link>
                      <Link
                        href="/contact"
                        className={`nav-link ${
                          pathname === "/contact" ? "nav-link-active" : ""
                        }`}
                      >
                        Contact
                      </Link>
                    </>
                  )}
                </div>
          </div>

          {/* Right side - Auth elements */}
          <div className="flex items-center space-x-4">
            {!user ? (
              <>
                <Link 
                  href="/login" 
                  className="text-sm font-medium transition-all duration-200 rounded-full hover:bg-primary/10 px-4 py-2"
                >
                  Log in
                </Link>
                <Button 
                  className="text-sm font-medium transition-all duration-200 rounded-full hover:shadow-lg"
                  onClick={() => router.push('/signup')}
                >
                  Get Started
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Avatar className="h-8 w-8 hover:opacity-80 cursor-pointer ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-200">
                        {loading ? (
                          <div className="flex items-center justify-center h-full w-full">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        ) : (
                          <>
                            <AvatarImage src={profile?.avatar_url || ''} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                              {user?.email?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </>
                        )}
                      </Avatar>
                    </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.email}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {profile?.full_name || 'User'}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleUserManagementClick}>
                        <User className="mr-2 h-4 w-4" />
                        User Management
                      </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={async () => {
                          await signOut();
                          router.push('/');
                        }}
                      className="text-red-600 focus:text-red-600"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}