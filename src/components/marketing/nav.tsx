"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Settings, LogOut } from "lucide-react";

export function MarketingNav() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-4 z-50 w-full">
      <nav className="container mx-auto max-w-6xl">
        <div className="flex h-16 items-center justify-between rounded-full border bg-background/95 px-6 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex">
            <Link 
              href="/" 
              className="flex items-center space-x-2"
            >
              <span className="font-bold text-xl text-primary">Imagepro</span>
            </Link>
          </div>
          <div className="flex items-center space-x-3 md:space-x-6">
            <div className="hidden md:flex items-center space-x-3">
              <Link
                href="/tools"
                className={`text-sm font-medium transition-all duration-200 rounded-full px-3 py-2 ${
                  pathname === "/tools"
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:text-foreground hover:bg-primary/10"
                }`}
              >
                Tools
              </Link>
              <Link
                href="/pricing"
                className={`text-sm font-medium transition-all duration-200 rounded-full px-3 py-2 ${
                  pathname === "/pricing"
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:text-foreground hover:bg-primary/10"
                }`}
              >
                Pricing
              </Link>
              <Link
                href="/about"
                className={`text-sm font-medium transition-all duration-200 rounded-full px-3 py-2 ${
                  pathname === "/about"
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:text-foreground hover:bg-primary/10"
                }`}
              >
                About
              </Link>
              <Link
                href="/contact"
                className={`text-sm font-medium transition-all duration-200 rounded-full px-3 py-2 ${
                  pathname === "/contact"
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:text-foreground hover:bg-primary/10"
                }`}
              >
                Contact
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              {!user ? (
                <div className="flex items-center space-x-2">
                  <Link 
                    href="/login" 
                    className="text-sm font-medium transition-all duration-200 rounded-full hover:bg-primary/10 px-4 py-2"
                  >
                    Log in
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar className="h-8 w-8 hover:opacity-80 cursor-pointer">
                        <AvatarImage src={user?.user_metadata?.avatar_url} />
                        <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push('/dashboard/account')}>
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
              )}
            </div>
            <button
              className="md:hidden p-2 rounded-lg hover:bg-primary/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute inset-x-0 top-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border shadow-lg p-4 mx-4">
            <div className="flex flex-col space-y-4">
              <Link
                href="/tools"
                className={`text-sm font-medium transition-all duration-200 rounded-full px-3 py-2 ${
                  pathname === "/tools"
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:text-foreground hover:bg-primary/10"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Tools
              </Link>
              <Link
                href="/pricing"
                className={`text-sm font-medium transition-all duration-200 rounded-full px-3 py-2 ${
                  pathname === "/pricing"
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:text-foreground hover:bg-primary/10"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/about"
                className={`text-sm font-medium transition-all duration-200 rounded-full px-3 py-2 ${
                  pathname === "/about"
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:text-foreground hover:bg-primary/10"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className={`text-sm font-medium transition-all duration-200 rounded-full px-3 py-2 ${
                  pathname === "/contact"
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:text-foreground hover:bg-primary/10"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              {!user && (
                <Button 
                  className="text-sm font-medium transition-all duration-200 rounded-full hover:shadow-lg w-full"
                  onClick={() => {
                    router.push('/signup');
                    setMobileMenuOpen(false);
                  }}
                >
                  Get Started
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}