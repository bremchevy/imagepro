"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Download, Sparkles, Zap, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";

export function Hero() {
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUpscaled, setIsUpscaled] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setImage(reader.result as string);
          setIsUpscaled(false);
        };
        reader.readAsDataURL(file);
      }
    }
  });

  const handleUpscale = async () => {
    if (!image) return;
    
    setIsProcessing(true);
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsUpscaled(true);
      toast.success('Image upscaled successfully!');
    } catch (error) {
      toast.error('Failed to upscale image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!image) return;
    
    const link = document.createElement('a');
    link.href = image;
    link.download = 'upscaled-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="relative overflow-hidden bg-background py-24 sm:py-32">
      {/* Animated background lines */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e5_1px,transparent_1px),linear-gradient(to_bottom,#4f46e5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        </div>
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl"
          >
            Transform Your Images with AI
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-lg leading-8 text-foreground/80"
          >
            Enhance, upscale, and perfect your images with our advanced AI-powered tools. Professional quality results in seconds.
          </motion.p>
        </div>

        <div className="mt-16 flex flex-col items-center justify-center gap-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-sm text-foreground/80">AI-Powered Enhancement</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span className="text-sm text-foreground/80">Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-primary" />
              <span className="text-sm text-foreground/80">Smart Background Removal</span>
            </div>
          </div>

          <div className="w-full max-w-2xl">
            <div
              {...getRootProps()}
              className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                isDragActive ? 'border-primary bg-primary/5' : 'border-foreground/20'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-foreground/40" />
              <p className="mt-2 text-sm text-foreground/60">
                {isDragActive
                  ? "Drop the image here"
                  : "Drag and drop an image, or click to select"}
              </p>
            </div>

            {image && (
              <div className="mt-8">
                <div className="relative aspect-video overflow-hidden rounded-lg bg-foreground/5">
                  <img
                    src={image}
                    alt="Preview"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="mt-4 flex justify-center gap-4">
                  {!isUpscaled ? (
                    <Button
                      onClick={handleUpscale}
                      disabled={isProcessing}
                      className="btn-primary"
                    >
                      {isProcessing ? "Processing..." : "Upscale Image"}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleDownload}
                      className="btn-primary"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          <Button variant="outline" size="lg" className="btn-secondary">
            Try Our Tools
          </Button>
        </div>
      </div>
    </section>
  );
} 