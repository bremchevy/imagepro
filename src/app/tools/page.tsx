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
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-50 to-white">
      <main className="flex-1">
        <div className="container min-h-[calc(100vh-8rem)] py-8">
          {/* Enhanced Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-purple-500/10 text-violet-600 mb-3"
            >
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Professional AI Image Tools</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-purple-600"
            >
              Transform Your Images with AI Magic
            </motion.h1>
          </div>

          {/* Enhanced Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
            {allTools.map((tool) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="group"
              >
                <Link href={`/tools/${tool.id}`}>
                  <Card className="relative overflow-hidden border-0 bg-white/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div className={`absolute inset-0 bg-gradient-to-br ${tool.bgGradient} opacity-40 group-hover:opacity-60 transition-opacity duration-300`} />
                    <div className="relative p-8">
                      <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${tool.gradient} text-white mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1`}>
                        {tool.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">
                        {tool.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-6 line-clamp-2">
                        {tool.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {tool.isFree ? (
                            <Badge variant="secondary" className="bg-green-100/80 text-green-700 px-3 py-1 rounded-full font-medium">
                              Free
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-purple-100/80 text-purple-700 px-3 py-1 rounded-full font-medium">
                              Pro
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center text-gray-400 group-hover:text-purple-600 transition-colors duration-300">
                          <span className="text-sm font-medium mr-2">Try Now</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}