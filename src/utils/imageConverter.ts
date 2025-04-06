/**
 * Client-side image converter utility
 * Converts images between different formats using browser APIs
 */

export interface ConvertOptions {
  outputFormat: 'png' | 'jpg' | 'jpeg' | 'webp' | 'gif' | 'tiff' | 'avif' | 'heic';
  quality: 'low' | 'medium' | 'high';
}

/**
 * Converts an image to the specified format
 * @param imageFile The image file to convert
 * @param options Conversion options
 * @returns Promise that resolves to the converted image as a base64 string
 */
export async function convertImage(
  imageFile: File,
  options: ConvertOptions
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Create a new image element
      const img = new Image();
      
      // Create a canvas element
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      // Set up image load handler
      img.onload = () => {
        // Set canvas dimensions to match the image
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the image on the canvas
        ctx.drawImage(img, 0, 0);
        
        // Convert quality to a number (0-1)
        const qualityValue = options.quality === 'high' ? 0.9 : 
                            options.quality === 'medium' ? 0.7 : 0.5;
        
        // Convert to the specified format
        let mimeType: string;
        switch (options.outputFormat) {
          case 'png':
            mimeType = 'image/png';
            break;
          case 'jpg':
          case 'jpeg':
            mimeType = 'image/jpeg';
            break;
          case 'webp':
            mimeType = 'image/webp';
            break;
          case 'gif':
            mimeType = 'image/gif';
            break;
          case 'tiff':
            mimeType = 'image/tiff';
            break;
          case 'avif':
            mimeType = 'image/avif';
            break;
          case 'heic':
            // HEIC is not widely supported in browsers, fallback to JPEG
            mimeType = 'image/jpeg';
            break;
          default:
            mimeType = 'image/png';
        }
        
        // Convert canvas to data URL
        const dataUrl = canvas.toDataURL(mimeType, qualityValue);
        resolve(dataUrl);
      };
      
      // Set up error handler
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      // Load the image from the file
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = () => {
        reject(new Error('Failed to read image file'));
      };
      reader.readAsDataURL(imageFile);
    } catch (error) {
      reject(error);
    }
  });
} 