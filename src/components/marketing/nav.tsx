"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, LogOut, Image, LayoutDashboard, Loader2 } from "lucide-react";
import { useProfile } from '@/features/user-management/hooks/useProfile';

export function MarketingNav() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { profile, loading } = useProfile();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto max-w-6xl">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex">
            <Link 
              href="/" 
              className="flex items-center space-x-2"
            >
              <span className="font-bold text-xl text-primary">ImagePro</span>
            </Link>
          </div>
          <div className="flex items-center space-x-2">
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
              <>
                <div className="hidden md:flex items-center space-x-3">
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
                <div className="flex items-center space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar className="h-8 w-8 hover:opacity-80 cursor-pointer">
                        {loading ? (
                          <div className="flex items-center justify-center h-full w-full">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        ) : (
                          <>
                            <AvatarImage src={profile?.avatar_url || ''} />
                            <AvatarFallback>
                              {user?.email?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </>
                        )}
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push('/dashboard/account/user-management')}>
                        <User className="mr-2 h-4 w-4" />
                        User Management
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
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}