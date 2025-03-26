"use client"

import { useState, useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, ArrowRight, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export default function UpscalePage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [upscaleFactor, setUpscaleFactor] = useState(2)
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      const url = URL.createObjectURL(file)
      
      // Get image dimensions
      const img = new Image()
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height })
      }
      img.src = url

      setSelectedImage(file)
      setPreviewUrl(url)
      setResultUrl(null)
      setError(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1
  })

  const handleUpscale = async () => {
    // Add console.log to debug
    console.log('API Key:', process.env.NEXT_PUBLIC_CLAID_API_KEY)
    
    const apiKey = process.env.NEXT_PUBLIC_CLAID_API_KEY
    if (!apiKey) {
      setError('API key is not configured. Please check your environment variables.')
      return
    }

    if (!selectedImage) {
      setError('Please select an image first')
      return
    }

    setIsProcessing(true)
    setError(null)
    setProgress(0)
    setResultUrl(null) // Clear previous result

    try {
      // Start upload and processing
      setProgress(20)

      // Convert file to base64
      const base64Image = await fileToBase64(selectedImage)
      setProgress(30)

      // Call Claid.ai API
      const response = await fetch('https://api.claid.ai/v1/image/enhance', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: base64Image,
          upscale: {
            enable: true,
            scale: upscaleFactor,
            type: "real-esrgan",
          },
          output: {
            format: selectedImage.type.split('/')[1] || 'jpeg',
            quality: 100,
          }
        })
      })

      setProgress(60)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Error: ${response.statusText}`)
      }

      const result = await response.json()
      setProgress(80)

      if (!result.image) {
        throw new Error('No image data received from the API')
      }

      // Convert the base64 result to a URL
      const upscaledImageUrl = `data:${selectedImage.type};base64,${result.image}`
      
      // Preload the image before showing
      const img = new Image()
      img.onload = () => {
        setResultUrl(upscaledImageUrl)
        setProgress(100)
        setSliderPosition(50) // Reset slider position when new image is loaded
      }
      img.src = upscaledImageUrl
      
    } catch (error) {
      console.error('Error processing image:', error)
      setError(error instanceof Error ? error.message : 'Error processing image. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  // Helper function to convert File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
          resolve(reader.result.split(',')[1])
        } else {
          reject(new Error('Failed to convert file to base64'))
        }
      }
      reader.onerror = error => reject(error)
    })
  }

  const handleSliderMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return
    const container = document.getElementById('image-container')
    if (!container) return

    const rect = container.getBoundingClientRect()
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX
    const position = ((x - rect.left) / rect.width) * 100
    setSliderPosition(Math.min(Math.max(position, 0), 100))
  }, [isDragging])

  const handleDownload = () => {
    if (!resultUrl) return
    const link = document.createElement('a')
    link.href = resultUrl
    link.download = `upscaled-${upscaleFactor}x-${selectedImage?.name || 'image.png'}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Add event listeners for slider dragging
  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false)
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const container = document.getElementById('image-container')
        if (!container) return
        const rect = container.getBoundingClientRect()
        const position = ((e.clientX - rect.left) / rect.width) * 100
        setSliderPosition(Math.min(Math.max(position, 0), 100))
      }
    }

    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isDragging])

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}
      {!selectedImage ? (
        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
            isDragActive 
              ? "border-primary bg-primary/5 scale-[1.02]" 
              : "border-gray-300 hover:border-primary/50 hover:bg-gray-50/50"
          }`}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <Upload className="h-16 w-16 text-gray-400 group-hover:text-primary transition-colors duration-300" />
            <div>
              <h3 className="text-xl font-semibold text-gray-700">
                Drop your image here
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                or click to browse
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Original size</p>
                  <p className="font-medium">{imageDimensions.width} x {imageDimensions.height} px</p>
                </div>
                <ArrowRight className="text-gray-400" />
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Upscaled size</p>
                  <p className="font-medium text-primary">
                    {imageDimensions.width * upscaleFactor} x {imageDimensions.height * upscaleFactor} px
                  </p>
                </div>
              </div>

              <div 
                id="image-container"
                className="relative h-[500px] rounded-lg overflow-hidden border bg-[#f8f8f8]"
                onMouseDown={(e) => {
                  if (resultUrl) {
                    setIsDragging(true)
                    // Update slider position immediately on click
                    const container = e.currentTarget
                    const rect = container.getBoundingClientRect()
                    const position = ((e.clientX - rect.left) / rect.width) * 100
                    setSliderPosition(Math.min(Math.max(position, 0), 100))
                  }
                }}
                onTouchStart={(e) => {
                  if (resultUrl) {
                    setIsDragging(true)
                    // Update slider position immediately on touch
                    const container = e.currentTarget
                    const rect = container.getBoundingClientRect()
                    const position = ((e.touches[0].clientX - rect.left) / rect.width) * 100
                    setSliderPosition(Math.min(Math.max(position, 0), 100))
                  }
                }}
              >
                {previewUrl && (
                  <>
                    <img
                      src={previewUrl}
                      alt="Original"
                      className="absolute inset-0 w-full h-full object-contain bg-gray-50"
                    />
                    {resultUrl && (
                      <div 
                        className="absolute inset-0 w-full h-full"
                        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                      >
                        <img
                          src={resultUrl}
                          alt="Upscaled"
                          className="w-full h-full object-contain bg-gray-50"
                        />
                      </div>
                    )}
                    <div 
                      className="absolute inset-y-0 w-1 bg-white cursor-ew-resize"
                      style={{ left: `${sliderPosition}%` }}
                    >
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                        <div className="w-1 h-4 bg-gray-400 rounded-full" />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Upscale options</h3>
                <div className="flex gap-4">
                  <Button
                    variant={upscaleFactor === 2 ? "default" : "outline"}
                    onClick={() => setUpscaleFactor(2)}
                    className="flex-1 h-12"
                  >
                    2x
                  </Button>
                  <Button
                    variant={upscaleFactor === 4 ? "default" : "outline"}
                    onClick={() => setUpscaleFactor(4)}
                    className="flex-1 h-12"
                  >
                    4x
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                {isProcessing ? (
                  <div className="space-y-2 w-full">
                    <Progress value={progress} className="h-2" />
                    <p className="text-sm text-center text-muted-foreground">
                      Processing... {progress}%
                    </p>
                  </div>
                ) : (
                  <>
                    <Button 
                      className="flex-1 h-12" 
                      onClick={handleUpscale}
                    >
                      Upscale
                    </Button>
                    {resultUrl && (
                      <Button 
                        variant="outline"
                        className="flex-1 h-12"
                        onClick={handleDownload}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 