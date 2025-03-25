'use client';

import React, { useState, useCallback } from 'react';
import { MarketingNav } from "@/components/marketing/nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, Image as ImageIcon, Download, RefreshCw, Wand2 } from "lucide-react";
import { removeBackground } from '@/lib/services/background-removal';
import toast from "react-hot-toast";

export default function BackgroundRemovalPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const handleProcess = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setProgress(0);
    toast.loading("Processing image...", { id: "processing" });

    try {
      setProgress(30);
      const base64Image = await removeBackground(selectedImage);
      setProgress(100);
      setResultUrl(base64Image);
      toast.success("Background removed successfully!", { id: "processing" });
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error(error instanceof Error ? error.message : "Failed to remove background. Please try again.", { id: "processing" });
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResultUrl(null);
    } else {
      toast.error("Please upload a valid image file");
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResultUrl(null);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setResultUrl(null);
    setProgress(0);
    setIsProcessing(false);
  };

  const handleDownload = () => {
    if (resultUrl) {
      const link = document.createElement("a");
      link.href = resultUrl;
      link.download = "removed-background.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-50 to-white">
      <MarketingNav />
      <main className="flex-1">
        <div className="container py-12">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Background Removal</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Remove backgrounds from your images instantly with AI-powered precision. Perfect for product photos, portraits, and more.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-2 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-xl">
              <CardHeader className="space-y-2">
                <CardTitle className="flex items-center gap-2 text-2xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  <ImageIcon className="h-7 w-7" />
                  Original Image
                </CardTitle>
                <CardDescription className="text-base">
                  Upload your image here to get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {!selectedImage ? (
                    <div
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                        dragActive 
                          ? "border-primary bg-primary/5 scale-[1.02] shadow-lg" 
                          : "border-gray-300 hover:border-primary/50 hover:bg-gray-50/50"
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center group"
                      >
                        <Upload className="h-14 w-14 text-gray-400 mb-4 group-hover:text-primary transition-colors duration-300" />
                        <p className="text-gray-600 font-medium text-lg group-hover:text-primary transition-colors duration-300">
                          Drag and drop your image here
                        </p>
                        <p className="text-sm text-gray-500 mt-2 group-hover:text-primary/70 transition-colors duration-300">
                          or click to browse
                        </p>
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow duration-300">
                        <img
                          src={previewUrl || ''}
                          alt="Preview"
                          className="w-full h-auto"
                        />
                      </div>
                      <Button
                        variant="outline"
                        onClick={handleReset}
                        size="lg"
                        className="w-full hover:bg-primary/5 transition-colors duration-300"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Try Another Image
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-xl">
              <CardHeader className="space-y-2">
                <CardTitle className="flex items-center gap-2 text-2xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  <Wand2 className="h-7 w-7" />
                  Processed Image
                </CardTitle>
                <CardDescription className="text-base">
                  Your image with background removed will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {isProcessing ? (
                    <div className="space-y-4">
                      <Progress value={progress} className="h-2" />
                      <p className="text-sm text-gray-500 text-center animate-pulse">
                        Processing image... {progress}%
                      </p>
                    </div>
                  ) : resultUrl ? (
                    <div className="rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow duration-300">
                      <img
                        src={resultUrl}
                        alt="Processed"
                        className="w-full h-auto"
                      />
                    </div>
                  ) : (
                    <div className="h-[200px] flex items-center justify-center border-2 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100/50 transition-colors duration-300">
                      <p className="text-gray-500">Processed image will appear here</p>
                    </div>
                  )}

                  <div className="flex justify-center gap-4">
                    {selectedImage && !resultUrl && (
                      <Button 
                        onClick={handleProcess}
                        disabled={isProcessing}
                        className="w-full md:w-auto bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all duration-300"
                        size="lg"
                      >
                        <Wand2 className="h-4 w-4 mr-2" />
                        Remove Background
                      </Button>
                    )}
                    {resultUrl && (
                      <Button 
                        onClick={handleDownload}
                        size="lg"
                        className="w-full md:w-auto bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all duration-300"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Result
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
} 