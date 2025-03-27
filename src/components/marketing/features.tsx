"use client";

import { motion } from "framer-motion";
import { ImageIcon, Sparkles, Zap, Wand2, Shield, Clock, BarChart } from "lucide-react";

const features = [
  {
    icon: <ImageIcon className="h-6 w-6 text-primary" />,
    title: "Advanced Image Processing",
    description: "Our AI-powered algorithms can handle various image formats and sizes, delivering high-quality results every time."
  },
  {
    icon: <Sparkles className="h-6 w-6 text-primary" />,
    title: "Smart Enhancement",
    description: "Automatically enhance image quality, remove noise, and improve details while maintaining natural look."
  },
  {
    icon: <Zap className="h-6 w-6 text-primary" />,
    title: "Lightning Fast",
    description: "Process your images in seconds with our optimized AI engine, no waiting required."
  },
  {
    icon: <Wand2 className="h-6 w-6 text-primary" />,
    title: "Background Removal",
    description: "Instantly remove backgrounds from images with precision and accuracy."
  },
  {
    icon: <Shield className="h-6 w-6 text-primary" />,
    title: "Secure Processing",
    description: "Your images are processed securely and never stored on our servers."
  },
  {
    icon: <Clock className="h-6 w-6 text-primary" />,
    title: "24/7 Availability",
    description: "Access our tools anytime, anywhere with our reliable cloud infrastructure."
  },
  {
    icon: <BarChart className="h-6 w-6 text-primary" />,
    title: "Performance Analytics",
    description: "Track your image processing history and analyze performance metrics."
  }
];

export function Features() {
  return (
    <section className="py-24 sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Powerful Features for Professional Image Processing
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-lg leading-8 text-foreground/80"
          >
            Our comprehensive suite of AI-powered tools helps you transform your images with professional-grade quality and efficiency.
          </motion.p>
        </div>
        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative rounded-2xl bg-background/80 backdrop-blur-sm p-8 ring-1 ring-inset ring-primary/10 hover:ring-primary/20 transition-all duration-300"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  {feature.icon}
                </div>
                <h3 className="mt-6 text-lg font-semibold leading-8 text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-base leading-7 text-foreground/80">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 