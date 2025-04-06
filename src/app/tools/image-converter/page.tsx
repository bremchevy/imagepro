"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sliders, RefreshCw, Download, History, Image as ImageIcon, Settings, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export default function ImageConverterPage() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputFormat, setOutputFormat] = useState("png");
  const [quality, setQuality] = useState("high");
  const [metadata, setMetadata] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFormatDropdownOpen, setIsFormatDropdownOpen] = useState(false);
  const formatDropdownRef = useRef<HTMLDivElement>(null);

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
      console.log(`Processing image to format: ${outputFormat}`);
      
      // Convert base64 to blob
      const response = await fetch(previewImage);
      const blob = await response.blob();
      
      // Create form data
      const formData = new FormData();
      formData.append('image', blob, 'image.png');
      formData.append('outputFormat', outputFormat);
      formData.append('quality', quality);
      
      console.log(`Sending request to convert image to ${outputFormat}`);
      
      // Call image conversion API
      const apiResponse = await fetch('/api/image-converter', {
        method: 'POST',
        body: formData,
      });
      
      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        console.error('API error:', errorData);
        throw new Error(errorData.error || 'Failed to convert image');
      }
      
      const result = await apiResponse.json();
      console.log('Conversion successful:', result.metadata);
      
      setProcessedImage(result.processedImage);
      
      // Set metadata if available
      if (result.metadata) {
        setMetadata(result.metadata);
      }
      
      toast.success("Image converted successfully!", {
        description: `Your image has been converted from ${result.metadata?.originalFormat?.toUpperCase() || 'unknown'} to ${outputFormat.toUpperCase()}.`,
      });
    } catch (error) {
      console.error('Error converting image:', error);
      toast.error("Failed to convert image", {
        description: error instanceof Error ? error.message : "An error occurred while converting your image.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;
    
    // Get the correct file extension
    let fileExtension = outputFormat;
    if (outputFormat === 'jpg') {
      fileExtension = 'jpg';
    } else if (outputFormat === 'jpeg') {
      fileExtension = 'jpg';
    } else if (outputFormat === 'heic') {
      fileExtension = 'heic';
    }
    
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `converted-${Date.now()}.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add click outside handler for the format dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formatDropdownRef.current && !formatDropdownRef.current.contains(event.target as Node)) {
        setIsFormatDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-50/50 to-white">
      <main className="flex-1">
        <div className="container min-h-[calc(100vh-8rem)] py-4 sm:py-8">
          {/* Header */}
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-2 sm:mb-3">
              Image Converter
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
              Convert your images between different formats while maintaining high quality.
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
                {processedImage && (
                  <div className="flex flex-col gap-4">
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={processedImage}
                        alt="Processed image"
                      fill
                        className="object-contain"
                    />
                    </div>
                    
                    {metadata && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium mb-2">Conversion Details</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">Original Format:</span>
                            <span className="ml-2 font-medium">{metadata.originalFormat?.toUpperCase()}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Output Format:</span>
                            <span className="ml-2 font-medium">{metadata.outputFormat?.toUpperCase()}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Original Size:</span>
                            <span className="ml-2 font-medium">{metadata.originalWidth} x {metadata.originalHeight}</span>
                  </div>
                          <div>
                            <span className="text-gray-500">Processed Size:</span>
                            <span className="ml-2 font-medium">{metadata.processedWidth} x {metadata.processedHeight}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">File Size:</span>
                            <span className="ml-2 font-medium">{(metadata.processedSize || 0).toFixed(2)} KB</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-end">
                      <Button
                        onClick={handleDownload}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Right Side - Tool Settings */}
            <Card className="p-3 h-full bg-white border-0 shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md">
                    <RefreshCw className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Image Converter</h3>
                    <p className="text-[10px] text-gray-600 mt-0.5">
                      Convert images between different formats with high quality preservation
                    </p>
                  </div>
                </div>

                {/* Tool Settings */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-gray-500" />
                      <span className="text-xs font-medium text-gray-700">Output Format</span>
                    </div>
                    <div className="relative" ref={formatDropdownRef}>
                      <button
                        onClick={() => setIsFormatDropdownOpen(!isFormatDropdownOpen)}
                        className="flex items-center justify-between h-7 w-[120px] text-xs px-2 py-1 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        <span>{outputFormat.toUpperCase()}</span>
                        <ChevronDown className="h-3 w-3 text-gray-500" />
                      </button>
                      {isFormatDropdownOpen && (
                        <div className="absolute z-10 mt-1 w-[120px] bg-white border border-gray-300 rounded-md shadow-lg">
                          <div className="py-1 max-h-[200px] overflow-y-auto">
                            <button
                              onClick={() => {
                                setOutputFormat("png");
                                setIsFormatDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-1 text-xs hover:bg-gray-100 flex items-center justify-between ${
                                outputFormat === "png" ? "bg-blue-50 text-blue-600 font-medium" : ""
                              }`}
                            >
                              PNG
                              {outputFormat === "png" && (
                                <span className="text-blue-500">✓</span>
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setOutputFormat("jpg");
                                setIsFormatDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-1 text-xs hover:bg-gray-100 flex items-center justify-between ${
                                outputFormat === "jpg" ? "bg-blue-50 text-blue-600 font-medium" : ""
                              }`}
                            >
                              JPG
                              {outputFormat === "jpg" && (
                                <span className="text-blue-500">✓</span>
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setOutputFormat("jpeg");
                                setIsFormatDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-1 text-xs hover:bg-gray-100 flex items-center justify-between ${
                                outputFormat === "jpeg" ? "bg-blue-50 text-blue-600 font-medium" : ""
                              }`}
                            >
                              JPEG
                              {outputFormat === "jpeg" && (
                                <span className="text-blue-500">✓</span>
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setOutputFormat("webp");
                                setIsFormatDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-1 text-xs hover:bg-gray-100 flex items-center justify-between ${
                                outputFormat === "webp" ? "bg-blue-50 text-blue-600 font-medium" : ""
                              }`}
                            >
                              WebP
                              {outputFormat === "webp" && (
                                <span className="text-blue-500">✓</span>
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setOutputFormat("gif");
                                setIsFormatDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-1 text-xs hover:bg-gray-100 flex items-center justify-between ${
                                outputFormat === "gif" ? "bg-blue-50 text-blue-600 font-medium" : ""
                              }`}
                            >
                              GIF
                              {outputFormat === "gif" && (
                                <span className="text-blue-500">✓</span>
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setOutputFormat("tiff");
                                setIsFormatDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-1 text-xs hover:bg-gray-100 flex items-center justify-between ${
                                outputFormat === "tiff" ? "bg-blue-50 text-blue-600 font-medium" : ""
                              }`}
                            >
                              TIFF
                              {outputFormat === "tiff" && (
                                <span className="text-blue-500">✓</span>
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setOutputFormat("avif");
                                setIsFormatDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-1 text-xs hover:bg-gray-100 flex items-center justify-between ${
                                outputFormat === "avif" ? "bg-blue-50 text-blue-600 font-medium" : ""
                              }`}
                            >
                              AVIF
                              {outputFormat === "avif" && (
                                <span className="text-blue-500">✓</span>
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setOutputFormat("heic");
                                setIsFormatDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-1 text-xs hover:bg-gray-100 flex items-center justify-between ${
                                outputFormat === "heic" ? "bg-blue-50 text-blue-600 font-medium" : ""
                              }`}
                            >
                              HEIC
                              {outputFormat === "heic" && (
                                <span className="text-blue-500">✓</span>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
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
                    <p className="text-xs text-gray-600">1. Upload your image</p>
                    <p className="text-xs text-gray-600">2. Select your desired output format</p>
                    <p className="text-xs text-gray-600">3. Adjust quality settings if needed</p>
                    <p className="text-xs text-gray-600">4. Download your converted image</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 text-white shadow-md hover:shadow-lg transition-all duration-200 text-sm py-1.5"
                    onClick={handleProcessImage}
                    disabled={!previewImage || isProcessing}
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Converting...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4" />
                        <span>Convert Image</span>
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