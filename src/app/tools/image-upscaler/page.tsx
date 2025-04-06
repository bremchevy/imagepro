"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sliders, ZoomIn, Download, History, Image as ImageIcon, Upload, ArrowRight, Settings2, X, RefreshCw, ArrowLeftRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Image Comparison Component
const ImageComparison = ({ 
  originalImage, 
  upscaledImage, 
  originalDimensions, 
  upscaledDimensions, 
  onDownload
}: { 
  originalImage: string; 
  upscaledImage: string; 
  originalDimensions: { width: number; height: number } | null; 
  upscaledDimensions: { width: number; height: number } | null; 
  onDownload: () => void;
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(parseInt(e.target.value));
  };
  
  console.log("Rendering ImageComparison component");
  
  return (
    <div className="relative w-full h-full min-h-[400px] border-2 border-blue-500">
      {/* Comparison Header */}
      <div className="absolute top-0 left-0 right-0 bg-blue-600 text-white text-center py-3 font-bold z-30">
        <div className="flex items-center justify-center gap-2">
          <ArrowLeftRight className="h-5 w-5" />
          <span>DRAG SLIDER TO COMPARE ORIGINAL AND UPSCALED IMAGES</span>
        </div>
      </div>
      
      {/* Image Display */}
      <div className="relative w-full h-full pt-12">
        <div className="relative w-full h-full">
          {/* Original Image (Left Side) */}
          <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPosition}%` }}>
            <img
              src={originalImage}
              alt="Original"
              className="w-full h-full object-contain"
            />
          </div>
          
          {/* Upscaled Image (Right Side) */}
          <div className="absolute inset-0 overflow-hidden" style={{ left: `${sliderPosition}%`, width: `${100 - sliderPosition}%` }}>
            <img
              src={upscaledImage}
              alt="Upscaled"
              className="w-full h-full object-contain"
            />
          </div>
          
          {/* Slider Handle */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-10"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
              <ArrowLeftRight className="h-4 w-4 text-gray-600" />
            </div>
          </div>
          
          {/* Slider Input */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={handleSliderChange}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-ew-resize z-20"
          />
          
          {/* Labels */}
          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-30">
            Original
          </div>
          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-30">
            Upscaled
          </div>
        </div>
      </div>
      
      {/* Image Info */}
      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-20">
        {upscaledDimensions && (
          <span>
            {upscaledDimensions.width} × {upscaledDimensions.height}px
          </span>
        )}
      </div>
    </div>
  );
};

export default function ImageUpscalerPage() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scaleFactor, setScaleFactor] = useState("2x");
  const [quality, setQuality] = useState("high");
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
  const [upscaledDimensions, setUpscaledDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isBlurry, setIsBlurry] = useState<boolean | null>(null);
  const [blurType, setBlurType] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Debug useEffect to log when processedImage changes
  useEffect(() => {
    console.log("processedImage state changed:", processedImage ? "Image data exists" : "No image data");
  }, [processedImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
      const reader = new FileReader();
        
        reader.onload = async () => {
          const result = reader.result as string;
          setPreviewImage(result);
          setProcessedImage(null);
          
          // Get original image dimensions
          const img = new window.Image();
          img.onload = () => {
            setOriginalDimensions({
              width: img.width,
              height: img.height
            });
          };
          img.src = result;
        };
        
      reader.readAsDataURL(file);
      }
    }
  });

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
      
      // Call the API
      const apiResponse = await fetch('/api/image-upscaler', {
        method: 'POST',
        body: formData,
      });
      
      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || 'Failed to process image');
      }
      
      const result = await apiResponse.json();
      
      // Force a small delay to ensure state updates properly
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Update processed image
      setProcessedImage(result.processedImage);
      console.log("Processed image set:", result.processedImage ? "Image data received" : "No image data");
      
      // Update blur information
      setIsBlurry(result.isBlurry);
      setBlurType(result.blurType);
      
      // Get upscaled image dimensions
      const img = new window.Image();
      img.onload = () => {
        setUpscaledDimensions({
          width: img.width,
          height: img.height
        });
      };
      img.src = result.processedImage;
      
      // Show success notification
      toast.success("Image Upscaled", {
        description: "Your image has been successfully upscaled.",
      });
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error("Failed to upscale image", {
        description: error instanceof Error ? error.message : "An error occurred while processing your image.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;
    
    // Create a temporary link to download the image
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `upscaled-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up after a short delay to ensure the download starts
    setTimeout(() => {
    document.body.removeChild(link);
    }, 100);
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setProcessedImage(null);
    setOriginalDimensions(null);
    setUpscaledDimensions(null);
    setIsBlurry(null);
    setBlurType(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Image Upscaler</h1>
        <p className="text-gray-600 text-center max-w-2xl">
          Enhance your images by upscaling them to higher resolutions while maintaining quality.
          Perfect for enlarging photos without losing clarity.
            </p>
          </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'
                }`}
              >
                <input {...getInputProps()} ref={fileInputRef} />
                <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  {isDragActive
                    ? "Drop your image here"
                    : "Drag and drop your image here, or click to select"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supports JPG, PNG, WebP (max 10MB)
                </p>
              </div>
            </div>

            {previewImage && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">
                  {processedImage ? "Image Comparison" : "Preview"}
                </h2>
                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                {processedImage ? (
                  <div className="w-full h-full">
                    <ImageComparison
                      originalImage={previewImage || ''}
                      upscaledImage={processedImage}
                      originalDimensions={originalDimensions}
                      upscaledDimensions={upscaledDimensions}
                      onDownload={handleDownload}
                    />
                  </div>
                ) : (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                )}
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 z-30"
                  >
                    <X className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                
                {/* Action Buttons */}
                {previewImage && (
                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    {processedImage && (
                      <button
                        onClick={handleDownload}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-md"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </button>
                    )}
                    <button
                      onClick={handleRemoveImage}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-md"
                    >
                      <X className="h-4 w-4" />
                      Remove Image
                    </button>
                  </div>
                )}
                
                {isBlurry !== null && (
                  <div className="mt-4 p-2 rounded bg-gray-50 text-xs">
                    <div className="font-medium">Image Analysis:</div>
                    <div>
                      {isBlurry ? (
                        <>
                          <span className="text-amber-600">Blurry image detected</span>
                          {blurType && (
                            <span> ({blurType} blur)</span>
                          )}
                          <div className="mt-1 text-gray-600">
                            The upscaler has applied specialized enhancement techniques to improve this image.
                          </div>
                        </>
                      ) : (
                        <span className="text-green-600">Sharp image detected</span>
                    )}
                    </div>
                  </div>
                )}
            </div>
            )}

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Settings</h2>
              <div className="space-y-4">
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scale Factor
                  </label>
                  <Select
                    value={scaleFactor}
                    onValueChange={setScaleFactor}
                    data-tool="image-upscaler"
                    data-value="scaleFactor"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select scale factor" />
                      </SelectTrigger>
                      <SelectContent>
                      <SelectItem value="1.5x">1.5x (50% larger)</SelectItem>
                      <SelectItem value="2x">2x (100% larger)</SelectItem>
                      <SelectItem value="3x">3x (200% larger)</SelectItem>
                      <SelectItem value="4x">4x (300% larger)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quality
                  </label>
                  <Select
                    value={quality}
                    onValueChange={setQuality}
                    data-tool="image-upscaler"
                    data-value="quality"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select quality" />
                      </SelectTrigger>
                      <SelectContent>
                      <SelectItem value="high">High (best quality, larger file)</SelectItem>
                      <SelectItem value="medium">Medium (balanced)</SelectItem>
                      <SelectItem value="low">Low (smaller file)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  </div>
                </div>

            <div className="flex justify-center">
                  <Button 
                    onClick={handleProcessImage}
                    disabled={!previewImage || isProcessing}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md flex items-center gap-2"
                  >
                    {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                        <ZoomIn className="h-4 w-4" />
                    Upscale Image
                  </>
                )}
                    </Button>
                  </div>
                </div>
              </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Upload an image you want to upscale</li>
              <li>Choose your desired scale factor (1.5x to 4x)</li>
              <li>Select the quality level (higher quality = larger file size)</li>
              <li>Click "Upscale Image" to process</li>
              <li>Use the slider to compare original and upscaled images</li>
              <li>Download your upscaled image when satisfied</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
} 