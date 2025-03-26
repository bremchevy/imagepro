import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "react-hot-toast";
import { MarketingNav } from "@/components/marketing/nav";
import { DashboardNav } from "@/components/dashboard/nav";
import { headers } from 'next/headers';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Imagepro - AI Image Enhancement",
  description: "Transform your images with AI-powered enhancement tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = headers();
  const pathname = headersList.get('x-pathname') || '';
  
  // Define which routes should show the dashboard navigation
  const dashboardRoutes = ['/dashboard', '/dashboard/images', '/dashboard/account'];
  const isDashboardRoute = dashboardRoutes.some(route => pathname.startsWith(route));

  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <AuthProvider>
          {isDashboardRoute ? <DashboardNav /> : <MarketingNav />}
          {children}
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
