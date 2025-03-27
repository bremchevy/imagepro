"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Image as ImageIcon, Download, Loader2, Sparkles, Zap, Wand2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignUpDialog } from "@/components/auth/signup-dialog";

export function Hero() {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSignUpDialog, setShowSignUpDialog] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      startUpscale();
    };
    reader.readAsDataURL(file);
  };

  const startUpscale = () => {
    setIsProcessing(true);
    // Simulate AI upscaling
    setTimeout(() => {
      setIsProcessing(false);
    }, 1500);
  };

  const handleDownload = () => {
    if (!preview) return;
    
    const link = document.createElement('a');
    link.href = preview;
    link.download = 'upscaled-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetPreview = () => {
    setPreview(null);
    setIsProcessing(false);
  };

  return (
    <section className="relative overflow-hidden py-12 sm:py-24">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5" />
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              "radial-gradient(circle at 0% 0%, rgba(var(--primary), 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 100% 100%, rgba(var(--primary), 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 100% 0%, rgba(var(--primary), 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 0% 100%, rgba(var(--primary), 0.1) 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        {/* Animated Lines Pattern */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
            animate={{
              x: ["0%", "100%"],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
            animate={{
              x: ["100%", "0%"],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />
        </div>
      </div>

      <div className="container relative">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
          {/* Left side - Text content */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-3">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
              >
                Transform Your Images with Our{" "}
                <span className="text-primary">AI Tools</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="text-sm leading-6 text-foreground/80 max-w-xl"
              >
                Professional image editing made simple. Remove backgrounds,{" "}
                <br />
                upscale images, and enhance quality with our powerful AI-powered tools.
              </motion.p>
            </div>
            <div className="flex flex-col gap-3">
              {[
                {
                  icon: <Sparkles className="h-4 w-4 text-primary" />,
                  title: "AI-Powered Enhancement",
                  description: "Transform low-quality images into stunning high-resolution masterpieces"
                },
                {
                  icon: <Zap className="h-4 w-4 text-primary" />,
                  title: "Lightning Fast",
                  description: "Process your images in seconds with our optimized AI algorithms"
                },
                {
                  icon: <Wand2 className="h-4 w-4 text-primary" />,
                  title: "Smart Background Removal",
                  description: "Automatically remove backgrounds with precision and accuracy"
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -20 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10"
                  >
                    {feature.icon}
                  </motion.div>
                  <div>
                    <h3 className="text-sm font-medium">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="pt-4"
              >
                <Link href="/tools">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="rounded-full px-8 transition-all duration-300 hover:scale-105"
                  >
                    Try Our Tools
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Right side - Interactive Image preview */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.9 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="relative rounded-xl bg-background/80 backdrop-blur-sm p-8 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl shadow-xl">
              <div className="relative mx-auto">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className={`relative aspect-[16/9] overflow-hidden rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 shadow-2xl ring-1 ring-gray-900/10 transition-all duration-200 ${
                    isDragging ? 'ring-2 ring-primary/50 bg-primary/10' : ''
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {preview ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="relative h-full w-full"
                    >
                      <img 
                        src={preview} 
                        alt="Processed" 
                        className="h-full w-full object-cover"
                      />
                      {isProcessing && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                        >
                          <div className="flex flex-col items-center gap-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-white font-medium">Upscaling image...</p>
                          </div>
                        </motion.div>
                      )}
                      <motion.div 
                        whileHover={{ opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm opacity-0 transition-opacity duration-200"
                      >
                        <Button
                          variant="secondary" 
                          className="rounded-full"
                          onClick={resetPreview}
                        >
                          Try Another Image
                        </Button>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10"
                    >
                      <div className="text-center">
                        <motion.div 
                          whileHover={{ scale: 1.1 }}
                          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-2 ring-primary/20"
                        >
                          <Upload className="h-8 w-8 text-primary" />
                        </motion.div>
                        <motion.div
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="mt-6 space-y-2"
                        >
                          <p className="text-lg font-medium text-foreground/80">
                            Drop your image here
                          </p>
                          <p className="text-sm text-foreground/60">
                            or click to upload
                          </p>
                          <p className="text-xs text-foreground/40">
                            Supports JPG, PNG, and WebP
                          </p>
                        </motion.div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileInput}
                          className="absolute inset-0 cursor-pointer opacity-0"
                        />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="mt-6 flex flex-col items-center gap-4"
                >
                  <div className="flex items-center justify-center gap-2 text-sm text-foreground/60">
                    <span>Try our AI-image upscaled tool</span>
                  </div>
                  {preview && !isProcessing && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Button 
                        size="lg"
                        className="rounded-full bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105"
                        onClick={handleDownload}
                      >
                        <Download className="mr-2 h-5 w-5" />
                        Download Upscaled Image
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <SignUpDialog open={showSignUpDialog} onOpenChange={setShowSignUpDialog} />
    </section>
  );
}