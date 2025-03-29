"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Wand2, Palette, Eraser, Upload, Sliders, Download, Share2, ZoomIn, Settings2, Image as ImageIcon, Layers, Crop, Brush, Wand2 as Wand2Icon, Sparkles as SparklesIcon, RefreshCw, Save, History } from "lucide-react";
import { useState, useRef } from "react";
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

const tools = [
  {
    id: "background-removal",
    name: "Background Remover",
    description: "Instantly remove backgrounds with AI precision. Perfect for product photos, portraits, and creative designs.",
    icon: <Eraser className="h-6 w-6" />,
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
    states: ["original", "removed", "transparent"]
  },
  {
    id: "upscale",
    name: "Image Upscaler",
    description: "Enhance image quality up to 4x with advanced AI. Ideal for enlarging photos while preserving details.",
    icon: <Zap className="h-6 w-6" />,
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50",
  },
  {
    id: "object-removal",
    name: "Object Remover",
    description: "Remove unwanted elements while maintaining image integrity. Great for cleaning up photos and removing distractions.",
    icon: <Wand2 className="h-6 w-6" />,
    gradient: "from-orange-500 to-red-500",
    bgGradient: "from-orange-50 to-red-50",
  }
];

export default function ToolsPage() {
  const { user } = useAuth();
  const [selectedTool, setSelectedTool] = useState(tools[0]);
  const [editCount, setEditCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const FREE_TRIAL_LIMIT = 10;
  const WARNING_THRESHOLD = 7; // Show warning when 7 or fewer trials remain
  const [backgroundState, setBackgroundState] = useState("original");

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
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      setEditCount(prev => prev + 1);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-50/50 to-white">
      <main className="flex-1">
        <div className="container h-[calc(100vh-4rem)] py-1">
          {/* Trial Counter - Fixed at top */}
          {!user && (
            <div className="fixed top-16 right-8 z-50 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-100">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                      Free Trials
                    </Badge>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3.5 w-3.5 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>You have {remainingTrials} free trials remaining</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <span className="text-lg font-bold text-primary">{remainingTrials}/10</span>
                </div>
                <Progress value={progress} className="h-1.5" />
              </div>
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-600 mb-3"
            >
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Professional AI Image Tools</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-bold tracking-tight text-gray-900 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600"
            >
              Transform Your Images with AI Magic
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed"
            >
              Create stunning visuals in seconds with our powerful AI tools. Perfect for designers, photographers, and content creators.
            </motion.p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100%-8rem)]">
            {/* Left Side - Preview Area */}
            <div className="relative">
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
                {previewImage ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={previewImage}
                      alt="Preview"
                      fill
                      className={`object-cover rounded-lg transition-all duration-300 ${
                        backgroundState === "transparent" ? "bg-[url('/grid.svg')] bg-repeat" : ""
                      }`}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
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
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse" />
                    <span className="text-xs text-gray-600 font-medium">Processing...</span>
                  </div>
                </div>
              )}

              {/* Background State Controls */}
              {previewImage && selectedTool.id === "background-removal" && (
                <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                  <Button
                    variant={backgroundState === "original" ? "default" : "outline"}
                    size="sm"
                    className="flex-1 bg-white/90 backdrop-blur-sm"
                    onClick={() => setBackgroundState("original")}
                  >
                    Original
                  </Button>
                  <Button
                    variant={backgroundState === "removed" ? "default" : "outline"}
                    size="sm"
                    className="flex-1 bg-white/90 backdrop-blur-sm"
                    onClick={() => setBackgroundState("removed")}
                  >
                    Removed
                  </Button>
                  <Button
                    variant={backgroundState === "transparent" ? "default" : "outline"}
                    size="sm"
                    className="flex-1 bg-white/90 backdrop-blur-sm"
                    onClick={() => setBackgroundState("transparent")}
                  >
                    Transparent
                  </Button>
                </div>
              )}
            </div>

            {/* Right Side - Tool Selection */}
            <div className="space-y-4 h-full overflow-y-auto pr-2">
              <Tabs defaultValue={tools[0].id} className="w-full" onValueChange={(value) => {
                const tool = tools.find(t => t.id === value);
                if (tool) setSelectedTool(tool);
              }}>
                <TabsList className="w-full justify-start bg-white p-0.5 rounded-lg shadow-sm border border-gray-100">
                  {tools.map((tool) => (
                    <TabsTrigger
                      key={tool.id}
                      value={tool.id}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded-md data-[state=active]:text-blue-500 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 transition-all duration-200"
                    >
                      <div className={`p-0.5 rounded-md ${tool.gradient} text-white`}>
                        {tool.icon}
                      </div>
                      <span className="text-xs">{tool.name}</span>
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
                        <div className="space-y-2 pt-1">
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
                                <Select defaultValue="transparent">
                                  <SelectTrigger className="h-7 w-[120px] text-xs">
                                    <SelectValue placeholder="Transparent" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="transparent">Transparent</SelectItem>
                                    <SelectItem value="white">White</SelectItem>
                                    <SelectItem value="black">Black</SelectItem>
                                  </SelectContent>
                                </Select>
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

                          {tool.id === "upscale" && (
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
                              <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-2">
                                  <SparklesIcon className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs font-medium text-gray-700">Enhance Details</span>
                                </div>
                                <Switch className="h-4 w-7" />
                              </div>
                            </>
                          )}

                          {tool.id === "object-removal" && (
                            <>
                              <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-2">
                                  <Brush className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs font-medium text-gray-700">Brush Size</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Slider defaultValue={[50]} max={100} step={1} className="w-[120px]" />
                                  <span className="text-xs text-gray-500 w-8 text-right">50%</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-2">
                                  <Wand2Icon className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs font-medium text-gray-700">AI Mode</span>
                                </div>
                                <Select defaultValue="smart">
                                  <SelectTrigger className="h-7 w-[100px] text-xs">
                                    <SelectValue placeholder="Smart" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="smart">Smart</SelectItem>
                                    <SelectItem value="fast">Fast</SelectItem>
                                    <SelectItem value="precise">Precise</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-2">
                                  <Layers className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs font-medium text-gray-700">Layer Mode</span>
                                </div>
                                <Switch className="h-4 w-7" />
                              </div>
                            </>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button 
                            className={`flex-1 bg-gradient-to-r ${tool.gradient} hover:opacity-90 text-white shadow-md hover:shadow-lg transition-all duration-200 text-sm py-1.5`}
                            onClick={handleProcessImage}
                            disabled={!previewImage || isProcessing}
                          >
                            {isProcessing ? (
                              <div className="flex items-center gap-2">
                                <RefreshCw className="h-4 w-4 animate-spin" />
                                <span>Processing...</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Wand2 className="h-4 w-4" />
                                <span>Process Image</span>
                              </div>
                            )}
                          </Button>
                          {previewImage && (
                            <div className="flex gap-1">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="px-2"
                                onClick={() => {/* Handle download */}}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="px-2"
                                onClick={() => {/* Handle save */}}
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="px-2"
                                onClick={() => {/* Handle history */}}
                              >
                                <History className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>

                        {/* Tool-specific Instructions */}
                        <div className="bg-gray-50 p-3 rounded-lg space-y-2">
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
                          {tool.id === "upscale" && (
                            <div className="space-y-1.5">
                              <p className="text-xs text-gray-600">1. Upload your image (up to 10MB)</p>
                              <p className="text-xs text-gray-600">2. Select your desired enlargement scale</p>
                              <p className="text-xs text-gray-600">3. Enable AI enhancement for better quality</p>
                              <p className="text-xs text-gray-600">4. Download your high-resolution image</p>
                            </div>
                          )}
                          {tool.id === "object-removal" && (
                            <div className="space-y-1.5">
                              <p className="text-xs text-gray-600">1. Upload your image to get started</p>
                              <p className="text-xs text-gray-600">2. Choose your preferred brush size</p>
                              <p className="text-xs text-gray-600">3. Select AI mode for optimal results</p>
                              <p className="text-xs text-gray-600">4. Process and download your clean image</p>
                            </div>
                          )}
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
                <h3 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                  Upgrade to Continue
                </h3>
                <p className="text-gray-600 mb-6">
                  You've used all {FREE_TRIAL_LIMIT} free edits. Upgrade to our premium plan for unlimited access to all tools.
                </p>
                <div className="flex gap-4">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-primary to-primary/80 text-white shadow-md hover:shadow-lg"
                    onClick={() => router.push('/pricing')}
                  >
                    View Pricing
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