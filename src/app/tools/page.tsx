"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Wand2, Palette, Eraser } from "lucide-react";

const tools = [
  {
    name: "Background Removal",
    description: "Remove backgrounds from images instantly with AI-powered precision",
    features: [
      "One-click background removal",
      "Fine-tune edges",
      "Multiple background options",
      "Batch processing",
    ],
    icon: <Eraser className="h-6 w-6" />,
    gradient: "from-blue-500 to-cyan-500",
    hoverGradient: "from-blue-600 to-cyan-600",
  },
  {
    name: "Image Upscaling",
    description: "Enhance image quality and resolution with advanced AI algorithms",
    features: [
      "4x upscaling",
      "No quality loss",
      "Multiple AI models",
      "Custom presets",
    ],
    icon: <Zap className="h-6 w-6" />,
    gradient: "from-purple-500 to-pink-500",
    hoverGradient: "from-purple-600 to-pink-600",
  },
  {
    name: "Object Removal",
    description: "Remove unwanted objects from images while preserving the background",
    features: [
      "Smart object detection",
      "Content-aware fill",
      "Multiple object selection",
      "Undo/redo support",
    ],
    icon: <Wand2 className="h-6 w-6" />,
    gradient: "from-orange-500 to-red-500",
    hoverGradient: "from-orange-600 to-red-600",
  },
  {
    name: "Color Correction",
    description: "Adjust colors and tones to achieve the perfect look",
    features: [
      "Auto color correction",
      "Advanced color grading",
      "Preset filters",
      "Batch processing",
    ],
    icon: <Palette className="h-6 w-6" />,
    gradient: "from-green-500 to-emerald-500",
    hoverGradient: "from-green-600 to-emerald-600",
  },
];

export default function ToolsPage() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-background/95">
      <main className="flex-1">
        <div className="container py-16 sm:py-24">
          {/* Header Section */}
          <motion.div 
            className="mx-auto max-w-4xl text-center mb-16 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl -z-10" />
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 text-primary mb-6 backdrop-blur-sm border border-primary/20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">AI-Powered Image Tools</span>
            </motion.div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground">
              Powerful Image Editing Tools
            </h1>
            <p className="mt-6 text-lg leading-8 text-foreground/80 max-w-2xl mx-auto">
              Our suite of AI-powered tools helps you create professional-quality images in minutes.
            </p>
          </motion.div>

          {/* Tools Grid */}
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-2">
            {tools.map((tool, index) => (
              <motion.div 
                key={tool.name} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm border border-gray-100/50 hover:border-primary/20 transition-all duration-300 hover:shadow-2xl"
              >
                {/* Card Header with Gradient */}
                <div className={`relative h-32 bg-gradient-to-r ${tool.gradient} p-6`}>
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-sm">
                        {tool.icon}
                      </div>
                      <h2 className="text-2xl font-bold text-white">{tool.name}</h2>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <p className="text-lg text-foreground/80 mb-6">{tool.description}</p>
                  
                  {/* Features List */}
                  <ul role="list" className="space-y-4 mb-6">
                    {tool.features.map((feature) => (
                      <motion.li 
                        key={feature} 
                        className="flex items-center gap-3 text-base text-foreground/80 group-hover:text-foreground transition-colors duration-200"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className={`flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br ${tool.gradient} text-white text-xs`}>
                          ✓
                        </div>
                        {feature}
                      </motion.li>
                    ))}
                  </ul>

                  {/* Action Button */}
                  <Link href={
                    tool.name === "Background Removal" 
                      ? "/tools/background-removal" 
                      : tool.name === "Image Upscaling"
                      ? "/tools/upscale"
                      : "/signup"
                  }>
                    <Button className={`w-full bg-gradient-to-r ${tool.gradient} hover:${tool.hoverGradient} text-white px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group`}>
                      <span className="flex items-center justify-center">
                        Try {tool.name}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </Link>
                </div>

                {/* Hover Effect Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          {!user && (
            <motion.div 
              className="mx-auto mt-24 max-w-2xl text-center relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl -z-10" />
              <div className="relative">
                <h2 className="text-3xl font-bold tracking-tight text-foreground mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground">
                  Ready to get started?
                </h2>
                <p className="text-lg leading-8 text-foreground/80 mb-8">
                  Sign up for a free account and start editing your images today.
                </p>
                <div>
                  <Link href="/signup">
                    <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group">
                      <span className="flex items-center justify-center">
                        Create Free Account
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <footer className="border-t border-gray-100/50 py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-foreground/80 md:text-left">
              Built by{" "}
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
              >
                Image?ro
              </a>
              . All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}