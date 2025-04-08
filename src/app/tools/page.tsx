"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Wand2, Palette, Eraser, Upload, Sliders, Download, Share2, ZoomIn, Settings2, Image as ImageIcon, Layers, Crop, Brush, Wand2 as Wand2Icon, Sparkles as SparklesIcon, RefreshCw, Save, History, Crown, Lock, X, Sun, Contrast } from "lucide-react";
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
import { upscaleImage } from '@/utils/imageUpscaler';
import { convertImage } from '@/utils/imageConverter';
import { enhanceImage } from '@/utils/imageEnhancer';

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
    description: "Convert images between different formats (PNG, JPG, JPEG, WebP, GIF, TIFF, AVIF, HEIC) with high quality preservation.",
    icon: <RefreshCw className="h-6 w-6" />,
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-50 to-emerald-50",
    isFree: true
  },
  {
    id: "image-upscaler",
    name: "Image Upscaler",
    description: "Enhance image quality up to 4x with advanced AI upscaling. Features intelligent detail preservation, noise reduction, and blur correction.",
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

// Define a type for the enhancement settings
type EnhancementSettings = {
  brightness: number;
  contrast: number;
  sharpness: number;
  denoise: number;
  saturation: number;
  colorTemperature: number;
  faceEnhancement: boolean;
  backgroundEnhancement: boolean;
  autoEnhance: boolean;
};

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

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState(allTools[0]);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonPosition, setComparisonPosition] = useState(50);
  const [editCount, setEditCount] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
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

  const [toolChanged, setToolChanged] = useState(false);

  const [enhancementSettings, setEnhancementSettings] = useState<EnhancementSettings>({
    brightness: 50,
    contrast: 50,
    sharpness: 50,
    denoise: 0,
    saturation: 50,
    colorTemperature: 0,
    faceEnhancement: false,
    backgroundEnhancement: false,
    autoEnhance: false
  });

  // Preset styles configuration
  const presetStyles: Record<string, EnhancementSettings> = {
    standard: {
      brightness: 50,
      contrast: 50,
      sharpness: 50,
      denoise: 0,
      saturation: 50,
      colorTemperature: 0,
      faceEnhancement: false,
      backgroundEnhancement: false,
      autoEnhance: false
    },
    cool: {
      brightness: 55,
      contrast: 60,
      sharpness: 65,
      denoise: 10,
      saturation: 40,
      colorTemperature: -30,
      faceEnhancement: true,
      backgroundEnhancement: true,
      autoEnhance: false
    },
    warm: {
      brightness: 55,
      contrast: 60,
      sharpness: 65,
      denoise: 10,
      saturation: 60,
      colorTemperature: 30,
      faceEnhancement: true,
      backgroundEnhancement: true,
      autoEnhance: false
    },
    vibrant: {
      brightness: 60,
      contrast: 70,
      sharpness: 75,
      denoise: 15,
      saturation: 80,
      colorTemperature: 0,
      faceEnhancement: true,
      backgroundEnhancement: true,
      autoEnhance: false
    },
    richContrast: {
      brightness: 45,
      contrast: 80,
      sharpness: 70,
      denoise: 20,
      saturation: 40,
      colorTemperature: 0,
      faceEnhancement: true,
      backgroundEnhancement: true,
      autoEnhance: false
    },
    cinematic: {
      brightness: 40,
      contrast: 75,
      sharpness: 60,
      denoise: 25,
      saturation: 30,
      colorTemperature: -20,
      faceEnhancement: true,
      backgroundEnhancement: true,
      autoEnhance: false
    }
  };

  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isApplyingPreset, setIsApplyingPreset] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // Function to apply preset style
  const applyPresetStyle = (style: keyof typeof presetStyles) => {
    if (presetStyles[style]) {
      setIsApplyingPreset(true);
      
      setEnhancementSettings(presetStyles[style]);
      
      // Update UI elements to reflect the new settings
      const elements = {
        brightness: document.querySelector('[data-value="brightness"]') as HTMLInputElement,
        contrast: document.querySelector('[data-value="contrast"]') as HTMLInputElement,
        sharpness: document.querySelector('[data-value="sharpness"]') as HTMLInputElement,
        denoise: document.querySelector('[data-value="denoise"]') as HTMLInputElement,
        saturation: document.querySelector('[data-value="saturation"]') as HTMLInputElement,
        colorTemperature: document.querySelector('[data-value="colorTemperature"]') as HTMLInputElement,
        faceEnhancement: document.querySelector('[data-value="faceEnhancement"]') as HTMLInputElement,
        backgroundEnhancement: document.querySelector('[data-value="backgroundEnhancement"]') as HTMLInputElement,
        autoEnhance: document.querySelector('[data-value="autoEnhance"]') as HTMLInputElement
      };
      
      // Update slider values and their display
      if (elements.brightness) {
        elements.brightness.value = presetStyles[style].brightness.toString();
        const nextElement = elements.brightness.nextElementSibling;
        if (nextElement) {
          nextElement.textContent = presetStyles[style].brightness.toString();
        }
      }
      
      if (elements.contrast) {
        elements.contrast.value = presetStyles[style].contrast.toString();
        const nextElement = elements.contrast.nextElementSibling;
        if (nextElement) {
          nextElement.textContent = presetStyles[style].contrast.toString();
        }
      }
      
      if (elements.sharpness) {
        elements.sharpness.value = presetStyles[style].sharpness.toString();
        const nextElement = elements.sharpness.nextElementSibling;
        if (nextElement) {
          nextElement.textContent = presetStyles[style].sharpness.toString();
        }
      }
      
      if (elements.denoise) {
        elements.denoise.value = presetStyles[style].denoise.toString();
        const nextElement = elements.denoise.nextElementSibling;
        if (nextElement) {
          nextElement.textContent = presetStyles[style].denoise.toString();
        }
      }
      
      if (elements.saturation) {
        elements.saturation.value = presetStyles[style].saturation.toString();
        const nextElement = elements.saturation.nextElementSibling;
        if (nextElement) {
          nextElement.textContent = presetStyles[style].saturation.toString();
        }
      }
      
      if (elements.colorTemperature) {
        elements.colorTemperature.value = presetStyles[style].colorTemperature.toString();
        const nextElement = elements.colorTemperature.nextElementSibling;
        if (nextElement) {
          nextElement.textContent = presetStyles[style].colorTemperature.toString();
        }
      }
      
      // Update switches
      if (elements.faceEnhancement) {
        elements.faceEnhancement.checked = presetStyles[style].faceEnhancement;
      }
      
      if (elements.backgroundEnhancement) {
        elements.backgroundEnhancement.checked = presetStyles[style].backgroundEnhancement;
      }
      
      if (elements.autoEnhance) {
        elements.autoEnhance.checked = presetStyles[style].autoEnhance;
      }
      
      // Apply the changes with a slight delay to ensure UI updates first
      setTimeout(() => {
        applyEnhancementChanges();
        
        // Show success notification only when complete
        toast.success(`${style} style applied`, {
          description: "The preset style has been applied successfully.",
        });
        
        setIsApplyingPreset(false);
      }, 100);
    }
  };

  // Function to apply enhancement changes in real-time with debouncing
  const applyEnhancementChanges = async () => {
    if (!selectedImage) return;
    
    // Clear any existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    // Set a new timer to debounce the enhancement process
    const timer = setTimeout(async () => {
      try {
        setIsEnhancing(true);
        
        // Get current values from UI
        const brightnessElement = document.querySelector('[data-value="brightness"]') as HTMLInputElement;
        const contrastElement = document.querySelector('[data-value="contrast"]') as HTMLInputElement;
        const sharpnessElement = document.querySelector('[data-value="sharpness"]') as HTMLInputElement;
        const denoiseElement = document.querySelector('[data-value="denoise"]') as HTMLInputElement;
        const saturationElement = document.querySelector('[data-value="saturation"]') as HTMLInputElement;
        const colorTemperatureElement = document.querySelector('[data-value="colorTemperature"]') as HTMLInputElement;
        const faceEnhancementElement = document.querySelector('[data-value="faceEnhancement"]') as HTMLInputElement;
        const backgroundEnhancementElement = document.querySelector('[data-value="backgroundEnhancement"]') as HTMLInputElement;
        const autoEnhanceElement = document.querySelector('[data-value="autoEnhance"]') as HTMLInputElement;
        
        const brightness = brightnessElement?.value || "50";
        const contrast = contrastElement?.value || "50";
        const sharpness = sharpnessElement?.value || "50";
        const denoise = denoiseElement?.value || "0";
        const saturation = saturationElement?.value || "50";
        const colorTemperature = colorTemperatureElement?.value || "0";
        const faceEnhancement = faceEnhancementElement?.checked || false;
        const backgroundEnhancement = backgroundEnhancementElement?.checked || false;
        const autoEnhance = autoEnhanceElement?.checked || false;
        
        // Update state
        setEnhancementSettings({
          brightness: parseInt(brightness),
          contrast: parseInt(contrast),
          sharpness: parseInt(sharpness),
          denoise: parseInt(denoise),
          saturation: parseInt(saturation),
          colorTemperature: parseInt(colorTemperature),
          faceEnhancement,
          backgroundEnhancement,
          autoEnhance
        });
        
        // Convert base64 to blob
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        
        // Create a File object from the blob
        const file = new File([blob], "image.png", { type: "image/png" });
        
        // Process image client-side
        const enhancedImage = await enhanceImage(file, {
          brightness: parseInt(brightness),
          contrast: parseInt(contrast),
          sharpness: parseInt(sharpness),
          denoise: parseInt(denoise),
          saturation: parseInt(saturation),
          colorTemperature: parseInt(colorTemperature),
          faceEnhancement,
          backgroundEnhancement,
          autoEnhance
        });
        
        // Update the processed image
        setProcessedImage(enhancedImage);
        
        // Show success notification only when complete
        toast.success("Enhancement Applied", {
          description: "Image enhancement has been applied successfully.",
        });
      } catch (error) {
        console.error('Error applying enhancement changes:', error);
        toast.error("Enhancement Failed", {
          description: "Failed to apply image enhancement. Please try again.",
        });
      } finally {
        setIsEnhancing(false);
      }
    }, 300); // 300ms debounce time
    
    setDebounceTimer(timer);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setToolChanged(false);
        
        // If the selected tool is image enhancement, apply the initial settings
        if (selectedTool.id === "image-enhancement") {
          // We need to wait for the state to update before applying enhancements
          setTimeout(() => {
            applyEnhancementChanges();
          }, 100);
        }
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
        setSelectedImage(reader.result as string);
        setToolChanged(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleProcessImage = async (value: string) => {
    if (!selectedImage || !value) return;
    
    setIsProcessing(true);
    setError(null);
    setProcessedImage(null);

    try {
      if (value === 'background-removal') {
        try {
          const apiKey = process.env.NEXT_PUBLIC_REMOVE_BG_API_KEY;
          if (!apiKey) {
            throw new Error('Remove.bg API key is missing. Using fallback method.');
          }

        // Convert base64 to blob
          const base64Data = selectedImage.split(',')[1];
          const byteCharacters = atob(base64Data);
          const byteArrays = [];
          
          for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);
            
            for (let i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
            }
            
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
          }
          
          const blob = new Blob(byteArrays, { type: 'image/png' });
          const file = new File([blob], 'image.png', { type: 'image/png' });

          const formData = new FormData();
          formData.append('image_file', file);
          formData.append('size', 'auto');
          
          const response = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: {
              'X-Api-Key': apiKey,
            },
            body: formData,
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 402 && errorData.errors?.[0]?.code === 'insufficient_credits') {
              toast.info("API Credits Exhausted", {
                description: "Remove.bg API credits have been exhausted. Using fallback method.",
              });
              throw new Error('Remove.bg API credits have been exhausted. Using fallback method.');
            }
            throw new Error(`API error: ${response.status} ${JSON.stringify(errorData)}`);
          }

          const responseBlob = await response.blob();
          const url = URL.createObjectURL(responseBlob);
          setProcessedImage(url);
        } catch (error) {
          console.error('Error with remove.bg API:', error);
          // Fallback to local processing
          const img = new window.Image();
          img.src = URL.createObjectURL(new Blob([selectedImage], { type: 'image/png' }));
          await new Promise<void>((resolve) => {
            img.onload = () => resolve();
          });
          
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Could not get canvas context');
          
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // Simple background removal based on color similarity
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Check if pixel is close to white or light gray
            if (r > 240 && g > 240 && b > 240) {
              data[i + 3] = 0; // Set alpha to 0 (transparent)
            }
          }
          
          ctx.putImageData(imageData, 0, 0);
          const url = canvas.toDataURL('image/png');
          setProcessedImage(url);
          
          // Show a toast notification about using the fallback method
          toast.info("Using Fallback Method", {
            description: "The background removal was performed using a local fallback method.",
          });
        }
      } else if (value === 'image-conversion') {
        // ... rest of the existing code ...
      } else if (value === 'image-upscaler') {
        // Get the scale factor from the UI
        const scaleFactorElement = document.querySelector('[data-tool="image-upscaler"][data-value="scaleFactor"]') as HTMLSelectElement;
        const scaleFactor = scaleFactorElement?.value || "2x";
        
        // Convert base64 to blob
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        
        // Create form data
        const formData = new FormData();
        formData.append('image', blob, 'image.png');
        formData.append('scaleFactor', scaleFactor);
        formData.append('quality', 'high');
        
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
        
        // Update processed image
        setProcessedImage(result.processedImage);
        
        // Show success notification
        toast.success("Image Upscaled", {
          description: "Your image has been successfully upscaled.",
        });
      } else if (value === 'image-enhancement') {
        // ... rest of the existing code ...
      }
    } catch (error) {
      console.error('Error processing image:', error);
      setError && setError('Failed to process image. Please try again.');
      toast.error("Error", {
        description: "Failed to process image. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;
    
    // Get the output format from the UI if it's the image converter
    let fileExtension = 'png';
    if (selectedTool.id === "image-converter") {
      const outputFormatElement = document.querySelector('[data-value="outputFormat"]') as HTMLSelectElement;
      const outputFormat = outputFormatElement?.value || "png";
      
      // Map the output format to the correct file extension
      switch (outputFormat) {
        case 'jpg':
        case 'jpeg':
          fileExtension = 'jpg';
          break;
        case 'webp':
          fileExtension = 'webp';
          break;
        case 'gif':
          fileExtension = 'gif';
          break;
        case 'tiff':
          fileExtension = 'tiff';
          break;
        case 'avif':
          fileExtension = 'avif';
          break;
        case 'heic':
          fileExtension = 'heic';
          break;
        default:
          fileExtension = 'png';
      }
    }
    
    // Create a temporary link to download the image
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `processed-${Date.now()}.${fileExtension}`;
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
    
    // Clean up after a short delay to ensure the download starts
    setTimeout(() => {
    document.body.removeChild(link);
    }, 100);
  };

  const handleBackgroundChange = async (type: string) => {
    setBackgroundState(type);
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

  // Add this function to handle the slider interaction
  const handleSliderMove = (e: MouseEvent) => {
    if (!showComparison) return;
    
    const container = document.querySelector('.comparison-container');
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const position = ((e.clientX - rect.left) / rect.width) * 100;
    
    // Clamp the position between 0 and 100
    const clampedPosition = Math.max(0, Math.min(100, position));
    setComparisonPosition(clampedPosition);
  };
  
  const handleSliderMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    document.addEventListener('mousemove', handleSliderMove);
    document.addEventListener('mouseup', handleSliderMouseUp);
  };
  
  const handleSliderMouseUp = () => {
    document.removeEventListener('mousemove', handleSliderMove);
    document.removeEventListener('mouseup', handleSliderMouseUp);
  };
  
  // Add touch event handlers for mobile responsiveness
  const handleSliderTouchMove = (e: TouchEvent) => {
    if (!showComparison) return;
    
    const container = document.querySelector('.comparison-container');
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const touch = e.touches[0];
    const position = ((touch.clientX - rect.left) / rect.width) * 100;
    
    // Clamp the position between 0 and 100
    const clampedPosition = Math.max(0, Math.min(100, position));
    setComparisonPosition(clampedPosition);
  };
  
  const handleSliderTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    document.addEventListener('touchmove', handleSliderTouchMove, { passive: false });
    document.addEventListener('touchend', handleSliderTouchEnd);
  };
  
  const handleSliderTouchEnd = () => {
    document.removeEventListener('touchmove', handleSliderTouchMove);
    document.removeEventListener('touchend', handleSliderTouchEnd);
  };
  
  // Clean up event listeners when component unmounts
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleSliderMove);
      document.removeEventListener('mouseup', handleSliderMouseUp);
      document.removeEventListener('touchmove', handleSliderTouchMove);
      document.removeEventListener('touchend', handleSliderTouchEnd);
    };
  }, []);

  const handleToolSelect = (tool: string) => {
    const previousTool = selectedTool;
    setSelectedTool(allTools.find(t => t.id === tool) || allTools[0]);
    
    // Only reset if we're actually changing tools
    if (previousTool.id !== tool) {
      // Reset image preview when switching tools
      setSelectedImage(null);
      setProcessedImage(null);
      setComparisonPosition(50);
      setShowComparison(false);
      setIsProcessing(false);
      setToolChanged(true);
      
      // Reset the file input reference
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Show a toast notification to inform the user
      toast.info("Tool changed", {
        description: "Please upload a new image to use this tool.",
      });
    }
  };

  // Function to add to history
  const addToHistory = (item: any) => {
    // Implementation for adding to history
    console.log("Added to history:", item);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-50/50 to-white">
      <main className="flex-1">
        <div className="container min-h-[calc(100vh-8rem)] py-4 sm:py-8">
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
            <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] lg:sticky lg:top-4">
              <Card 
                className={`h-full flex items-center justify-center border-2 border-dashed border-gray-200 hover:border-primary/50 transition-all duration-300 ${showComparison ? 'cursor-default' : 'cursor-pointer'} bg-white shadow-sm hover:shadow-md`}
                onClick={(e) => {
                  if (!showComparison) {
                    fileInputRef.current?.click();
                  }
                }}
                onDrop={(e) => {
                  if (!showComparison) {
                    handleDrop(e);
                  }
                }}
                onDragOver={(e) => {
                  if (!showComparison) {
                    handleDragOver(e);
                  }
                }}
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
                      style={{ backgroundColor: backgroundState === "transparent" ? "transparent" : backgroundColor }}
                    />
                    <Image
                      src={processedImage}
                      alt="Processed Result"
                      fill
                      className="object-cover rounded-lg transition-all duration-300"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {/* Only show action buttons when not in comparison mode */}
                    {!showComparison && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 rounded-lg">
                      {selectedTool.id === "image-enhancement" ? (
                      <Button
                        variant="secondary"
                        className="bg-white text-gray-900 hover:bg-white/90"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent event bubbling
                            setProcessedImage(null);
                            setSelectedImage(null);
                            setShowComparison(false);
                            // Reset the file input reference
                            if (fileInputRef.current) {
                              fileInputRef.current.value = '';
                            }
                          }}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload New Image
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="secondary"
                            className="bg-white text-gray-900 hover:bg-white/90"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent event bubbling
                              handleDownload();
                            }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                            Download Image
                      </Button>
                      <Button
                        variant="secondary"
                        className="bg-white text-gray-900 hover:bg-white/90"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent event bubbling
                          setProcessedImage(null);
                              setSelectedImage(null);
                              setShowComparison(false);
                              // Reset the file input reference
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                        }}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload New Image
                      </Button>
                        </>
                      )}
                    </div>
                    )}
                    
                    {/* Show format info for image converter */}
                    {selectedTool.id === "image-converter" && !showComparison && (
                      <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                        {(() => {
                          const outputFormatElement = document.querySelector('[data-value="outputFormat"]') as HTMLSelectElement;
                          const outputFormat = outputFormatElement?.value || "png";
                          return `Converted to ${outputFormat.toUpperCase()}`;
                        })()}
                  </div>
                    )}
                  </div>
                ) : selectedImage ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={selectedImage}
                      alt="Preview"
                      fill
                      className="object-cover rounded-lg transition-all duration-300"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {isProcessing && (
                      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80 backdrop-blur-lg flex items-center justify-center rounded-lg">
                        <div className="text-center p-8 max-w-sm relative">
                          {/* Main content */}
                          <div className="relative">
                            {/* Animated icon */}
                            <div className="relative w-20 h-20 mx-auto mb-6">
                              <div className="absolute inset-0 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                                  <RefreshCw className="h-6 w-6 text-white animate-spin" />
                                </div>
                              </div>
                            </div>
                            
                            {/* Text content */}
                            <h3 className="text-white text-xl font-semibold mb-3">
                              Processing your image
                            </h3>
                            <p className="text-white/70 text-sm mb-6">
                              Our AI is working its magic
                            </p>
                            
                            {/* Progress bar */}
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full w-1/3 bg-gradient-to-r from-primary/80 via-primary to-primary/80 rounded-full animate-shimmer"></div>
                            </div>
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
                      {toolChanged 
                        ? "Upload a new image to use this tool" 
                        : "Drag and drop your image here, or click to upload"}
                    </p>
                    {toolChanged && (
                      <p className="mt-1 text-xs text-primary">
                        Tool changed - new image required
                      </p>
                    )}
                  </div>
                )}
              </Card>

              {/* Comparison Slider - Only show when we have both images */}
              {showComparison && selectedImage && processedImage && selectedTool.id !== "image-converter" && selectedTool.id !== "background-removal" && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="relative w-full h-full comparison-container">
                    {/* Original Image (Left side) */}
                    <div className="absolute inset-0 overflow-hidden rounded-lg">
                      <div className="absolute inset-0" style={{ width: `${comparisonPosition}%` }}>
                        <Image
                          src={selectedImage}
                          alt="Original"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    
                    {/* Processed Image (Right side) */}
                    <div className="absolute inset-0 overflow-hidden rounded-lg">
                      <div 
                        className="absolute inset-0" 
                        style={{ 
                          width: `${100 - comparisonPosition}%`,
                          left: `${comparisonPosition}%`
                        }}
                      >
                        <Image
                          src={processedImage}
                          alt="Processed"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    
                    {/* Slider Control */}
                    <div 
                      className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize pointer-events-auto"
                      style={{ left: `${comparisonPosition}%` }}
                    >
                      <div 
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center"
                        onMouseDown={handleSliderMouseDown}
                        onTouchStart={handleSliderTouchStart}
                      >
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <div className="w-4 h-4 rounded-full bg-white" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Labels that move with the slider */}
                    <div 
                      className="absolute top-4 bg-black/50 text-white px-2 py-1 rounded text-xs"
                      style={{ 
                        left: '16px', 
                        opacity: comparisonPosition > 10 ? 1 : 0,
                        transform: 'none'
                      }}
                    >
                      Original
                    </div>
                    <div 
                      className="absolute top-4 bg-black/50 text-white px-2 py-1 rounded text-xs"
                      style={{ 
                        right: '16px', 
                        opacity: comparisonPosition < 90 ? 1 : 0,
                        transform: 'none'
                      }}
                    >
                      {selectedTool.id === "image-upscaler" ? "Upscaled" : "Processed"}
                    </div>
                  </div>
                </div>
              )}

              {/* Comparison Toggle Button - Only show when we have both images and not for image converter */}
              {processedImage && selectedImage && selectedTool.id !== "image-converter" && selectedTool.id !== "background-removal" && (
                <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 z-10">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-8 px-2 rounded-full shadow-sm ${showComparison ? 'bg-primary text-white' : 'bg-white/90 backdrop-blur-sm'}`}
                    onClick={() => setShowComparison(!showComparison)}
                  >
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-gray-400" />
                      <div className="w-3 h-3 rounded-full bg-primary" />
                    </div>
                  </Button>
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
            <div className="space-y-3 sm:space-y-4 mt-6 sm:mt-0">
              <Tabs defaultValue={tools[0].id} className="w-full" onValueChange={(value) => {
                handleToolSelect(value);
              }}>
                <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-0 h-auto sm:h-12 bg-muted/50 p-2 sm:p-1 rounded-xl">
                  {tools.map((tool) => (
                    <TabsTrigger
                      key={tool.id}
                      value={tool.id}
                      className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:py-2 sm:data-[state=active]:py-1.5 transition-all"
                    >
                      <span className="text-[10px] sm:text-xs font-medium text-center">{tool.name}</span>
                      {tool.isLocked && (
                        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center">
                          <Lock className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-gray-400" />
                        </div>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {tools.map((tool) => (
                  <TabsContent key={tool.id} value={tool.id} className="mt-3 sm:mt-4">
                    <Card className="p-3 sm:p-4 bg-white/80 backdrop-blur-sm border-0 shadow-sm rounded-xl">
                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className={`p-1.5 sm:p-2 rounded-xl bg-gradient-to-r ${tool.gradient} text-white shadow-md`}>
                            {tool.icon}
                          </div>
                          <div>
                            <h3 className="text-sm sm:text-base font-semibold text-gray-900">{tool.name}</h3>
                            <p className="text-[10px] sm:text-sm text-gray-600 mt-0.5">{tool.description}</p>
                          </div>
                        </div>
                        
                        {/* Tool Settings */}
                        <div className="space-y-2 sm:space-y-3">
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
                                  <Crop className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs font-medium text-gray-700">Auto Crop</span>
                                </div>
                                <Switch className="h-4 w-7" />
                              </div>
                            </>
                          )}

                          {tool.id === "image-converter" && (
                            <>
                              <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md hover:bg-gray-100 transition-colors" data-tool="image-converter">
                                <div className="flex items-center gap-2">
                                  <Settings2 className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs font-medium text-gray-700">Output Format</span>
                                </div>
                                <Select defaultValue="png" data-value="outputFormat">
                                  <SelectTrigger className="h-7 w-[120px] text-xs">
                                    <SelectValue placeholder="PNG" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="png">PNG</SelectItem>
                                    <SelectItem value="jpg">JPG</SelectItem>
                                    <SelectItem value="jpeg">JPEG</SelectItem>
                                    <SelectItem value="webp">WebP</SelectItem>
                                    <SelectItem value="gif">GIF</SelectItem>
                                    <SelectItem value="tiff">TIFF</SelectItem>
                                    <SelectItem value="avif">AVIF</SelectItem>
                                    <SelectItem value="heic">HEIC</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-2">
                                  <Sliders className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs font-medium text-gray-700">Quality</span>
                                </div>
                                <Select defaultValue="high" data-value="quality">
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
                              <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md hover:bg-gray-100 transition-colors" data-tool="image-upscaler">
                                <div className="flex items-center gap-2">
                                  <ZoomIn className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs font-medium text-gray-700">Scale Factor</span>
                                </div>
                                <Select defaultValue="2x" data-value="scaleFactor">
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
                              <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md hover:bg-gray-100 transition-colors" data-tool="image-upscaler">
                                <div className="flex items-center gap-2">
                                  <Sliders className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs font-medium text-gray-700">Quality</span>
                                </div>
                                <Select defaultValue="high" data-value="quality">
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
                              {/* Loading Overlay - Updated Design */}
                              {isEnhancing && (
                                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center rounded-lg z-50">
                                  <div className="flex flex-col items-center gap-4 bg-white/90 p-6 rounded-2xl shadow-xl border border-gray-100">
                                    <div className="relative">
                                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                      </div>
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                                      </div>
                                    </div>
                                    <div className="text-center">
                                      <span className="text-sm font-medium text-gray-800">Enhancing Image</span>
                                      <p className="text-xs text-gray-500 mt-1">Applying your adjustments...</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {/* Processing Overlay - Updated Design */}
                              {isProcessing && (
                                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center rounded-lg z-50">
                                  <div className="flex flex-col items-center gap-4 bg-white/90 p-6 rounded-2xl shadow-xl border border-gray-100">
                                    <div className="relative">
                                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                      </div>
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <RefreshCw className="h-5 w-5 text-primary animate-spin" />
                                      </div>
                                    </div>
                                    <div className="text-center">
                                      <span className="text-sm font-medium text-gray-800">Processing Image</span>
                                      <p className="text-xs text-gray-500 mt-1">Applying final adjustments...</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {/* Preset Styles Section - Updated Design */}
                              <div className="mb-6 bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-gray-100 shadow-sm relative">
                                {isApplyingPreset && (
                                  <div className="absolute inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center rounded-xl z-10">
                                    <div className="flex flex-col items-center gap-3 bg-white/90 p-4 rounded-xl shadow-lg border border-gray-100">
                                      <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                          <div className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                                        </div>
                                      </div>
                                      <div className="text-center">
                                        <span className="text-sm font-medium text-gray-800">Applying Preset</span>
                                        <p className="text-xs text-gray-500 mt-1">Please wait...</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                <h3 className="text-sm font-medium mb-3 text-gray-800 flex items-center">
                                  <Sparkles className="h-4 w-4 mr-2 text-primary" />
                                  Preset Styles
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                  <button 
                                    className="p-2.5 text-xs rounded-lg border border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center"
                                    onClick={() => applyPresetStyle('standard')}
                                  >
                                    <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                                    Standard
                                  </button>
                                  <button 
                                    className="p-2.5 text-xs rounded-lg border border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center"
                                    onClick={() => applyPresetStyle('cool')}
                                  >
                                    <div className="w-3 h-3 rounded-full bg-blue-300 mr-2"></div>
                                    Cool Style
                                  </button>
                                  <button 
                                    className="p-2.5 text-xs rounded-lg border border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center"
                                    onClick={() => applyPresetStyle('warm')}
                                  >
                                    <div className="w-3 h-3 rounded-full bg-orange-300 mr-2"></div>
                                    Warm Style
                                  </button>
                                  <button 
                                    className="p-2.5 text-xs rounded-lg border border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center"
                                    onClick={() => applyPresetStyle('vibrant')}
                                  >
                                    <div className="w-3 h-3 rounded-full bg-purple-300 mr-2"></div>
                                    Vibrant Style
                                  </button>
                                  <button 
                                    className="p-2.5 text-xs rounded-lg border border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center"
                                    onClick={() => applyPresetStyle('richContrast')}
                                  >
                                    <div className="w-3 h-3 rounded-full bg-gray-800 mr-2"></div>
                                    Rich Contrast
                                  </button>
                                  <button 
                                    className="p-2.5 text-xs rounded-lg border border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center"
                                    onClick={() => applyPresetStyle('cinematic')}
                                  >
                                    <div className="w-3 h-3 rounded-full bg-indigo-300 mr-2"></div>
                                    Cinematic
                                  </button>
                                </div>
                              </div>

                              {/* Enhancement Controls */}
                              <div className="space-y-4 bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-gray-100 shadow-sm">
                                <h3 className="text-sm font-medium mb-3 text-gray-800 flex items-center">
                                  <Sliders className="h-4 w-4 mr-2 text-primary" />
                                  Adjustment Controls
                                </h3>
                                
                                <div className="space-y-4">
                                  <div className="flex flex-col space-y-1">
                                    <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                        <Sun className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs font-medium text-gray-700">Brightness</span>
                                </div>
                                      <span className="text-xs text-gray-500 w-6 text-center brightness-value">50</span>
                                </div>
                                    <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                      <div 
                                        className="absolute h-full bg-primary/30 rounded-full"
                                        style={{ width: '50%' }}
                                      ></div>
                                      <input 
                                        type="range" 
                                        min="0" 
                                        max="100" 
                                        defaultValue="50" 
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        data-value="brightness"
                                        onInput={(e) => {
                                          const value = (e.target as HTMLInputElement).value;
                                          document.querySelector('.brightness-value')!.textContent = value;
                                          (e.target as HTMLInputElement).parentElement?.querySelector('div')?.style.setProperty('width', `${value}%`);
                                        }}
                                        onChange={(e) => {
                                          applyEnhancementChanges();
                                        }}
                                      />
                              </div>
                                  </div>

                                  <div className="flex flex-col space-y-1">
                                    <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                        <Contrast className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs font-medium text-gray-700">Contrast</span>
                                </div>
                                      <span className="text-xs text-gray-500 w-6 text-center contrast-value">50</span>
                                </div>
                                    <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                      <div 
                                        className="absolute h-full bg-primary/30 rounded-full"
                                        style={{ width: '50%' }}
                                      ></div>
                                      <input 
                                        type="range" 
                                        min="0" 
                                        max="100" 
                                        defaultValue="50" 
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        data-value="contrast"
                                        onInput={(e) => {
                                          const value = (e.target as HTMLInputElement).value;
                                          document.querySelector('.contrast-value')!.textContent = value;
                                          (e.target as HTMLInputElement).parentElement?.querySelector('div')?.style.setProperty('width', `${value}%`);
                                        }}
                                        onChange={(e) => {
                                          applyEnhancementChanges();
                                        }}
                                      />
                              </div>
                                  </div>

                                  <div className="flex flex-col space-y-1">
                                    <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                        <Sparkles className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs font-medium text-gray-700">Sharpness</span>
                                </div>
                                      <span className="text-xs text-gray-500 w-6 text-center sharpness-value">50</span>
                                    </div>
                                    <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                      <div 
                                        className="absolute h-full bg-primary/30 rounded-full"
                                        style={{ width: '50%' }}
                                      ></div>
                                      <input 
                                        type="range" 
                                        min="0" 
                                        max="100" 
                                        defaultValue="50" 
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        data-value="sharpness"
                                        onInput={(e) => {
                                          const value = (e.target as HTMLInputElement).value;
                                          document.querySelector('.sharpness-value')!.textContent = value;
                                          (e.target as HTMLInputElement).parentElement?.querySelector('div')?.style.setProperty('width', `${value}%`);
                                        }}
                                        onChange={(e) => {
                                          applyEnhancementChanges();
                                        }}
                                      />
                                    </div>
                                  </div>

                                  <div className="flex flex-col space-y-1">
                                    <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                        <Brush className="h-4 w-4 text-gray-500" />
                                        <span className="text-xs font-medium text-gray-700">Denoise</span>
                                      </div>
                                      <span className="text-xs text-gray-500 w-6 text-center denoise-value">0</span>
                                    </div>
                                    <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                      <div 
                                        className="absolute h-full bg-primary/30 rounded-full"
                                        style={{ width: '0%' }}
                                      ></div>
                                      <input 
                                        type="range" 
                                        min="0" 
                                        max="100" 
                                        defaultValue="0" 
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        data-value="denoise"
                                        onInput={(e) => {
                                          const value = (e.target as HTMLInputElement).value;
                                          document.querySelector('.denoise-value')!.textContent = value;
                                          (e.target as HTMLInputElement).parentElement?.querySelector('div')?.style.setProperty('width', `${value}%`);
                                        }}
                                        onChange={(e) => {
                                          applyEnhancementChanges();
                                        }}
                                      />
                                    </div>
                                  </div>

                                  <div className="flex flex-col space-y-1">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <Palette className="h-4 w-4 text-gray-500" />
                                        <span className="text-xs font-medium text-gray-700">Saturation</span>
                                      </div>
                                      <span className="text-xs text-gray-500 w-6 text-center saturation-value">50</span>
                                    </div>
                                    <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                      <div 
                                        className="absolute h-full bg-primary/30 rounded-full"
                                        style={{ width: '50%' }}
                                      ></div>
                                      <input 
                                        type="range" 
                                        min="0" 
                                        max="100" 
                                        defaultValue="50" 
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        data-value="saturation"
                                        onInput={(e) => {
                                          const value = (e.target as HTMLInputElement).value;
                                          document.querySelector('.saturation-value')!.textContent = value;
                                          (e.target as HTMLInputElement).parentElement?.querySelector('div')?.style.setProperty('width', `${value}%`);
                                        }}
                                        onChange={(e) => {
                                          applyEnhancementChanges();
                                        }}
                                      />
                                    </div>
                                  </div>

                                  <div className="flex flex-col space-y-1">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <Sun className="h-4 w-4 text-gray-500" />
                                        <span className="text-xs font-medium text-gray-700">Color Temperature</span>
                                      </div>
                                      <span className="text-xs text-gray-500 w-6 text-center temperature-value">0</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="flex flex-col items-center">
                                        <div className="w-4 h-4 rounded-full bg-blue-300 mb-1"></div>
                                        <span className="text-xs text-gray-500">Cool</span>
                                      </div>
                                      <div className="relative flex-1 h-2 bg-gradient-to-r from-blue-300 via-white to-orange-300 rounded-full overflow-hidden">
                                        <div 
                                          className="absolute h-full bg-primary/30 rounded-full"
                                          style={{ width: '50%', left: '0%' }}
                                        ></div>
                                        <input 
                                          type="range" 
                                          min="-100" 
                                          max="100" 
                                          defaultValue="0" 
                                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                          data-value="colorTemperature"
                                          onInput={(e) => {
                                            const value = (e.target as HTMLInputElement).value;
                                            document.querySelector('.temperature-value')!.textContent = value;
                                            const percentage = (parseInt(value) + 100) / 2;
                                            (e.target as HTMLInputElement).parentElement?.querySelector('div')?.style.setProperty('width', `${percentage}%`);
                                            (e.target as HTMLInputElement).parentElement?.querySelector('div')?.style.setProperty('left', `${50 - percentage/2}%`);
                                          }}
                                          onChange={(e) => {
                                            applyEnhancementChanges();
                                          }}
                                        />
                                      </div>
                                      <div className="flex flex-col items-center">
                                        <div className="w-4 h-4 rounded-full bg-orange-300 mb-1"></div>
                                        <span className="text-xs text-gray-500">Warm</span>
                                      </div>
                                    </div>
                                    <div className="text-[10px] text-gray-500 text-center mt-1">
                                      Adjust the color temperature to make your image appear cooler (blue) or warmer (orange)
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Tool-specific Instructions */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <ImageIcon className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-gray-500" />
                            <h4 className="text-[10px] sm:text-xs font-medium text-gray-700">Quick Guide</h4>
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
                              <p className="text-xs text-gray-600">2. Choose scale factor (1.5x to 4x)</p>
                              <p className="text-xs text-gray-600">3. Select quality level for optimal results</p>
                              <p className="text-xs text-gray-600">4. AI will enhance details and reduce noise</p>
                              <p className="text-xs text-gray-600">5. Download your high-resolution image</p>
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
                          {tool.id === "image-enhancement" ? (
                          <Button 
                              className={`w-auto bg-gradient-to-r ${tool.gradient} hover:opacity-90 text-white shadow-md hover:shadow-lg transition-all duration-200 text-xs sm:text-sm py-1.5`}
                              onClick={handleDownload}
                              disabled={!processedImage || isProcessing || tool.isLocked}
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
                                  <Download className="h-4 w-4" />
                                  <span>Download Image</span>
                                </div>
                              )}
                            </Button>
                          ) : (
                            <Button 
                              onClick={() => handleProcessImage(tool.id)}
                              disabled={isProcessing || !selectedImage || tool.isLocked}
                              className={`w-full sm:w-auto ${
                                isProcessing
                                  ? "bg-gradient-to-r from-primary/90 to-primary/80 text-white"
                                  : ""
                              }`}
                            >
                              {isProcessing ? (
                                <div className="flex items-center gap-2">
                                  <RefreshCw className="h-4 w-4 animate-spin" />
                                  <span>Processing...</span>
                                </div>
                              ) : (
                                "Process Image"
                              )}
                            </Button>
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