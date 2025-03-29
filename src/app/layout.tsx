import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { MarketingNav } from "@/components/marketing/nav";
import { Toaster } from "react-hot-toast";

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
      <body className={inter.className}>
        <AuthProvider>
          <div className="relative min-h-screen flex flex-col">
            <MarketingNav />
            <main className="flex-1">
              {children}
            </main>
            <Toaster position="bottom-right" />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
