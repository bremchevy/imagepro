"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sliders, ZoomIn, Download, History, Image as ImageIcon, Upload } from "lucide-react";
import { useState, useRef } from "react";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export default function ImageUpscalerPage() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scaleFactor, setScaleFactor] = useState("2x");
  const [quality, setQuality] = useState("high");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleProcessImage = async () => {
    if (!previewImage) return;
    
    setIsProcessing(true);
    try {
      // Convert base64 to blob
      const response = await fetch(previewImage);
      const blob = await response.blob();
      
      // Create form data
      const formData = new FormData();
      formData.append('image', blob, 'image.png');
      formData.append('scaleFactor', scaleFactor);
      formData.append('quality', quality);
      
      // Call image upscaler API
      const apiResponse = await fetch('/api/image-upscaler', {
        method: 'POST',
        body: formData,
      });
      
      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || 'Failed to upscale image');
      }
      
      const result = await apiResponse.json();
      setProcessedImage(result.processedImage);
      
      toast.success("Image upscaled successfully!", {
        description: "Your image has been enhanced with AI upscaling.",
      });
    } catch (error) {
      console.error('Error upscaling image:', error);
      toast.error("Failed to upscale image", {
        description: error instanceof Error ? error.message : "An error occurred while upscaling your image.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `upscaled-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-50/50 to-white">
      <main className="flex-1">
        <div className="container min-h-[calc(100vh-8rem)] py-4 sm:py-8">
          {/* Header */}
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-2 sm:mb-3">
              Image Upscaler
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
              Enhance your image quality up to 4x with advanced AI technology.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Left Side - Preview Area */}
            <div className="relative min-h-[300px] sm:min-h-[400px]">
              <Card 
                className="h-full flex items-center justify-center border-2 border-dashed border-gray-200 hover:border-primary/50 transition-all duration-300 cursor-pointer bg-white shadow-sm hover:shadow-md"
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {processedImage ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={processedImage}
                      alt="Upscaled Result"
                      fill
                      className="object-cover rounded-lg transition-all duration-300"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                      <Button
                        variant="secondary"
                        className="bg-white text-gray-900 hover:bg-white/90"
                        onClick={handleDownload}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Result
                      </Button>
                    </div>
                  </div>
                ) : previewImage ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={previewImage}
                      alt="Preview"
                      fill
                      className="object-cover rounded-lg transition-all duration-300"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {isProcessing && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/10 flex items-center justify-center">
                            <ZoomIn className="h-6 w-6 text-white animate-spin" />
                          </div>
                          <p className="text-white text-sm font-medium">Upscaling your image...</p>
                          <div className="mt-2 w-32 mx-auto">
                            <Progress value={undefined} className="h-1 bg-white/20">
                              <div className="h-full w-full bg-white/40 animate-pulse rounded-full" />
                            </Progress>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                      <p className="text-white text-sm font-medium">Click to change image</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-10 w-10 text-gray-400" />
                    <p className="mt-3 text-sm text-gray-600 font-medium">
                      Drag and drop your image here, or click to upload
                    </p>
                  </div>
                )}
              </Card>
            </div>

            {/* Right Side - Tool Settings */}
            <Card className="p-3 h-full bg-white border-0 shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md">
                    <ZoomIn className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Image Upscaler</h3>
                    <p className="text-[10px] text-gray-600 mt-0.5">
                      Enhance image quality up to 4x with advanced AI
                    </p>
                  </div>
                </div>

                {/* Tool Settings */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-2">
                      <ZoomIn className="h-4 w-4 text-gray-500" />
                      <span className="text-xs font-medium text-gray-700">Scale Factor</span>
                    </div>
                    <Select defaultValue={scaleFactor} onValueChange={setScaleFactor}>
                      <SelectTrigger className="h-7 w-[80px] text-xs">
                        <SelectValue placeholder="2x" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1.5x">1.5x</SelectItem>
                        <SelectItem value="2x">2x</SelectItem>
                        <SelectItem value="3x">3x</SelectItem>
                        <SelectItem value="4x">4x</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-2">
                      <Sliders className="h-4 w-4 text-gray-500" />
                      <span className="text-xs font-medium text-gray-700">Quality</span>
                    </div>
                    <Select defaultValue={quality} onValueChange={setQuality}>
                      <SelectTrigger className="h-7 w-[100px] text-xs">
                        <SelectValue placeholder="High" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Instructions */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-gray-500" />
                    <h4 className="text-xs font-medium text-gray-700">Quick Guide</h4>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs text-gray-600">1. Upload your image (up to 10MB)</p>
                    <p className="text-xs text-gray-600">2. Select your desired enlargement scale</p>
                    <p className="text-xs text-gray-600">3. Choose quality settings</p>
                    <p className="text-xs text-gray-600">4. Download your high-resolution image</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white shadow-md hover:shadow-lg transition-all duration-200 text-sm py-1.5"
                    onClick={handleProcessImage}
                    disabled={!previewImage || isProcessing}
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <ZoomIn className="h-4 w-4 animate-spin" />
                        <span>Upscaling...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <ZoomIn className="h-4 w-4" />
                        <span>Upscale Image</span>
                      </div>
                    )}
                  </Button>
                  <div className="flex gap-1">
                    {previewImage && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="px-2"
                        onClick={handleDownload}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="px-2"
                    >
                      <History className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
} 