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
    
    // Calculate new dimensions
    const newWidth = Math.round(img.width * options.scaleFactor);
    const newHeight = Math.round(img.height * options.scaleFactor);
    
    // Set canvas dimensions
    canvas.width = newWidth;
    canvas.height = newHeight;
    
    // Draw the image on the canvas with high-quality settings
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, newWidth, newHeight);
    
    // Apply sharpening
    const imageData = ctx.getImageData(0, 0, newWidth, newHeight);
    const data = imageData.data;
    
    // Simple sharpening kernel
    const kernel = [
      [0, -1, 0],
      [-1, 5, -1],
      [0, -1, 0]
    ];
    
    // Apply the kernel
    const tempData = new Uint8ClampedArray(data);
    for (let y = 1; y < newHeight - 1; y++) {
      for (let x = 1; x < newWidth - 1; x++) {
        const idx = (y * newWidth + x) * 4;
        
        for (let c = 0; c < 3; c++) {
          let sum = 0;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const kernelIdx = (ky + 1) * 3 + (kx + 1);
              const pixelIdx = ((y + ky) * newWidth + (x + kx)) * 4 + c;
              sum += tempData[pixelIdx] * kernel[ky + 1][kx + 1];
            }
          }
          data[idx + c] = Math.min(255, Math.max(0, sum));
        }
      }
    }
    
    // Put the processed image data back on the canvas
    ctx.putImageData(imageData, 0, 0);
    
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