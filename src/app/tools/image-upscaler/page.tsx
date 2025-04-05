"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sliders, ZoomIn, Download, History, Image as ImageIcon, Upload, ArrowRight, Settings2, X, RefreshCw } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import { Slider } from "@/components/ui/slider";

export default function ImageUpscalerPage() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scaleFactor, setScaleFactor] = useState("2");
  const [quality, setQuality] = useState("high");
  const [comparisonPosition, setComparisonPosition] = useState(50);
  const [showComparison, setShowComparison] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
  });

  const handleSliderChange = (value: number[]) => {
    setComparisonPosition(value[0]);
  };

  const handleSliderTrackMouseDown = (e: React.MouseEvent) => {
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const position = ((e.clientX - rect.left) / rect.width) * 100;
      setComparisonPosition(Math.max(0, Math.min(100, position)));
    }
  };

  const handleProcessImage = async () => {
    if (!previewImage) return;

    setIsProcessing(true);
    try {
      // Convert base64 to blob
      const response = await fetch(previewImage);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("image", blob);
      formData.append("scaleFactor", scaleFactor);
      formData.append("quality", quality);

      const res = await fetch("/api/image-upscaler", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to process image");
      }

      const data = await res.json();
      setProcessedImage(data.processedImage);
      setShowComparison(true);
      setComparisonPosition(50);
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to process image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `upscaled-${Date.now()}.png`;
    
    // Append to body, click, and remove
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
    setShowComparison(false);
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
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
              >
                <input {...getInputProps()} ref={fileInputRef} />
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  Drag & drop your image here, or click to select
                </p>
                <p className="text-xs text-gray-500">
                  Supports JPG, PNG, WebP (Max 10MB)
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
                    <>
                      <div className="absolute inset-0">
                        <img
                          src={processedImage}
                          alt="Upscaled"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div 
                        className="absolute inset-0 overflow-hidden"
                        style={{ width: `${comparisonPosition}%` }}
                      >
                        <img
                          src={previewImage || ''}
                          alt="Original"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div 
                        className="absolute top-0 bottom-0 w-1 bg-blue-500 cursor-ew-resize"
                        style={{ left: `${comparisonPosition}%` }}
                      />
                      <div className="absolute top-4 left-4 bg-white px-2 py-1 rounded text-sm font-medium shadow-sm">
                        Original
                      </div>
                      <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded text-sm font-medium shadow-sm">
                        Upscaled
                      </div>
                    </>
                  ) : (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  )}
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                  >
                    <X className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                
                {processedImage && (
                  <div className="mt-6 border border-blue-200 rounded-lg p-4 bg-blue-50">
                    <h3 className="text-lg font-medium mb-3 text-center text-blue-700">Compare Original vs Upscaled</h3>
                    
                    {/* Image Comparison */}
                    <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
                      <div className="absolute inset-0">
                        <img
                          src={processedImage}
                          alt="Upscaled"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div 
                        className="absolute inset-0 overflow-hidden"
                        style={{ width: `${comparisonPosition}%` }}
                      >
                        <img
                          src={previewImage || ''}
                          alt="Original"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div 
                        className="absolute top-0 bottom-0 w-1 bg-blue-500 cursor-ew-resize"
                        style={{ left: `${comparisonPosition}%` }}
                      />
                      <div className="absolute top-4 left-4 bg-white px-2 py-1 rounded text-sm font-medium shadow-sm">
                        Original
                      </div>
                      <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded text-sm font-medium shadow-sm">
                        Upscaled
                      </div>
                    </div>
                    
                    {/* Slider Controls */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-700">Original</span>
                        <span className="text-sm font-medium text-blue-700">Upscaled</span>
                      </div>
                      <div className="relative h-4 bg-gray-200 rounded-full">
                        <div 
                          className="absolute h-full bg-blue-500 rounded-full"
                          style={{ width: `${comparisonPosition}%` }}
                        />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={comparisonPosition}
                          onChange={(e) => setComparisonPosition(parseInt(e.target.value))}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div 
                          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-2 border-blue-500 rounded-full shadow-md"
                          style={{ left: `calc(${comparisonPosition}% - 12px)` }}
                        />
                      </div>
                      <div className="flex justify-center">
                        <Button
                          onClick={() => setComparisonPosition(50)}
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-blue-600 hover:bg-blue-50"
                        >
                          Reset to Middle
                        </Button>
                      </div>
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
                  <select
                    value={scaleFactor}
                    onChange={(e) => setScaleFactor(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    data-tool="image-upscaler"
                    data-value="scaleFactor"
                  >
                    <option value="1.5">1.5x</option>
                    <option value="2">2x</option>
                    <option value="3">3x</option>
                    <option value="4">4x</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quality
                  </label>
                  <select
                    value={quality}
                    onChange={(e) => setQuality(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    data-tool="image-upscaler"
                    data-value="quality"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
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
            
            {processedImage && (
              <div className="mt-6 flex justify-center gap-4">
                <Button
                  onClick={handleDownload}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Upscaled Image
                </Button>
              </div>
            )}
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