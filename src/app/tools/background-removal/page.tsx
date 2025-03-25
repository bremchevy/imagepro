'use client';

import React, { useState } from 'react';
import { MarketingNav } from "@/components/marketing/nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Upload, Image as ImageIcon, Download, RefreshCw } from "lucide-react";

export default function BackgroundRemovalPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResultUrl(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResultUrl(null);
    }
  };

  const handleProcess = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setProgress(0);

    // Simulate processing progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    try {
      // TODO: Implement actual background removal API call
      await new Promise(resolve => setTimeout(resolve, 5000));
      setResultUrl(previewUrl);
    } catch (error) {
      console.error('Error processing image:', error);
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
                Drag and drop your image or click to browse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    disabled={isProcessing}
                    className="hidden"
                  />
                  <Label
                    htmlFor="image"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {selectedImage ? selectedImage.name : 'Click to upload or drag and drop'}
                    </span>
                  </Label>
                </div>

                {previewUrl && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Original Image</Label>
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                          <img
                            src={previewUrl}
                            alt="Original"
                            className="h-full w-full object-contain"
                          />
                        </div>
                      </div>
                      {resultUrl && (
                        <div className="space-y-2">
                          <Label>Processed Image</Label>
                          <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                            <img
                              src={resultUrl}
                              alt="Processed"
                              className="h-full w-full object-contain"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {isProcessing && (
                      <div className="space-y-2">
                        <Label>Processing</Label>
                        <Progress value={progress} className="w-full" />
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Removing background... {progress}%</span>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end gap-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedImage(null);
                          setPreviewUrl(null);
                          setResultUrl(null);
                          setIsProcessing(false);
                          setProgress(0);
                        }}
                        disabled={isProcessing}
                      >
                        Reset
                      </Button>
                      {resultUrl && (
                        <Button
                          variant="outline"
                          className="gap-2"
                          onClick={() => {
                            // TODO: Implement download functionality
                            console.log('Downloading result...');
                          }}
                        >
                          <Download className="h-4 w-4" />
                          Download Result
                        </Button>
                      )}
                      <Button
                        onClick={handleProcess}
                        disabled={!selectedImage || isProcessing}
                        className="gap-2"
                      >
                        {isProcessing ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          'Remove Background'
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 