"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { motion } from "framer-motion";

export function Hero() {
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-background/80 py-24 sm:py-32">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="container relative">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-4"
          >
            <h1 className="text-center text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:leading-[1.1]">
              Professional Image Processing
              </h1>
            <p className="max-w-[750px] text-center text-lg text-foreground/80 sm:text-xl">
              Transform your images with our powerful AI-powered tools. Remove backgrounds, enhance quality, and more.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex w-full items-center justify-center space-x-4 py-4 md:py-10"
          >
            {!user ? (
              <>
                <Link href="/signup">
                  <Button size="lg" className="btn-primary">Start Free Trial</Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline" size="lg" className="btn-secondary">
                    View Pricing
              </Button>
                </Link>
              </>
            ) : (
              <Link href="/dashboard">
                <Button size="lg" className="btn-primary">Go to Dashboard</Button>
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
} 