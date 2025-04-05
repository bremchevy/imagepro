"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Wand2, Palette, Eraser, Upload, Sliders, Download, Share2, ZoomIn, Settings2, Image as ImageIcon, Layers, Crop, Brush, Wand2 as Wand2Icon, Sparkles as SparklesIcon, RefreshCw, Save, History, Crown, Lock, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { User, ImageProcessingHistoryItem } from "@/types/user";
import { toast } from "sonner";

const allTools = [
  {
    id: "background-removal",
    name: "Background Remover",
    description: "Instantly remove backgrounds with AI precision. Perfect for product photos, portraits, and creative designs.",
    icon: <Eraser className="h-6 w-6" />,
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
    states: ["original", "removed", "transparent"],
    isFree: true
  },
  {
    id: "image-converter",
    name: "Image Converter",
    description: "Convert images between different formats (PNG, JPG, JPEG, WebP) with high quality preservation.",
    icon: <RefreshCw className="h-6 w-6" />,
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-50 to-emerald-50",
    isFree: true
  },
  {
    id: "image-upscaler",
    name: "Image Upscaler",
    description: "Enhance image quality up to 4x with advanced AI. Ideal for enlarging photos while preserving details.",
    icon: <ZoomIn className="h-6 w-6" />,
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50",
    isFree: true
  },
  {
    id: "image-enhancement",
    name: "Image Enhancement",
    description: "Improve image quality with AI-powered enhancements for brightness, contrast, and sharpness.",
    icon: <Sparkles className="h-6 w-6" />,
    gradient: "from-orange-500 to-red-500",
    bgGradient: "from-orange-50 to-red-50",
    isFree: true
  }
];

export default function ToolsPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  // Add authentication check
  useEffect(() => {
    if (!user) {
      toast.error("Please sign in to access the tools", {
        description: "You need to be signed in to use our image processing tools.",
        action: {
          label: "Sign In",
          onClick: () => router.push('/auth/signin'),
        },
      });
      router.push('/auth/signin');
    }
  }, [user, router]);

  // Show loading state while checking authentication
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Access Restricted</h3>
          <p className="text-gray-600 mb-4">Please sign in to access our tools.</p>
          <Button 
            className="bg-gradient-to-r from-primary to-primary/80 text-white shadow-md hover:shadow-lg"
            onClick={() => router.push('/auth/signin')}
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  const [selectedTool, setSelectedTool] = useState(allTools[0]);
  const [editCount, setEditCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [backgroundType, setBackgroundType] = useState("transparent");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const FREE_TRIAL_LIMIT = 10;
  const WARNING_THRESHOLD = 7;
  const [backgroundState, setBackgroundState] = useState("original");

  // Show all tools but mark non-free ones as locked
  const tools = allTools.map(tool => ({
    ...tool,
    isLocked: !user?.isPro && !tool.isFree
  }));

  const progress = (editCount / FREE_TRIAL_LIMIT) * 100;
  const remainingTrials = FREE_TRIAL_LIMIT - editCount;

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
      formData.append('backgroundType', backgroundType);
      
      // Call background removal API
      const apiResponse = await fetch('/api/background-removal', {
        method: 'POST',
        body: formData,
      });
      
      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || 'Failed to process image');
      }
      
      const result = await apiResponse.json();
      
      // Update processed image with the result
      setProcessedImage(result.processedImage);
      setEditCount(prev => prev + 1);
      
      // Add to history
      if (user) {
        const historyItem: ImageProcessingHistoryItem = {
          id: Date.now().toString(),
          toolId: selectedTool.id,
          originalImage: previewImage,
          processedImage: result.processedImage,
          timestamp: new Date(),
          settings: {
            edgeDetection: 'auto',
            backgroundType: backgroundType,
            autoCrop: true
          }
        };
        // Update user's history
        user.imageProcessingHistory = [...(user.imageProcessingHistory || []), historyItem];
      }

      // Show success notification
      toast.success("Image processed successfully!", {
        description: "Your image has been processed and added to history.",
        action: {
          label: "View History",
          onClick: () => setShowHistory(true),
        },
      });
    } catch (error) {
      console.error('Error processing image:', error);
      // Show error notification with retry option
      toast.error("Failed to process image", {
        description: error instanceof Error ? error.message : "An error occurred while processing your image.",
        action: {
          label: "Retry",
          onClick: handleProcessImage,
        },
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
    link.download = `processed-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleHistoryDownload = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `processed-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBackgroundChange = async (type: string) => {
    setBackgroundType(type);
    if (!processedImage) return;

    // Create a new image element
    const img = document.createElement('img');
    img.src = processedImage;

    // Wait for image to load
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match image
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw background based on type
    switch (type) {
      case "transparent":
        // For transparent, we'll keep the alpha channel
        ctx.drawImage(img, 0, 0);
        break;
      case "white":
        // For white background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        break;
      case "black":
        // For black background
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        break;
      default:
        ctx.drawImage(img, 0, 0);
    }

    // Convert canvas to base64
    const newImageUrl = canvas.toDataURL('image/png');
    setProcessedImage(newImageUrl);
  };

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Image Processing Tools</h1>
        <p className="text-gray-600">Professional-grade image processing tools powered by AI</p>
      </div>

      {/* Tools Navigation */}
      <div className="mb-6">
        <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-lg p-1 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setSelectedTool(tool)}
                className={`py-1.5 px-2 rounded-md transition-all duration-300 ${
                  selectedTool.id === tool.id
                    ? 'bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 shadow-sm'
                    : 'hover:bg-gray-50/50 border-transparent'
                } border relative group overflow-hidden`}
              >
                {/* Glow effect for selected tool */}
                {selectedTool.id === tool.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50" />
                )}
                
                <div className="flex items-center justify-center gap-1 relative z-10">
                  <div className={`p-1 rounded-md bg-gradient-to-r ${tool.gradient} text-white shadow-sm transform group-hover:scale-110 transition-transform duration-300`}>
                    {tool.icon}
                  </div>
                  <span className={`font-medium text-xs whitespace-nowrap ${
                    selectedTool.id === tool.id ? 'text-primary' : 'text-gray-900'
                  }`}>
                    {tool.name}
                  </span>
                </div>
                
                {/* Animated indicator for selected tool */}
                {selectedTool.id === tool.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-primary/50" />
                )}
                
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Preview Section */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Image Preview</h2>
              <p className="text-sm text-gray-600">Upload and preview your image</p>
            </div>

            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                previewImage ? 'border-primary/50' : 'border-gray-200'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {previewImage ? (
                <div className="relative aspect-video">
                  <Image
                    src={previewImage}
                    alt="Preview"
                    fill
                    className="object-contain rounded-lg"
                  />
                  <button
                    onClick={() => setPreviewImage(null)}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Drag and drop your image here</p>
                    <p className="text-xs text-gray-500">or</p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-sm text-primary hover:underline"
                    >
                      Browse files
                    </button>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Settings Section */}
        <div>
          <Card className="p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Settings</h2>
              <p className="text-sm text-gray-600">Adjust tool settings</p>
            </div>

            {/* Tool Settings */}
            <div className="space-y-4">
              {selectedTool.id === "background-removal" && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Edge Detection</label>
                    <Select defaultValue="auto">
                      <SelectTrigger>
                        <SelectValue placeholder="Auto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Background Type</label>
                    <Select 
                      defaultValue={backgroundType} 
                      onValueChange={handleBackgroundChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Transparent" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="transparent">Transparent</SelectItem>
                        <SelectItem value="white">White</SelectItem>
                        <SelectItem value="black">Black</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Auto Crop</label>
                    <Switch defaultChecked />
                  </div>
                </>
              )}

              {selectedTool.id === "image-converter" && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Output Format</label>
                    <Select defaultValue="png">
                      <SelectTrigger>
                        <SelectValue placeholder="PNG" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="png">PNG</SelectItem>
                        <SelectItem value="jpg">JPG</SelectItem>
                        <SelectItem value="jpeg">JPEG</SelectItem>
                        <SelectItem value="webp">WebP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quality</label>
                    <Select defaultValue="high">
                      <SelectTrigger>
                        <SelectValue placeholder="High" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {selectedTool.id === "image-upscaler" && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Scale Factor</label>
                    <Select defaultValue="2x">
                      <SelectTrigger>
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

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quality</label>
                    <Select defaultValue="high">
                      <SelectTrigger>
                        <SelectValue placeholder="High" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {selectedTool.id === "image-enhancement" && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Brightness</label>
                    <Slider defaultValue={[50]} max={100} step={1} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Contrast</label>
                    <Slider defaultValue={[50]} max={100} step={1} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sharpness</label>
                    <Slider defaultValue={[50]} max={100} step={1} />
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-4">
              <Button
                className="w-full bg-gradient-to-r from-primary to-primary/80 text-white shadow-md hover:shadow-lg"
                onClick={handleProcessImage}
                disabled={!previewImage || isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Wand2 className="h-4 w-4" />
                    <span>Process Image</span>
                  </div>
                )}
              </Button>

              {processedImage && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleDownload}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </div>
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}