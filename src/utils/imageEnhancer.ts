/**
 * Client-side image enhancement utility
 * Enhances images with various adjustments using browser APIs
 */

export interface EnhanceOptions {
  brightness: number; // 0-100
  contrast: number; // 0-100
  sharpness: number; // 0-100
  denoise: number; // 0-100
  saturation: number; // 0-100
  colorTemperature: number; // -100 to 100 (cool to warm)
  faceEnhancement: boolean;
  backgroundEnhancement: boolean;
  autoEnhance: boolean;
}

/**
 * Enhances an image with the specified options
 * @param file The image file to enhance
 * @param options Enhancement options
 * @returns Promise that resolves to the enhanced image as a base64 string
 */
export async function enhanceImage(
  file: File,
  options: EnhanceOptions
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        // Create canvas with the image dimensions
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Draw the original image
        ctx.drawImage(img, 0, 0);
        
        // Get image data for manipulation
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Apply auto-enhancement first if enabled
        if (options.autoEnhance) {
          applyAutoEnhancement(data, canvas.width, canvas.height);
        }
        
        // Apply basic adjustments
        if (options.brightness !== 50) {
          applyBrightness(data, options.brightness);
        }
        
        if (options.contrast !== 50) {
          applyContrast(data, options.contrast);
        }
        
        if (options.saturation !== 50) {
          applySaturation(data, options.saturation);
        }
        
        if (options.colorTemperature !== 0) {
          applyColorTemperature(data, options.colorTemperature);
        }
        
        // Apply advanced adjustments
        if (options.denoise > 0) {
          applyDenoising(data, canvas.width, canvas.height, options.denoise);
        }
        
        if (options.sharpness !== 50) {
          applySharpening(data, canvas.width, canvas.height, options.sharpness);
        }
        
        // Apply AI-based enhancements
        if (options.faceEnhancement) {
          applySkinEnhancement(data, canvas.width, canvas.height);
        }
        
        if (options.backgroundEnhancement) {
          applyBackgroundEnhancement(data, canvas.width, canvas.height);
        }
        
        // Put the enhanced image data back on the canvas
        ctx.putImageData(imageData, 0, 0);
        
        // Convert to base64 and resolve
        resolve(canvas.toDataURL('image/jpeg', 0.95));
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    // Load the image from the file
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Applies auto-enhancement to the image data
 */
function applyAutoEnhancement(data: Uint8ClampedArray, width: number, height: number): void {
  // Calculate histogram
  const histogram = new Array(256).fill(0);
  for (let i = 0; i < data.length; i += 4) {
    const brightness = Math.round((data[i] + data[i + 1] + data[i + 2]) / 3);
    histogram[brightness]++;
  }
  
  // Find the darkest and brightest non-zero values
  let minBrightness = 0;
  let maxBrightness = 255;
  
  for (let i = 0; i < 256; i++) {
    if (histogram[i] > 0) {
      minBrightness = i;
      break;
    }
  }
  
  for (let i = 255; i >= 0; i--) {
    if (histogram[i] > 0) {
      maxBrightness = i;
      break;
    }
  }
  
  // Apply levels adjustment
  const range = maxBrightness - minBrightness;
  if (range > 0) {
    for (let i = 0; i < data.length; i += 4) {
      // Red channel
      data[i] = Math.min(255, Math.max(0, ((data[i] - minBrightness) / range) * 255));
      // Green channel
      data[i + 1] = Math.min(255, Math.max(0, ((data[i + 1] - minBrightness) / range) * 255));
      // Blue channel
      data[i + 2] = Math.min(255, Math.max(0, ((data[i + 2] - minBrightness) / range) * 255));
    }
  }
}

/**
 * Applies brightness adjustment to the image data
 */
function applyBrightness(data: Uint8ClampedArray, brightness: number): void {
  // Convert brightness from 0-100 scale to -1 to 1
  const factor = (brightness - 50) / 50;
  
  // Apply brightness with a more natural curve
  for (let i = 0; i < data.length; i += 4) {
    // Red channel
    data[i] = Math.min(255, Math.max(0, data[i] + (factor * 30)));
    // Green channel
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + (factor * 30)));
    // Blue channel
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + (factor * 30)));
  }
}

/**
 * Applies contrast adjustment to the image data
 */
function applyContrast(data: Uint8ClampedArray, contrast: number): void {
  // Convert contrast from 0-100 scale to 0.5 to 1.5
  const factor = 0.5 + (contrast / 100);
  
  // Apply contrast with a more natural curve
  for (let i = 0; i < data.length; i += 4) {
    // Red channel
    data[i] = Math.min(255, Math.max(0, ((data[i] - 128) * factor) + 128));
    // Green channel
    data[i + 1] = Math.min(255, Math.max(0, ((data[i + 1] - 128) * factor) + 128));
    // Blue channel
    data[i + 2] = Math.min(255, Math.max(0, ((data[i + 2] - 128) * factor) + 128));
  }
}

/**
 * Applies saturation adjustment to the image data
 */
function applySaturation(data: Uint8ClampedArray, saturation: number): void {
  // Convert saturation from 0-100 scale to 0 to 2
  const factor = saturation / 50;
  
  for (let i = 0; i < data.length; i += 4) {
    // Calculate luminance
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    
    // Apply saturation with a more natural curve
    const adjustedFactor = 0.8 + (factor * 0.2); // Limit maximum saturation boost
    
    // Red channel
    data[i] = Math.min(255, Math.max(0, luminance + (r - luminance) * adjustedFactor));
    // Green channel
    data[i + 1] = Math.min(255, Math.max(0, luminance + (g - luminance) * adjustedFactor));
    // Blue channel
    data[i + 2] = Math.min(255, Math.max(0, luminance + (b - luminance) * adjustedFactor));
  }
}

/**
 * Applies color temperature adjustment to the image data
 */
function applyColorTemperature(data: Uint8ClampedArray, temperature: number): void {
  // Convert temperature from -100 to 100 scale to -0.3 to 0.3
  const factor = temperature / 333;
  
  for (let i = 0; i < data.length; i += 4) {
    // Red channel (warm)
    data[i] = Math.min(255, Math.max(0, data[i] + (factor * 30)));
    // Blue channel (cool)
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] - (factor * 30)));
  }
}

/**
 * Applies denoising to the image data
 */
function applyDenoising(data: Uint8ClampedArray, width: number, height: number, strength: number): void {
  // Create a copy of the original data
  const originalData = new Uint8ClampedArray(data);
  
  // Convert strength from 0-100 scale to 1-5
  const radius = Math.max(1, Math.floor(strength / 20));
  
  // Apply median filter with adaptive strength
  for (let y = radius; y < height - radius; y++) {
    for (let x = radius; x < width - radius; x++) {
      const idx = (y * width + x) * 4;
      
      // Collect neighboring pixels for each channel
      const redValues: number[] = [];
      const greenValues: number[] = [];
      const blueValues: number[] = [];
      
      for (let ky = -radius; ky <= radius; ky++) {
        for (let kx = -radius; kx <= radius; kx++) {
          const neighborIdx = ((y + ky) * width + (x + kx)) * 4;
          redValues.push(originalData[neighborIdx]);
          greenValues.push(originalData[neighborIdx + 1]);
          blueValues.push(originalData[neighborIdx + 2]);
        }
      }
      
      // Sort and get median values
      redValues.sort((a, b) => a - b);
      greenValues.sort((a, b) => a - b);
      blueValues.sort((a, b) => a - b);
      
      const medianIdx = Math.floor(redValues.length / 2);
      
      // Apply median values with a blend factor based on strength
      const blendFactor = Math.min(0.8, strength / 100);
      
      data[idx] = data[idx] * (1 - blendFactor) + redValues[medianIdx] * blendFactor;
      data[idx + 1] = data[idx + 1] * (1 - blendFactor) + greenValues[medianIdx] * blendFactor;
      data[idx + 2] = data[idx + 2] * (1 - blendFactor) + blueValues[medianIdx] * blendFactor;
    }
  }
}

/**
 * Applies sharpening to the image data
 */
function applySharpening(data: Uint8ClampedArray, width: number, height: number, sharpness: number): void {
  // Create a copy of the original data
  const originalData = new Uint8ClampedArray(data);
  
  // Convert sharpness from 0-100 scale to 0.5 to 2.0
  const factor = 0.5 + (sharpness / 100) * 1.5;
  
  // Apply unsharp mask algorithm
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      
      // Calculate the difference between the center pixel and the average of its neighbors
      const centerR = originalData[idx];
      const centerG = originalData[idx + 1];
      const centerB = originalData[idx + 2];
      
      // Get neighboring pixels
      const topIdx = ((y - 1) * width + x) * 4;
      const bottomIdx = ((y + 1) * width + x) * 4;
      const leftIdx = (y * width + (x - 1)) * 4;
      const rightIdx = (y * width + (x + 1)) * 4;
      
      // Calculate average of neighbors
      const avgR = (originalData[topIdx] + originalData[bottomIdx] + originalData[leftIdx] + originalData[rightIdx]) / 4;
      const avgG = (originalData[topIdx + 1] + originalData[bottomIdx + 1] + originalData[leftIdx + 1] + originalData[rightIdx + 1]) / 4;
      const avgB = (originalData[topIdx + 2] + originalData[bottomIdx + 2] + originalData[leftIdx + 2] + originalData[rightIdx + 2]) / 4;
      
      // Apply sharpening with a more natural curve
      const adjustedFactor = Math.min(1.5, factor * 0.75); // Limit maximum sharpening
      
      // Red channel
      data[idx] = Math.min(255, Math.max(0, centerR + (centerR - avgR) * adjustedFactor));
      // Green channel
      data[idx + 1] = Math.min(255, Math.max(0, centerG + (centerG - avgG) * adjustedFactor));
      // Blue channel
      data[idx + 2] = Math.min(255, Math.max(0, centerB + (centerB - avgB) * adjustedFactor));
    }
  }
}

/**
 * Applies skin enhancement to the image data
 * This is a simplified version that enhances skin tones
 */
function applySkinEnhancement(data: Uint8ClampedArray, width: number, height: number): void {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Detect skin tones using a more sophisticated approach
    // Skin tones typically have higher red values and moderate green/blue values
    const isSkinTone = 
      r > 95 && g > 40 && b > 20 && 
      r > g && r > b && 
      Math.abs(r - g) > 15 && 
      r - g > 15 && r - b > 15;
    
    if (isSkinTone) {
      // Apply subtle smoothing and color adjustment for skin tones
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      
      // Increase red slightly, decrease blue slightly for warmer skin tones
      data[i] = Math.min(255, r + 5);
      data[i + 1] = g;
      data[i + 2] = Math.max(0, b - 5);
      
      // Apply subtle smoothing by averaging with neighboring pixels
      if (i > width * 4 && i < data.length - width * 4) {
        const aboveIdx = i - width * 4;
        const belowIdx = i + width * 4;
        
        // Average with pixels above and below
        data[i] = (data[i] + data[aboveIdx] + data[belowIdx]) / 3;
        data[i + 1] = (data[i + 1] + data[aboveIdx + 1] + data[belowIdx + 1]) / 3;
        data[i + 2] = (data[i + 2] + data[aboveIdx + 2] + data[belowIdx + 2]) / 3;
      }
    }
  }
}

/**
 * Applies background enhancement to the image data
 * This is a simplified version that slightly blurs the background
 */
function applyBackgroundEnhancement(data: Uint8ClampedArray, width: number, height: number): void {
  // Create a copy of the original data
  const originalData = new Uint8ClampedArray(data);
  
  // Apply a subtle denoising effect to the background
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      
      // Skip potential skin tones (background is typically not skin)
      const r = originalData[idx];
      const g = originalData[idx + 1];
      const b = originalData[idx + 2];
      
      const isSkinTone = 
        r > 95 && g > 40 && b > 20 && 
        r > g && r > b && 
        Math.abs(r - g) > 15 && 
        r - g > 15 && r - b > 15;
      
      if (!isSkinTone) {
        // Apply a subtle blur to the background
        const topIdx = ((y - 1) * width + x) * 4;
        const bottomIdx = ((y + 1) * width + x) * 4;
        const leftIdx = (y * width + (x - 1)) * 4;
        const rightIdx = (y * width + (x + 1)) * 4;
        
        // Average with neighboring pixels
        data[idx] = (originalData[idx] + originalData[topIdx] + originalData[bottomIdx] + originalData[leftIdx] + originalData[rightIdx]) / 5;
        data[idx + 1] = (originalData[idx + 1] + originalData[topIdx + 1] + originalData[bottomIdx + 1] + originalData[leftIdx + 1] + originalData[rightIdx + 1]) / 5;
        data[idx + 2] = (originalData[idx + 2] + originalData[topIdx + 2] + originalData[bottomIdx + 2] + originalData[leftIdx + 2] + originalData[rightIdx + 2]) / 5;
      }
    }
  }
} 