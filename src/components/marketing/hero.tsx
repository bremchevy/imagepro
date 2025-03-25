"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { Image as ImageIcon, Download, Loader2 } from "lucide-react";
import { SignUpDialog } from "@/components/auth/signup-dialog";

export function Hero() {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSignUpDialog, setShowSignUpDialog] = useState(false);

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
      <div className="container relative">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
          {/* Left side - Text content */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-7xl">
                Transform Your Images with Our{" "}
                <span className="text-primary">AI Tools</span>
              </h1>
              <p className="text-base leading-7 text-foreground/80 max-w-xl">
                Professional image editing made simple. Remove backgrounds, upscale images, 
                and enhance quality with our powerful AI-powered tools.
              </p>
            </div>
            <div className="flex items-center gap-x-6">
              <Button 
                size="lg" 
                className="rounded-full px-8"
                onClick={() => setShowSignUpDialog(true)}
              >
                Get Started Free
              </Button>
              <Link href="/tools">
                <Button variant="outline" size="lg" className="rounded-full px-8">
                  Explore Tools
                </Button>
              </Link>
            </div>
          </div>

          {/* Right side - Interactive Image preview */}
          <div className="relative">
            <div className="relative rounded-xl bg-gray-900/5 p-8 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl">
              <div className="relative mx-auto">
                <div 
                  className={`relative aspect-[16/9] overflow-hidden rounded-lg bg-gray-100 shadow-2xl ring-1 ring-gray-900/10 transition-all duration-200 ${
                    isDragging ? 'ring-2 ring-primary/50 bg-primary/5' : ''
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {preview ? (
                    <div className="relative h-full w-full">
                      <img 
                        src={preview} 
                        alt="Processed" 
                        className="h-full w-full object-cover"
                      />
                      {isProcessing && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <div className="flex flex-col items-center gap-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-white font-medium">Upscaling image...</p>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-200">
                        <Button 
                          variant="secondary" 
                          className="rounded-full"
                          onClick={resetPreview}
                        >
                          Try Another Image
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                      <div className="text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                          <ImageIcon className="h-6 w-6 text-primary" />
                        </div>
                        <p className="mt-4 text-lg font-medium text-foreground/80">
                          Drop your image here
                        </p>
                        <p className="mt-2 text-sm text-foreground/60">
                          or click to upload
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileInput}
                          className="absolute inset-0 cursor-pointer opacity-0"
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-6 flex flex-col items-center gap-4">
                  <div className="flex items-center justify-center gap-2 text-sm text-foreground/60">
                    <span>Try our AI-image upscaled tool</span>
                  </div>
                  {preview && !isProcessing && (
                    <Button 
                      size="lg"
                      className="rounded-full bg-primary hover:bg-primary/90"
                      onClick={handleDownload}
                    >
                      <Download className="mr-2 h-5 w-5" />
                      Download Upscaled Image
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SignUpDialog open={showSignUpDialog} onOpenChange={setShowSignUpDialog} />
    </section>
  );
} 