"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { motion, useScroll, useTransform } from "framer-motion";
import { Upload, Sparkles, ArrowRight, Download, Loader2, Image as ImageIcon, Maximize2, LogIn } from "lucide-react";
import Image from "next/image";
import { useState, useRef } from "react";

export function Hero() {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const resetState = () => {
    setPreview(null);
    setProcessedImage(null);
    setIsComplete(false);
    setIsProcessing(false);
    setShowAuthPrompt(false);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        // Simulate processing
        setIsProcessing(true);
        setTimeout(() => {
          setIsProcessing(false);
          setIsComplete(true);
          // In a real app, this would be the processed image from your API
          setProcessedImage(reader.result as string);
          // Show auth prompt if user is not logged in
          if (!user) {
            setShowAuthPrompt(true);
          }
        }, 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }

    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = 'upscaled-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <section ref={containerRef} className="relative min-h-[90vh] flex items-center overflow-hidden bg-white">
      {/* Animated Background Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 overflow-hidden"
      >
        {/* Animated Circles */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1],
            x: [0, -30, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.1, 0.25, 0.1],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        />

        {/* Animated Dots */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}

        {/* Gradient Overlay */}
        <motion.div
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-white"
        />
      </motion.div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      
      <motion.div 
        style={{ y, opacity }}
        className="container relative"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Section - Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="flex flex-col gap-6"
            >
              <motion.h1 
                className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl lg:leading-[1.1]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Effortless Image Editing.{" "}
                <motion.span 
                  className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  Perfect Every Time.
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="text-lg text-muted-foreground max-w-xl leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Remove backgrounds, upscale images, and enhance quality with just one click. AI-powered precision for stunning results.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <Link href="/tools">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white text-base px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative flex items-center">
                        Try Our Tools
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-center gap-4"
          >
              {!user && (
                <Link href="/signup">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="outline" size="lg" className="text-base px-8 py-6 rounded-full border-primary/20 hover:bg-primary/5 backdrop-blur-sm">
                      Try for Free
                    </Button>
                  </motion.div>
                </Link>
              )}
            </motion.div>
          </motion.div>

          {/* Right Section - Image Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
            className="relative"
          >
            <motion.div 
              className="relative rounded-2xl overflow-hidden shadow-2xl bg-white border border-gray-100"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {/* Image Preview or Upload Area */}
              <div className="relative aspect-[4/3]">
                {preview ? (
                  <div className="relative w-full h-full group">
                    <Image
                      src={preview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm">
                      Original
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
                    <motion.div 
                      className="text-center p-8 relative"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                    >
                      {/* Animated Background Elements */}
                      <motion.div
                        className="absolute inset-0 -z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-full"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-full"
                          animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.2, 0.4, 0.2],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      </motion.div>

                      {/* Upload Icon with Animation */}
                      <motion.div 
                        className="relative"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.div 
                          className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 mx-auto mb-6 relative overflow-hidden"
                          animate={{
                            scale: [1, 1.05, 1],
                            rotate: [0, 5, -5, 0],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          {/* Animated Rings */}
                          <motion.div
                            className="absolute inset-0 border-2 border-primary/20 rounded-full"
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [0.5, 0.8, 0.5],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                          <motion.div
                            className="absolute inset-0 border-2 border-primary/20 rounded-full"
                            animate={{
                              scale: [1, 1.1, 1],
                              opacity: [0.3, 0.6, 0.3],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 0.5,
                            }}
                          />
                          <div className="relative z-10">
                            <ImageIcon className="h-12 w-12 text-primary" />
                            <motion.div
                              className="absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full"
                              animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.8, 1, 0.8],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            />
                          </div>
                        </motion.div>
                      </motion.div>

                      {/* Text Content */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      >
                        <h3 className="text-2xl font-semibold text-foreground mb-3 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                          Quick Image Upscale
                        </h3>
                        <p className="text-base text-muted-foreground max-w-sm mx-auto mb-6">
                          Upload your image and watch it transform into a high-resolution masterpiece
                        </p>
                        
                        {/* Upload CTA */}
                        <motion.div
                          className="relative inline-block"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 rounded-full blur-lg opacity-50" />
                          <Button 
                            size="lg" 
                            className="relative bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group"
                          >
                            <span className="flex items-center">
                              <Upload className="mr-2 h-5 w-5" />
                              Upload Image
                            </span>
                          </Button>
                        </motion.div>

                        {/* Features List */}
                        <motion.div 
                          className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.8, delay: 0.4 }}
                        >
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span>AI-Powered</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ArrowRight className="h-4 w-4 text-primary" />
                            <span>Instant Results</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Maximize2 className="h-4 w-4 text-primary" />
                            <span>High Resolution</span>
                          </div>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </div>
                )}
              </div>

              {/* Processing Stage */}
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm"
                >
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4"
                    >
                      <Loader2 className="h-8 w-8 text-primary" />
                    </motion.div>
                    <p className="text-lg font-medium text-foreground">Upscaling Image</p>
                    <p className="text-sm text-muted-foreground">Enhancing resolution and quality...</p>
                  </div>
                </motion.div>
              )}

              {/* Complete Stage */}
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm z-10"
                >
                  <div className="text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
                      <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-lg font-medium text-foreground">Upscale Complete</p>
                    <p className="text-sm text-muted-foreground mb-4">Your high-res image is ready!</p>
                    {user ? (
                      <div className="space-y-4">
                        <Button 
                          size="lg" 
                          className="bg-primary hover:bg-primary/90 text-white"
                          onClick={handleDownload}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download Upscaled Image
                        </Button>
                        <div>
                          <Button 
                            variant="outline" 
                            size="lg" 
                            className="bg-white hover:bg-gray-50 text-primary border-primary/20"
                            onClick={resetState}
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Try Another Image
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">Sign in to download your upscaled image</p>
                        <div className="flex gap-4 justify-center">
                          <Link href="/login">
                            <Button variant="outline" size="lg" className="bg-white hover:bg-gray-50">
                              <LogIn className="mr-2 h-4 w-4" />
                              Sign In
                </Button>
                  </Link>
                            <Link href="/signup">
                              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                                Create Account
              </Button>
                </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
              
              {/* Upload Button - Only show when no image is previewed */}
              {!preview && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleUpload}
                  />
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
} 