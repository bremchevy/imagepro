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
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50",
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
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-50/50 to-white">
      <main className="flex-1">
        <div className="container min-h-[calc(100vh-8rem)] py-4 sm:py-8">
          {/* Free Trial Counter */}
          <div className="absolute top-4 right-4 md:top-4 md:right-20 z-10">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-gray-100">
              <div className="flex items-center gap-1">
                <Crown className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-gray-900">
                  {editCount}/{FREE_TRIAL_LIMIT} free trials
                </span>
              </div>
              {editCount >= WARNING_THRESHOLD && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-yellow-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>You're approaching your daily limit. Upgrade to Pro for unlimited access.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-4 sm:mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-600 mb-2 sm:mb-3"
            >
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm font-medium">Professional AI Image Tools</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-2xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-2 sm:mb-3 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600"
            >
              Transform Your Images with AI Magic
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed px-4"
            >
              Create stunning visuals in seconds with our powerful AI tools. Perfect for designers, photographers, and content creators.
            </motion.p>
          </div>

          {/* Upgrade Banner - Only show for non-pro users */}
          {!user?.isPro && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-4 sm:mb-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-3 sm:p-4 border border-primary/20"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Crown className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Upgrade to Pro</h3>
                    <p className="text-xs text-gray-600">Get unlimited access to all AI tools</p>
                  </div>
                </div>
                <Button 
                  className="bg-gradient-to-r from-primary to-primary/80 text-white shadow-md hover:shadow-lg"
                  onClick={() => router.push('/pricing')}
                >
                  Upgrade Now
                </Button>
              </div>
            </motion.div>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Left Side - Preview Area */}
            <div className="relative min-h-[250px] sm:min-h-[300px]">
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
                    <div 
                      className="absolute inset-0 rounded-lg"
                      style={{ backgroundColor: backgroundType === "transparent" ? "transparent" : backgroundColor }}
                    />
                    <Image
                      src={processedImage}
                      alt="Processed Result"
                      fill
                      className="object-cover rounded-lg transition-all duration-300"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 rounded-lg">
                      <Button
                        variant="secondary"
                        className="bg-white text-gray-900 hover:bg-white/90"
                        onClick={handleDownload}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Result
                      </Button>
                      <Button
                        variant="secondary"
                        className="bg-white text-gray-900 hover:bg-white/90"
                        onClick={() => {
                          setProcessedImage(null);
                          setPreviewImage(null);
                        }}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload New Image
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
                            <RefreshCw className="h-6 w-6 text-white animate-spin" />
                          </div>
                          <p className="text-white text-sm font-medium">Processing your image...</p>
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

              {/* Processing Indicator */}
              {isProcessing && (
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse" />
                    <span className="text-[10px] sm:text-xs text-gray-600 font-medium">Processing...</span>
                  </div>
                </div>
              )}

              {/* History Section */}
              {showHistory && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-lg p-3 sm:p-4 z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <History className="h-4 w-4 text-gray-500" />
                      <h3 className="text-sm font-semibold text-gray-900">Edit History</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                      >
                        <Save className="h-3.5 w-3.5 mr-1" />
                        Save All
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowHistory(false)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-3 max-h-[calc(100%-4rem)] overflow-y-auto pr-2">
                    {/* History Items */}
                    <div className="grid grid-cols-2 gap-3">
                      {(user?.imageProcessingHistory || []).length === 0 ? (
                        <div className="col-span-2 flex flex-col items-center justify-center py-12 px-4 text-center">
                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                            <History className="h-6 w-6 text-gray-400" />
                          </div>
                          <h4 className="text-sm font-medium text-gray-900 mb-1">No History Yet</h4>
                          <p className="text-xs text-gray-500 max-w-[200px]">
                            Your processed images will appear here. Start by processing your first image!
                          </p>
                        </div>
                      ) : (
                        (user?.imageProcessingHistory || []).map((item: ImageProcessingHistoryItem) => (
                          <div key={item.id} className="group relative bg-white rounded-lg border border-gray-100 p-2 hover:border-primary/50 transition-all">
                            <div className="relative aspect-square rounded-md overflow-hidden mb-2">
                              <Image
                                src={item.processedImage}
                                alt="Processed image"
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="flex gap-2">
                                  <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    className="h-8 w-8 p-0"
                                    onClick={() => handleHistoryDownload(item.processedImage)}
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                  <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                                    <Share2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <p className="text-xs font-medium text-gray-900">
                                  {allTools.find(t => t.id === item.toolId)?.name || 'Unknown Tool'}
                                </p>
                                <Badge variant="secondary" className="text-[10px]">
                                  {new Date(item.timestamp).toLocaleDateString()}
                                </Badge>
                              </div>
                              <p className="text-[10px] text-gray-500">
                                {new Date(item.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - Tool Selection */}
            <div className="space-y-3 sm:space-y-4">
              <Tabs defaultValue={tools[0].id} className="w-full" onValueChange={(value) => {
                const tool = tools.find(t => t.id === value);
                if (tool) setSelectedTool(tool);
              }}>
                <TabsList className="w-full justify-start bg-white p-0.5 rounded-lg shadow-sm border border-gray-100">
                  {tools.map((tool) => (
                    <TabsTrigger
                      key={tool.id}
                      value={tool.id}
                      className="flex-1 flex items-center justify-center gap-1 px-1.5 sm:px-2 py-1 rounded-md data-[state=active]:text-blue-500 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 transition-all duration-200 relative"
                    >
                      <div className={`p-0.5 rounded-md ${tool.gradient} text-white`}>
                        {tool.icon}
                      </div>
                      <span className="text-[10px] sm:text-xs">{tool.name}</span>
                      {tool.isLocked && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-md flex items-center justify-center">
                          <Lock className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-gray-400" />
                        </div>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {tools.map((tool) => (
                  <TabsContent key={tool.id} value={tool.id} className="h-[calc(100%-2rem)]">
                    <Card className="p-3 h-full bg-white border-0 shadow-sm">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg bg-gradient-to-r ${tool.gradient} text-white shadow-md`}>
                            {tool.icon}
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900">{tool.name}</h3>
                            <p className="text-[10px] text-gray-600 mt-0.5">{tool.description}</p>
                          </div>
                        </div>
                        
                        {/* Tool Settings */}
                        <div className="space-y-2">
                          {tool.id === "background-removal" && (
                            <>
                              <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-2">
                                  <Settings2 className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs font-medium text-gray-700">Edge Detection</span>
                                </div>
                                <Select defaultValue="auto">
                                  <SelectTrigger className="h-7 w-[100px] text-xs">
                                    <SelectValue placeholder="Auto" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="auto">Auto</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-2">
                                  <Palette className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs font-medium text-gray-700">Background Type</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Select 
                                    defaultValue={backgroundType} 
                                    onValueChange={handleBackgroundChange}
                                  >
                                    <SelectTrigger className="h-7 w-[120px] text-xs">
                                      <SelectValue placeholder="Transparent" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="transparent">
                                        <div className="flex items-center gap-2">
                                          <div className="w-4 h-4 rounded border border-gray-200 bg-transparent" />
                                          <span>Transparent</span>
                                        </div>
                                      </SelectItem>
                                      <SelectItem value="white">
                                        <div className="flex items-center gap-2">
                                          <div className="w-4 h-4 rounded border border-gray-200 bg-white" />
                                          <span>White</span>
                                        </div>
                                      </SelectItem>
                                      <SelectItem value="black">
                                        <div className="flex items-center gap-2">
                                          <div className="w-4 h-4 rounded border border-gray-200 bg-black" />
                                          <span>Black</span>
                                        </div>
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Info className="h-3.5 w-3.5 text-gray-400" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Choose how you want the background to appear in your processed image</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </div>
                              <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-2">
                                  <Crop className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs font-medium text-gray-700">Auto Crop</span>
                                </div>
                                <Switch className="h-4 w-7" />
                              </div>
                            </>
                          )}

                          {tool.id === "image-converter" && (
                            <>
                              <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-2">
                                  <Settings2 className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs font-medium text-gray-700">Output Format</span>
                                </div>
                                <Select defaultValue="png">
                                  <SelectTrigger className="h-7 w-[100px] text-xs">
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
                              <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-2">
                                  <Sliders className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs font-medium text-gray-700">Quality</span>
                                </div>
                                <Select defaultValue="high">
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
                            </>
                          )}

                          {tool.id === "image-upscaler" && (
                            <>
                              <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-2">
                                  <ZoomIn className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs font-medium text-gray-700">Scale Factor</span>
                                </div>
                                <Select defaultValue="2x">
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
                                <Select defaultValue="high">
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
                            </>
                          )}

                          {tool.id === "image-enhancement" && (
                            <>
                              <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-2">
                                  <Sliders className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs font-medium text-gray-700">Brightness</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Slider defaultValue={[50]} max={100} step={1} className="w-[120px]" />
                                  <span className="text-xs text-gray-500 w-8 text-right">50%</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-2">
                                  <Sliders className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs font-medium text-gray-700">Contrast</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Slider defaultValue={[50]} max={100} step={1} className="w-[120px]" />
                                  <span className="text-xs text-gray-500 w-8 text-right">50%</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-2">
                                  <Sliders className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs font-medium text-gray-700">Sharpness</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Slider defaultValue={[50]} max={100} step={1} className="w-[120px]" />
                                  <span className="text-xs text-gray-500 w-8 text-right">50%</span>
                                </div>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Tool-specific Instructions */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <ImageIcon className="h-4 w-4 text-gray-500" />
                            <h4 className="text-xs font-medium text-gray-700">Quick Guide</h4>
                          </div>
                          {tool.id === "background-removal" && (
                            <div className="space-y-1.5">
                              <p className="text-xs text-gray-600">1. Upload your image (PNG, JPG, or JPEG)</p>
                              <p className="text-xs text-gray-600">2. Fine-tune edge detection for perfect results</p>
                              <p className="text-xs text-gray-600">3. Choose your preferred background style</p>
                              <p className="text-xs text-gray-600">4. Download your professional transparent image</p>
                            </div>
                          )}
                          {tool.id === "image-converter" && (
                            <div className="space-y-1.5">
                              <p className="text-xs text-gray-600">1. Upload your image</p>
                              <p className="text-xs text-gray-600">2. Select your desired output format</p>
                              <p className="text-xs text-gray-600">3. Adjust quality settings if needed</p>
                              <p className="text-xs text-gray-600">4. Download your converted image</p>
                            </div>
                          )}
                          {tool.id === "image-upscaler" && (
                            <div className="space-y-1.5">
                              <p className="text-xs text-gray-600">1. Upload your image (up to 10MB)</p>
                              <p className="text-xs text-gray-600">2. Select your desired enlargement scale</p>
                              <p className="text-xs text-gray-600">3. Choose quality settings</p>
                              <p className="text-xs text-gray-600">4. Download your high-resolution image</p>
                            </div>
                          )}
                          {tool.id === "image-enhancement" && (
                            <div className="space-y-1.5">
                              <p className="text-xs text-gray-600">1. Upload your image</p>
                              <p className="text-xs text-gray-600">2. Adjust brightness, contrast, and sharpness</p>
                              <p className="text-xs text-gray-600">3. Preview the changes in real-time</p>
                              <p className="text-xs text-gray-600">4. Download your enhanced image</p>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button 
                            className={`flex-1 bg-gradient-to-r ${tool.gradient} hover:opacity-90 text-white shadow-md hover:shadow-lg transition-all duration-200 text-sm py-1.5`}
                            onClick={handleProcessImage}
                            disabled={!previewImage || isProcessing || tool.isLocked}
                          >
                            {isProcessing ? (
                              <div className="flex items-center gap-2">
                                <RefreshCw className="h-4 w-4 animate-spin" />
                                <span>Processing...</span>
                              </div>
                            ) : tool.isLocked ? (
                              <div className="flex items-center gap-2">
                                <Lock className="h-4 w-4" />
                                <span>Pro Feature</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Wand2 className="h-4 w-4" />
                                <span>Process Image</span>
                              </div>
                            )}
                          </Button>
                          <div className="flex gap-1">
                            {previewImage && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="px-2"
                                onClick={() => {/* Handle download */}}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="px-2"
                              onClick={() => setShowHistory(true)}
                            >
                              <History className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>

          {/* Upgrade Prompt Overlay */}
          {editCount >= FREE_TRIAL_LIMIT && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <Card className="max-w-md w-full mx-4 p-6 bg-white/95 backdrop-blur-sm">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Crown className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                    Daily Trial Limit Reached
                  </h3>
                  <p className="text-gray-600">
                    You've used all {FREE_TRIAL_LIMIT} free trials for today. Upgrade to Pro for unlimited access to all tools.
                  </p>
                </div>
                <div className="flex gap-4">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-primary to-primary/80 text-white shadow-md hover:shadow-lg"
                    onClick={() => router.push('/pricing')}
                  >
                    Upgrade to Pro
                  </Button>
                  {!user && (
                    <Button 
                      variant="outline"
                      className="flex-1"
                      onClick={() => router.push('/signup')}
                    >
                      Sign Up Free
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}