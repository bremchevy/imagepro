"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { User, LogOut, Image as ImageIcon, LayoutDashboard, Loader2, Settings, Menu, X, Wrench, CreditCard, Info, Mail } from "lucide-react";
import { useProfile } from '@/features/user-management/hooks/useProfile';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import Image from "next/image";

// Add this interface near the top of the file
interface User {
  email?: string;
  [key: string]: any;
}

export function MarketingNav() {
  const pathname = usePathname();
  const { user, signOut, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Cast user to our User interface
  const typedUser = user as User | null;

  const isDashboard = pathname.startsWith('/dashboard');
  const isUserManagement = pathname === '/dashboard/account/user-management';
  const isLoading = authLoading || profileLoading;

  // Add debug logs
  console.log('Auth State:', {
    user,
    authLoading,
    profileLoading,
    isLoading
  });

  const handleUserManagementClick = async () => {
    router.push('/dashboard/account/user-management');
  };

  const NavLinks = () => (
    <>
      {isDashboard && !isUserManagement ? (
        <>
          <Link
            href="/dashboard"
            className={`nav-link flex items-center w-full p-2 rounded-lg hover:bg-primary/10 transition-colors ${
              pathname === "/dashboard" ? "bg-primary/10 text-primary" : ""
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/images"
            className={`nav-link flex items-center w-full p-2 rounded-lg hover:bg-primary/10 transition-colors ${
              pathname === "/dashboard/images" ? "bg-primary/10 text-primary" : ""
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            My Images
          </Link>
        </>
      ) : null}
      <Link
        href="/tools"
        className={`nav-link flex items-center w-full p-2 rounded-lg hover:bg-primary/10 transition-colors ${
          pathname === "/tools" ? "bg-primary/10 text-primary" : ""
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        Tools
      </Link>
      <Link
        href="/pricing"
        className={`nav-link flex items-center w-full p-2 rounded-lg hover:bg-primary/10 transition-colors ${
          pathname === "/pricing" ? "bg-primary/10 text-primary" : ""
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        Pricing
      </Link>
      <Link
        href="/about"
        className={`nav-link flex items-center w-full p-2 rounded-lg hover:bg-primary/10 transition-colors ${
          pathname === "/about" ? "bg-primary/10 text-primary" : ""
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        About
      </Link>
      <Link
        href="/contact"
        className={`nav-link flex items-center w-full p-2 rounded-lg hover:bg-primary/10 transition-colors ${
          pathname === "/contact" ? "bg-primary/10 text-primary" : ""
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        Contact
      </Link>
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
                      {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full sm:max-w-md p-0 bg-gradient-to-b from-background to-background/95">
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between p-4 border-b bg-primary/5">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Menu</span>
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto">
                        <div className="flex flex-col space-y-1 p-4">
                      <NavLinks />
                        </div>
                      </div>
                      {!user ? (
                        <div className="p-4 border-t space-y-2 bg-primary/5">
                        <Link 
                          href="/auth/signin" 
                            className="flex items-center justify-center w-full text-sm font-medium transition-all duration-200 rounded-lg hover:bg-primary/10 px-4 py-2 border border-primary/20"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Log in
                        </Link>
                        <Button 
                            className="w-full text-sm font-medium transition-all duration-200 rounded-lg hover:shadow-lg"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            router.push('/auth/signup');
                          }}
                        >
                          Get Started
                        </Button>
                      </div>
                      ) : (
                        <div className="p-4 border-t space-y-2 bg-primary/5">
                          <div className="flex items-center gap-3 mb-4">
                            <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                              {profileLoading ? (
                                <div className="flex items-center justify-center h-full w-full">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                </div>
                              ) : (
                                <>
                                  <AvatarImage src={profile?.avatar_url || ''} />
                                  <AvatarFallback className="bg-primary/10 text-primary">
                                    {typedUser?.email ? typedUser.email.charAt(0).toUpperCase() : 'U'}
                                  </AvatarFallback>
                                </>
                              )}
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{typedUser?.email || 'User'}</p>
                              <p className="text-xs text-muted-foreground">
                                {profile?.full_name || 'User'}
                              </p>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            className="w-full text-sm font-medium transition-all duration-200 rounded-lg hover:bg-primary/10 border-primary/20"
                            onClick={() => {
                              setMobileMenuOpen(false);
                              router.push('/dashboard/settings');
                            }}
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full text-sm font-medium transition-all duration-200 rounded-lg hover:bg-primary/10 border-primary/20"
                            onClick={() => {
                              setMobileMenuOpen(false);
                              handleUserManagementClick();
                            }}
                          >
                            <User className="mr-2 h-4 w-4" />
                            User Management
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full text-sm font-medium transition-all duration-200 rounded-lg hover:bg-red-50 text-red-600 border-red-200"
                            onClick={async () => {
                              setMobileMenuOpen(false);
                              await signOut();
                              router.push('/');
                            }}
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                          </Button>
                        </div>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                {/* Mobile Menu Button - Always visible on mobile */}
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                      {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full sm:max-w-md p-0 bg-gradient-to-b from-background to-background/95">
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between p-4 border-b bg-primary/5">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Menu</span>
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto">
                        <div className="flex flex-col space-y-1 p-4">
                          <NavLinks />
                        </div>
                      </div>
                      <div className="p-4 border-t space-y-2 bg-primary/5">
                        <div className="flex items-center gap-3 mb-4">
                          <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                            {profileLoading ? (
                              <div className="flex items-center justify-center h-full w-full">
                                <Loader2 className="h-4 w-4 animate-spin" />
                              </div>
                            ) : (
                              <>
                                <AvatarImage src={profile?.avatar_url || ''} />
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {typedUser?.email ? typedUser.email.charAt(0).toUpperCase() : 'U'}
                                </AvatarFallback>
                              </>
                            )}
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{typedUser?.email || 'User'}</p>
                            <p className="text-xs text-muted-foreground">
                              {profile?.full_name || 'User'}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full text-sm font-medium transition-all duration-200 rounded-lg hover:bg-primary/10 border-primary/20"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            router.push('/dashboard/settings');
                          }}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full text-sm font-medium transition-all duration-200 rounded-lg hover:bg-primary/10 border-primary/20"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            handleUserManagementClick();
                          }}
                        >
                          <User className="mr-2 h-4 w-4" />
                          User Management
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full text-sm font-medium transition-all duration-200 rounded-lg hover:bg-red-50 text-red-600 border-red-200"
                          onClick={async () => {
                            setMobileMenuOpen(false);
                            await signOut();
                            router.push('/');
                          }}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
                
                {/* Desktop User Menu - Hidden on mobile */}
                <div className="hidden md:block">
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
                              {typedUser?.email ? typedUser.email.charAt(0).toUpperCase() : 'U'}
                            </AvatarFallback>
                          </>
                        )}
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 p-0">
                      <div className="flex items-center justify-start gap-2 p-3 border-b">
                        <Avatar className="h-10 w-10">
                          {profileLoading ? (
                            <div className="flex items-center justify-center h-full w-full">
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                          ) : (
                            <>
                              <AvatarImage src={profile?.avatar_url || ''} />
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {typedUser?.email ? typedUser.email.charAt(0).toUpperCase() : 'U'}
                              </AvatarFallback>
                            </>
                          )}
                        </Avatar>
                      <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{typedUser?.email || 'User'}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {profile?.full_name || 'User'}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                      <div className="py-1">
                        <DropdownMenuItem onClick={handleUserManagementClick} className="px-3 py-2 cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        User Management
                      </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push('/dashboard/settings')} className="px-3 py-2 cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                      </div>
                    <DropdownMenuSeparator />
                      <div className="py-1">
                      <DropdownMenuItem
                        onClick={async () => {
                          await signOut();
                          router.push('/');
                        }}
                          className="px-3 py-2 cursor-pointer text-red-600 focus:text-red-600"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}