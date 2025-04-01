"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { User, LogOut, Image, LayoutDashboard, Loader2, Settings, Menu, X } from "lucide-react";
import { useProfile } from '@/features/user-management/hooks/useProfile';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function MarketingNav() {
  const pathname = usePathname();
  const { user, signOut, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDashboard = pathname.startsWith('/dashboard');
  const isLoading = authLoading || profileLoading;

  const handleUserManagementClick = async () => {
    router.push('/dashboard/account/user-management');
  };

  const NavLinks = () => (
    <>
      {isDashboard ? (
        <>
          <Link
            href="/tools"
            className={`nav-link ${
              pathname === "/tools" ? "nav-link-active" : ""
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Tools
          </Link>
          <Link
            href="/pricing"
            className={`nav-link ${
              pathname === "/pricing" ? "nav-link-active" : ""
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Pricing
          </Link>
          <Link
            href="/about"
            className={`nav-link ${
              pathname === "/about" ? "nav-link-active" : ""
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={`nav-link ${
              pathname === "/contact" ? "nav-link-active" : ""
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </Link>
        </>
      ) : (
        <>
          <Link
            href="/tools"
            className={`nav-link ${
              pathname === "/tools" ? "nav-link-active" : ""
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Tools
          </Link>
          <Link
            href="/pricing"
            className={`nav-link ${
              pathname === "/pricing" ? "nav-link-active" : ""
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Pricing
          </Link>
          <Link
            href="/about"
            className={`nav-link ${
              pathname === "/about" ? "nav-link-active" : ""
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={`nav-link ${
              pathname === "/contact" ? "nav-link-active" : ""
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </Link>
        </>
      )}
    </>
  );

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
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <NavLinks />
            </div>
          </div>

          {/* Right side - Auth elements */}
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : !user ? (
              <>
                <div className="hidden md:flex items-center space-x-4">
                  <Link 
                    href="/auth/signin" 
                    className="text-sm font-medium transition-all duration-200 rounded-full hover:bg-primary/10 px-4 py-2"
                  >
                    Log in
                  </Link>
                  <Button 
                    className="text-sm font-medium transition-all duration-200 rounded-full hover:shadow-lg"
                    onClick={() => router.push('/auth/signup')}
                  >
                    Get Started
                  </Button>
                </div>
                {/* Mobile Menu Button */}
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                    <div className="flex flex-col space-y-4 mt-4">
                      <NavLinks />
                      <div className="flex flex-col space-y-2 pt-4 border-t">
                        <Link 
                          href="/auth/signin" 
                          className="text-sm font-medium transition-all duration-200 rounded-full hover:bg-primary/10 px-4 py-2"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Log in
                        </Link>
                        <Button 
                          className="text-sm font-medium transition-all duration-200 rounded-full hover:shadow-lg"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            router.push('/auth/signup');
                          }}
                        >
                          Get Started
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-8 w-8 hover:opacity-80 cursor-pointer ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-200">
                      {profileLoading ? (
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