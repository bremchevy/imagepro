"use client";

import { motion } from "framer-motion";
import { ImageIcon, Sparkles, Zap, Wand2, Shield, Clock, BarChart } from "lucide-react";

const features = [
  {
    icon: <ImageIcon className="h-6 w-6 text-primary" />,
    title: "AI-Powered Enhancement",
    description: "Transform low-quality images into stunning high-resolution masterpieces"
  },
  {
    icon: <Zap className="h-6 w-6 text-primary" />,
    title: "Lightning Fast",
    description: "Process your images in seconds with our optimized AI algorithms"
  },
  {
    icon: <Wand2 className="h-6 w-6 text-primary" />,
    title: "Smart Background Removal",
    description: "Automatically remove backgrounds with precision and accuracy"
  },
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
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Features</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Powerful Features for Professional Image Processing
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Our comprehensive suite of AI-powered tools helps you transform your images with professional-grade quality and efficiency.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative rounded-2xl bg-background/80 backdrop-blur-sm p-8 ring-1 ring-inset ring-primary/10 hover:ring-primary/20 transition-all duration-300"
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    {feature.icon}
                  </div>
                  {feature.title}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
} 