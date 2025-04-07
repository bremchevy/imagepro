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
    <section className="py-16 sm:py-24 lg:py-32 bg-white">
      <div className="container px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Features</h2>
          <p className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            Powerful Features for Professional Image Processing
          </p>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-muted-foreground">
            Our comprehensive suite of AI-powered tools helps you transform your images with professional-grade quality and efficiency.
          </p>
        </div>
        <div className="mx-auto mt-12 sm:mt-16 lg:mt-20 max-w-2xl lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-6 sm:gap-8 lg:max-w-none lg:grid-cols-2 xl:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative rounded-2xl bg-background/80 backdrop-blur-sm p-6 sm:p-8 ring-1 ring-inset ring-primary/10 hover:ring-primary/20 transition-all duration-300"
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-primary/10">
                    {feature.icon}
                  </div>
                  <span className="text-sm sm:text-base">{feature.title}</span>
                </dt>
                <dd className="mt-3 sm:mt-4 flex flex-auto flex-col text-sm sm:text-base leading-6 sm:leading-7 text-muted-foreground">
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