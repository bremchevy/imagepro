'use client';

import React, { useState, useCallback } from 'react';
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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        setPreviewUrl(URL.createObjectURL(file));
        setResultUrl(null);
      } else {
        toast.error('Please upload a valid image file');
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        setPreviewUrl(URL.createObjectURL(file));
        setResultUrl(null);
      } else {
        toast.error('Please upload a valid image file');
      }
    }
  };

  const handleDownload = () => {
    if (resultUrl) {
      const link = document.createElement('a');
      link.href = resultUrl;
      link.download = 'removed-bg.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            Background Removal
          </CardTitle>
          <CardDescription>
            Upload an image and we'll remove its background automatically
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
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
              className="cursor-pointer flex flex-col items-center gap-4"
            >
              <Upload className="h-12 w-12 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  Drag and drop your image here, or click to select
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supports PNG, JPG, JPEG up to 25MB
                </p>
              </div>
            </label>
          </div>

          {previewUrl && (
            <div className="mt-8">
              <h3 className="text-sm font-medium mb-2">Preview</h3>
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="object-contain w-full h-full"
                />
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="mt-8">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Processing image... {progress}%
              </p>
            </div>
          )}

          {resultUrl && (
            <div className="mt-8">
              <h3 className="text-sm font-medium mb-2">Result</h3>
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  src={resultUrl}
                  alt="Result"
                  className="object-contain w-full h-full"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute bottom-4 right-4"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        <CardContent className="pt-0">
          <Button
            className="w-full"
            onClick={handleProcess}
            disabled={!selectedImage || isProcessing}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Remove Background
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 