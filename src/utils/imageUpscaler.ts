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
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }
    
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(imageFile);
    });
    
    const originalWidth = img.width;
    const originalHeight = img.height;
    const scale = parseFloat(String(options.scaleFactor));
    const newWidth = Math.round(originalWidth * scale);
    const newHeight = Math.round(originalHeight * scale);
    
    // Multi-pass upscaling for better quality
    if (options.quality === 'high' && scale > 2) {
      // First pass: Scale to intermediate size
      const intermediateScale = Math.sqrt(scale);
      const intermediateWidth = Math.round(originalWidth * intermediateScale);
      const intermediateHeight = Math.round(originalHeight * intermediateScale);
      
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = intermediateWidth;
      tempCanvas.height = intermediateHeight;
      const tempCtx = tempCanvas.getContext('2d')!;
      
      // First pass with high-quality settings
      tempCtx.imageSmoothingEnabled = true;
      tempCtx.imageSmoothingQuality = 'high';
      tempCtx.drawImage(img, 0, 0, intermediateWidth, intermediateHeight);
      
      // Apply initial enhancements
      const tempImageData = tempCtx.getImageData(0, 0, intermediateWidth, intermediateHeight);
      applyEnhancements(tempImageData.data, intermediateWidth, intermediateHeight, 1.2);
      tempCtx.putImageData(tempImageData, 0, 0);
      
      // Second pass: Scale to final size
      canvas.width = newWidth;
      canvas.height = newHeight;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(tempCanvas, 0, 0, newWidth, newHeight);
      
      // Apply final enhancements
      const imageData = ctx.getImageData(0, 0, newWidth, newHeight);
      applyEnhancements(imageData.data, newWidth, newHeight, 1.5);
      ctx.putImageData(imageData, 0, 0);
    } else {
      // Single-pass upscaling
      canvas.width = newWidth;
      canvas.height = newHeight;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = options.quality === 'low' ? 'low' : 'high';
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      
      // Apply enhancements based on quality
      const imageData = ctx.getImageData(0, 0, newWidth, newHeight);
      const intensity = options.quality === 'high' ? 1.3 : options.quality === 'medium' ? 1.1 : 0.9;
      applyEnhancements(imageData.data, newWidth, newHeight, intensity);
      ctx.putImageData(imageData, 0, 0);
    }
    
    // Convert to output format with quality settings
    const quality = options.quality === 'high' ? 0.95 : options.quality === 'medium' ? 0.85 : 0.75;
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b!), 'image/jpeg', quality);
    });
    
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error upscaling image:', error);
    throw new Error('Failed to upscale image');
  }
}

function applyEnhancements(data: Uint8ClampedArray, width: number, height: number, intensity: number): void {
  // Create a copy for processing
  const tempData = new Uint8ClampedArray(data);
  
  // Apply sharpening with enhanced kernel
  const kernel = [
    [-0.1 * intensity, -0.2 * intensity, -0.1 * intensity],
    [-0.2 * intensity, 1 + 1.2 * intensity, -0.2 * intensity],
    [-0.1 * intensity, -0.2 * intensity, -0.1 * intensity]
  ];
  
  // Apply kernel and enhancements
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      
      for (let c = 0; c < 3; c++) {
        // Apply sharpening kernel
        let sum = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const sourceIdx = ((y + ky) * width + (x + kx)) * 4 + c;
            sum += tempData[sourceIdx] * kernel[ky + 1][kx + 1];
          }
        }
        
        // Apply local contrast enhancement
        const center = tempData[idx + c];
        const min = Math.min(
          tempData[((y - 1) * width + x) * 4 + c],
          tempData[((y + 1) * width + x) * 4 + c],
          tempData[(y * width + x - 1) * 4 + c],
          tempData[(y * width + x + 1) * 4 + c],
          center
        );
        const max = Math.max(
          tempData[((y - 1) * width + x) * 4 + c],
          tempData[((y + 1) * width + x) * 4 + c],
          tempData[(y * width + x - 1) * 4 + c],
          tempData[(y * width + x + 1) * 4 + c],
          center
        );
        
        if (max > min) {
          const localContrast = (center - min) / (max - min);
          sum = sum * (1 + localContrast * 0.2 * intensity);
        }
        
        // Apply color enhancement
        const saturationBoost = 1 + 0.2 * intensity;
        const luminance = (tempData[idx] * 0.299 + tempData[idx + 1] * 0.587 + tempData[idx + 2] * 0.114) / 255;
        sum = sum * (1 - luminance) * saturationBoost + sum * luminance;
        
        // Store result
        data[idx + c] = Math.min(255, Math.max(0, sum));
      }
    }
  }
} 