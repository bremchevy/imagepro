// No imports needed for browser APIs

export interface UpscaleOptions {
  scaleFactor: number;
  quality: 'low' | 'medium' | 'high';
}

export async function upscaleImage(
  imageFile: File,
  options: UpscaleOptions
): Promise<string> {
  try {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }
    
    // Create an image element
    const img = new Image();
    
    // Create a promise to handle image loading
    const imageLoadPromise = new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load image'));
    });
    
    // Set the image source to the file
    img.src = URL.createObjectURL(imageFile);
    
    // Wait for the image to load
    await imageLoadPromise;
    
    // Get original dimensions
    const originalWidth = img.width;
    const originalHeight = img.height;
    
    // Calculate new dimensions
    const newWidth = Math.round(originalWidth * options.scaleFactor);
    const newHeight = Math.round(originalHeight * options.scaleFactor);
    
    // Set canvas dimensions
    canvas.width = newWidth;
    canvas.height = newHeight;
    
    // Use high-quality image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Draw the image with the new dimensions
    ctx.drawImage(img, 0, 0, newWidth, newHeight);
    
    // Apply image enhancements
    enhanceImage(ctx, newWidth, newHeight);
    
    // Convert canvas to blob with quality settings
    let quality = 0.8; // Default medium quality
    if (options.quality === 'high') {
      quality = 0.95;
    } else if (options.quality === 'low') {
      quality = 0.6;
    }
    
    // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          throw new Error('Failed to create blob from canvas');
        }
      }, 'image/jpeg', quality);
    });
    
    // Convert blob to base64
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read blob'));
    });
    
    reader.readAsDataURL(blob);
    return await base64Promise;
  } catch (error) {
    console.error('Error upscaling image:', error);
    throw new Error('Failed to upscale image');
  }
}

// Combined image enhancement function
function enhanceImage(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  // Get image data
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  // Create a copy for processing
  const tempData = new Uint8ClampedArray(data);
  
  // Apply brightness and contrast
  applyBrightnessAndContrast(data, width, height, 1.15, 1.3);
  
  // Apply sharpening
  applySharpening(data, tempData, width, height);
  
  // Apply color enhancement
  enhanceColors(data, width, height);
  
  // Put the enhanced image data back
  ctx.putImageData(imageData, 0, 0);
}

// Apply brightness and contrast
function applyBrightnessAndContrast(
  data: Uint8ClampedArray, 
  width: number, 
  height: number, 
  brightnessFactor: number, 
  contrastFactor: number
): void {
  for (let i = 0; i < data.length; i += 4) {
    // Apply brightness and contrast to RGB channels
    for (let c = 0; c < 3; c++) {
      // Apply brightness
      let value = data[i + c] * brightnessFactor;
      
      // Apply contrast
      value = ((value - 128) * contrastFactor) + 128;
      
      // Ensure value stays within valid range
      data[i + c] = Math.min(255, Math.max(0, value));
    }
  }
}

// Apply sharpening
function applySharpening(
  data: Uint8ClampedArray, 
  tempData: Uint8ClampedArray, 
  width: number, 
  height: number
): void {
  // Sharpening kernel
  const kernel = [
    [0, -1, 0],
    [-1, 5, -1],
    [0, -1, 0]
  ];
  
  // Apply the kernel
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const pixelIdx = ((y + ky) * width + (x + kx)) * 4 + c;
            sum += tempData[pixelIdx] * kernel[ky + 1][kx + 1];
          }
        }
        data[idx + c] = Math.min(255, Math.max(0, sum));
      }
    }
  }
}

// Enhance colors
function enhanceColors(
  data: Uint8ClampedArray, 
  width: number, 
  height: number
): void {
  // Color enhancement factors
  const saturationFactor = 1.2;  // Increase saturation by 20%
  
  for (let i = 0; i < data.length; i += 4) {
    // Get RGB values
    const r = data[i] / 255;
    const g = data[i + 1] / 255;
    const b = data[i + 2] / 255;
    
    // Calculate luminance
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    
    // Apply saturation enhancement
    const rEnhanced = luminance + (r - luminance) * saturationFactor;
    const gEnhanced = luminance + (g - luminance) * saturationFactor;
    const bEnhanced = luminance + (b - luminance) * saturationFactor;
    
    // Update pixel values
    data[i] = Math.min(255, Math.max(0, Math.round(rEnhanced * 255)));
    data[i + 1] = Math.min(255, Math.max(0, Math.round(gEnhanced * 255)));
    data[i + 2] = Math.min(255, Math.max(0, Math.round(bEnhanced * 255)));
  }
} 