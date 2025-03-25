'use client';

import React, { useState, useCallback } from 'react';
import { MarketingNav } from "@/components/marketing/nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Upload, Image as ImageIcon, Download, RefreshCw } from "lucide-react";
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
      const resultUrl = await removeBackground(selectedImage);
      setProgress(100);
      setResultUrl(resultUrl);
      toast.success("Background removed successfully!", { id: "processing" });
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to remove background. Please try again.", { id: "processing" });
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
      toast.error("Please upload an image file");
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
    <div className="flex min-h-screen flex-col">
      <MarketingNav />
      <main className="flex-1">
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Background Removal</h1>
            <p className="text-muted-foreground mt-2">
              Remove backgrounds from your images instantly with AI-powered precision
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Upload Image
              </CardTitle>
              <CardDescription>
                Drag and drop your image or click to browse. Processing will start automatically.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center ${
                    dragActive ? "border-primary bg-primary/5" : "border-gray-300"
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
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600">
                      Drag and drop your image here, or click to select
                    </p>
                  </label>
                </div>

                {selectedImage && !resultUrl && (
                  <div className="mt-6 flex justify-center">
                    <Button 
                      onClick={handleProcess}
                      disabled={isProcessing}
                      className="w-full md:w-auto"
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Remove Background
                    </Button>
                  </div>
                )}

                {isProcessing && (
                  <div className="mt-6">
                    <Progress value={progress} className="mb-2" />
                    <p className="text-sm text-gray-500 text-center">
                      Processing image... {progress}%
                    </p>
                  </div>
                )}

                {previewUrl && resultUrl && (
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Original</h3>
                      <img
                        src={previewUrl}
                        alt="Original"
                        className="w-full rounded-lg shadow-md"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Processed</h3>
                      <img
                        src={resultUrl}
                        alt="Processed"
                        className="w-full rounded-lg shadow-md"
                      />
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-center gap-4">
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    disabled={!selectedImage}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  {resultUrl && (
                    <Button onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 