import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { MarketingNav } from "@/components/marketing/nav";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Sparkles } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ImagePro - Professional Image Processing",
  description: "Professional image processing tools for your needs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative flex min-h-screen flex-col">
              <MarketingNav />
              <main className="flex-1">
                {children}
              </main>
              <Toaster position="bottom-right" richColors />
              
              {/* Footer */}
              <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container py-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <span className="font-semibold">ImagePro</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Professional AI-powered image processing tools for creators and designers.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-4">Tools</h4>
                      <ul className="space-y-2">
                        <li>
                          <Link href="/tools/background-removal" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            Background Remover
                          </Link>
                        </li>
                        <li>
                          <Link href="/tools/upscale" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            Image Upscaler
                          </Link>
                        </li>
                        <li>
                          <Link href="/tools/object-removal" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            Object Remover
                          </Link>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-4">Company</h4>
                      <ul className="space-y-2">
                        <li>
                          <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            About Us
                          </Link>
                        </li>
                        <li>
                          <Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            Pricing
                          </Link>
                        </li>
                        <li>
                          <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            Contact
                          </Link>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-4">Legal</h4>
                      <ul className="space-y-2">
                        <li>
                          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            Privacy Policy
                          </Link>
                        </li>
                        <li>
                          <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            Terms of Service
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
