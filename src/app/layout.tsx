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
    <html lang="en" className="scroll-smooth">
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
              <Toaster position="top-center" richColors />
              
              {/* Footer */}
              <footer className="border-t border-gray-100 bg-white/50 backdrop-blur-sm mt-auto">
                <div className="container py-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-gray-900">ImagePro</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Professional AI-powered image processing tools for creators and designers.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Tools</h4>
                      <ul className="space-y-2">
                        <li>
                          <Link href="/tools/background-removal" className="text-sm text-gray-600 hover:text-primary">
                            Background Remover
                          </Link>
                        </li>
                        <li>
                          <Link href="/tools/upscale" className="text-sm text-gray-600 hover:text-primary">
                            Image Upscaler
                          </Link>
                        </li>
                        <li>
                          <Link href="/tools/object-removal" className="text-sm text-gray-600 hover:text-primary">
                            Object Remover
                          </Link>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Company</h4>
                      <ul className="space-y-2">
                        <li>
                          <Link href="/about" className="text-sm text-gray-600 hover:text-primary">
                            About Us
                          </Link>
                        </li>
                        <li>
                          <Link href="/pricing" className="text-sm text-gray-600 hover:text-primary">
                            Pricing
                          </Link>
                        </li>
                        <li>
                          <Link href="/contact" className="text-sm text-gray-600 hover:text-primary">
                            Contact
                          </Link>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Legal</h4>
                      <ul className="space-y-2">
                        <li>
                          <Link href="/privacy" className="text-sm text-gray-600 hover:text-primary">
                            Privacy Policy
                          </Link>
                        </li>
                        <li>
                          <Link href="/terms" className="text-sm text-gray-600 hover:text-primary">
                            Terms of Service
                          </Link>
                        </li>
                        <li>
                          <Link href="/cookies" className="text-sm text-gray-600 hover:text-primary">
                            Cookie Policy
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                      <div className="flex items-center gap-4">
                        <Link href="https://twitter.com" className="text-gray-400 hover:text-primary">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                          </svg>
                        </Link>
                        <Link href="https://github.com" className="text-gray-400 hover:text-primary">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.91-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                          </svg>
                        </Link>
                      </div>
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
