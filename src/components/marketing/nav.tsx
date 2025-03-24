"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export function MarketingNav() {
  const pathname = usePathname();

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
          <div className="flex items-center space-x-3">
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
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button 
                  variant="ghost" 
                  className={`text-sm font-medium transition-all duration-200 rounded-full ${
                    pathname === "/login"
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-primary/10"
                  }`}
                >
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button 
                  className={`text-sm font-medium transition-all duration-200 rounded-full ${
                    pathname === "/register"
                      ? "bg-primary/10 text-primary"
                      : "hover:shadow-lg"
                  }`}
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
} 