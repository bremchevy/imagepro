import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as Blob;
    const scaleFactor = formData.get('scaleFactor');
    const quality = formData.get('quality');

    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Convert scale factor to number
    const scale = parseFloat(scaleFactor as string) || 2;

    // Convert quality to number (default to 80)
    const qualityValue = quality === 'high' ? 90 : quality === 'medium' ? 80 : 70;

    // Convert blob to buffer
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Get original image metadata
    const metadata = await sharp(buffer).metadata();
    const { width: originalWidth, height: originalHeight, format } = metadata;

    if (!originalWidth || !originalHeight) {
      return NextResponse.json(
        { error: 'Could not determine image dimensions' },
        { status: 400 }
      );
    }

    // Calculate new dimensions
    const newWidth = Math.round(originalWidth * scale);
    const newHeight = Math.round(originalHeight * scale);

    // Create a Sharp instance
    let sharpInstance = sharp(buffer);

    // Step 1: Blur Detection and Analysis
    // We'll use a simple approach to detect if the image might be blurry
    // by analyzing the image's frequency content
    const blurAnalysis = await analyzeBlur(sharpInstance);
    const isBlurry = blurAnalysis.isBlurry;
    const blurType = blurAnalysis.blurType;

    // Step 2: Initial Processing - Apply appropriate deblurring based on blur type
    if (isBlurry) {
      if (blurType === 'motion') {
        // For motion blur, apply directional sharpening
        sharpInstance = sharpInstance
          .convolve({
            width: 3,
            height: 3,
            kernel: [
              -0.5, 0, 0.5,
              -1, 0, 1,
              -0.5, 0, 0.5
            ]
          });
      } else if (blurType === 'outOfFocus') {
        // For out-of-focus blur, apply a more aggressive sharpening
        sharpInstance = sharpInstance
          .sharpen({
            sigma: 1.2,
            m1: 1.2,
            m2: 0.7
          });
      } else {
        // For general blur, apply standard sharpening
        sharpInstance = sharpInstance
          .sharpen({
            sigma: 0.8,
            m1: 0.8,
            m2: 0.8
          });
      }
    }

    // Step 3: Detail Enhancement
    // Apply techniques to recover and enhance details
    sharpInstance = sharpInstance
      // Enhance local contrast
      .modulate({
        brightness: 1.03,
        saturation: 1.05
      })
      // Apply a subtle edge enhancement
      .convolve({
        width: 3,
        height: 3,
        kernel: [
          -0.3, -0.3, -0.3,
          -0.3,  3.4, -0.3,
          -0.3, -0.3, -0.3
        ]
      });

    // Step 4: Smart Upscaling
    // Use a high-quality upscaling algorithm
    sharpInstance = sharpInstance
      .resize(newWidth, newHeight, {
        fit: 'fill',
        withoutEnlargement: false,
        kernel: 'lanczos3', // High-quality algorithm for upscaling
        position: 'center'
      });

    // Step 5: Post-Upscaling Enhancement
    // Apply final enhancements after upscaling
    sharpInstance = sharpInstance
      // Apply adaptive sharpening based on scale factor
      .sharpen({
        sigma: scale > 3 ? 0.7 : scale > 2 ? 0.5 : 0.3,
        m1: scale > 3 ? 0.7 : scale > 2 ? 0.5 : 0.3,
        m2: scale > 3 ? 0.8 : scale > 2 ? 0.9 : 1.0
      });

    // Step 6: Format-specific processing with optimal settings
    if (format === 'jpeg' || format === 'jpg') {
      sharpInstance = sharpInstance.jpeg({ 
        quality: qualityValue,
        mozjpeg: true, // Use mozjpeg for better compression
        chromaSubsampling: '4:4:4', // Better color quality
        optimizeCoding: true, // Optimize Huffman coding
        trellisQuantisation: true // Better compression
      });
    } else if (format === 'png') {
      sharpInstance = sharpInstance.png({ 
        quality: qualityValue,
        compressionLevel: 9, // Maximum compression
        palette: false, // Don't use palette mode
        effort: 10 // Maximum effort for compression
      });
    } else if (format === 'webp') {
      sharpInstance = sharpInstance.webp({ 
        quality: qualityValue,
        effort: 6, // Higher effort for better compression
        lossless: false, // Use lossy compression for better file size
        nearLossless: qualityValue > 85 // Use near-lossless for high quality
      });
    } else {
      // Default to high-quality JPEG for other formats
      sharpInstance = sharpInstance.jpeg({ 
        quality: qualityValue,
        mozjpeg: true,
        chromaSubsampling: '4:4:4',
        optimizeCoding: true,
        trellisQuantisation: true
      });
    }

    // Process image
    const processedBuffer = await sharpInstance.toBuffer();

    // Determine the correct MIME type
    const mimeType = format === 'png' ? 'image/png' : 
                    format === 'webp' ? 'image/webp' : 
                    'image/jpeg';

    // Convert to base64 with correct MIME type
    const base64Image = `data:${mimeType};base64,${processedBuffer.toString('base64')}`;

    return NextResponse.json({ 
      processedImage: base64Image,
      isBlurry: isBlurry,
      blurType: blurType
    });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}

// Helper function to analyze if an image is blurry
async function analyzeBlur(sharpInstance: sharp.Sharp): Promise<{ isBlurry: boolean, blurType: 'motion' | 'outOfFocus' | 'general' | 'none' }> {
  try {
    // Create a copy of the sharp instance to avoid modifying the original
    const analysisInstance = sharpInstance.clone();
    
    // Get image statistics
    const stats = await analysisInstance.stats();
    
    // Calculate the variance of the Laplacian (a measure of image sharpness)
    // This is a simplified approach - in a real implementation, you'd use more sophisticated methods
    const channels = stats.channels;
    const laplacianVariance = channels.reduce((sum, channel) => {
      // Calculate variance of each channel
      const mean = channel.mean;
      const variance = channel.stdev * channel.stdev;
      return sum + variance;
    }, 0) / channels.length;
    
    // Determine if the image is blurry based on the Laplacian variance
    // Lower values indicate more blur
    const isBlurry = laplacianVariance < 500; // This threshold would need tuning
    
    // Determine blur type based on image characteristics
    // This is a simplified approach - in a real implementation, you'd use more sophisticated methods
    let blurType: 'motion' | 'outOfFocus' | 'general' | 'none' = 'none';
    
    if (isBlurry) {
      // Check for motion blur by analyzing directional patterns
      // This is a simplified approach
      const hasDirectionalPattern = channels.some(channel => {
        // Check if there's a significant difference between horizontal and vertical gradients
        // This would be more sophisticated in a real implementation
        return Math.abs(channel.mean - channel.stdev) > 50;
      });
      
      if (hasDirectionalPattern) {
        blurType = 'motion';
      } else {
        // Check for out-of-focus blur by analyzing frequency content
        // This is a simplified approach
        const hasLowFrequencyContent = laplacianVariance < 300;
        
        if (hasLowFrequencyContent) {
          blurType = 'outOfFocus';
        } else {
          blurType = 'general';
        }
      }
    }
    
    return { isBlurry, blurType };
  } catch (error) {
    console.error('Error analyzing blur:', error);
    // Default to not blurry if analysis fails
    return { isBlurry: false, blurType: 'none' };
  }
} 