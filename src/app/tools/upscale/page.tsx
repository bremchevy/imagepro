"use client"

import { useState, useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, RefreshCw, Download, ZoomIn, Settings2, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function UpscalePage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [upscaleFactor, setUpscaleFactor] = useState(2)
  const [quality, setQuality] = useState(90)
  const [showOptions, setShowOptions] = useState(false)
  const [comparisonPosition, setComparisonPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setSelectedImage(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setResultUrl(null)
      setIsProcessing(true)
      setShowOptions(false)
      handleProcess()
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setResultUrl(null)
    }
  }

  const handleReset = () => {
    setSelectedImage(null)
    setPreviewUrl(null)
    setResultUrl(null)
    setProgress(0)
    setShowOptions(false)
  }

  const handleProcess = async () => {
    if (!selectedImage) return

    setIsProcessing(true)
    setProgress(0)

    try {
      // Simulate processing with progress
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i)
        await new Promise(resolve => setTimeout(resolve, 500))
      }

      // For now, just use the original image as the result
      setResultUrl(previewUrl)
      setShowOptions(true)
    } catch (error) {
      console.error('Error processing image:', error)
      alert('Error processing image. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!resultUrl) return
    const link = document.createElement('a')
    link.href = resultUrl
    link.download = 'upscaled-image.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const startDragging = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true)
    document.addEventListener('mousemove', handleDrag)
    document.addEventListener('mouseup', stopDragging)
    document.addEventListener('touchmove', handleDrag)
    document.addEventListener('touchend', stopDragging)
  }

  const handleDrag = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const rect = (e.target as HTMLElement).closest('.relative')?.getBoundingClientRect()
    if (!rect) return
    
    const position = ((clientX - rect.left) / rect.width) * 100
    setComparisonPosition(Math.min(Math.max(position, 0), 100))
  }

  const stopDragging = () => {
    setIsDragging(false)
    document.removeEventListener('mousemove', handleDrag)
    document.removeEventListener('mouseup', stopDragging)
    document.removeEventListener('touchmove', handleDrag)
    document.removeEventListener('touchend', stopDragging)
  }

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleDrag)
      document.removeEventListener('mouseup', stopDragging)
      document.removeEventListener('touchmove', handleDrag)
      document.removeEventListener('touchend', stopDragging)
    }
  }, [])

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Image Upscaling
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Enhance your images with AI-powered upscaling. Increase resolution while maintaining quality.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-2 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-xl">
          <CardHeader className="space-y-2">
            <CardTitle className="flex items-center gap-2 text-2xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              <ZoomIn className="h-7 w-7" />
              Original Image
            </CardTitle>
            <CardDescription className="text-base">
              Upload your image to begin upscaling
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {!selectedImage ? (
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                    isDragActive 
                      ? "border-primary bg-primary/5 scale-[1.02] shadow-lg" 
                      : "border-gray-300 hover:border-primary/50 hover:bg-gray-50/50"
                  }`}
                  {...getRootProps()}
                >
                  <input {...getInputProps()} />
                  <label className="cursor-pointer flex flex-col items-center group">
                    <Upload className="h-14 w-14 text-gray-400 mb-4 group-hover:text-primary transition-colors duration-300" />
                    <p className="text-gray-600 font-medium text-lg group-hover:text-primary transition-colors duration-300">
                      Drag and drop your image here
                    </p>
                    <p className="text-sm text-gray-500 mt-2 group-hover:text-primary/70 transition-colors duration-300">
                      or click to browse
                    </p>
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow duration-300">
                    <img
                      src={previewUrl || ''}
                      alt="Preview"
                      className="w-full h-auto"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    size="lg"
                    className="w-full hover:bg-primary/5 transition-colors duration-300"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Another Image
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-xl">
          <CardHeader className="space-y-2">
            <CardTitle className="flex items-center gap-2 text-2xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              <Settings2 className="h-7 w-7" />
              Upscaled Result
            </CardTitle>
            <CardDescription className="text-base">
              Your upscaled image will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {isProcessing ? (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden border shadow-sm">
                    <div className="aspect-video bg-gray-100 animate-pulse" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-shimmer" />
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-muted-foreground text-center">
                    Upscaling image... {progress}%
                  </p>
                </div>
              ) : resultUrl ? (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow duration-300">
                    <img
                      src={resultUrl}
                      alt="Upscaled"
                      className="w-full h-auto"
                    />
                  </div>
                  {showOptions && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <Label className="text-base">Upscale Factor: {upscaleFactor}x</Label>
                        <Slider
                          value={[upscaleFactor]}
                          onValueChange={(value) => setUpscaleFactor(value[0])}
                          min={2}
                          max={4}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-4">
                        <Label className="text-base">Quality: {quality}%</Label>
                        <Slider
                          value={[quality]}
                          onValueChange={(value) => setQuality(value[0])}
                          min={60}
                          max={100}
                          step={5}
                          className="w-full"
                        />
                      </div>
                      <div className="flex gap-4">
                        <Button
                          onClick={handleProcess}
                          size="lg"
                          className="flex-1"
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Upscale Again
                        </Button>
                        <Button
                          onClick={handleDownload}
                          variant="outline"
                          size="lg"
                          className="flex-1"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] border-2 border-dashed rounded-xl">
                  <Sparkles className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 text-center">
                    Upload an image to start upscaling
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 