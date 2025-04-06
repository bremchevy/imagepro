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

    // Step 1: Initial Noise Reduction and Preparation
    sharpInstance = sharpInstance
      .modulate({
        brightness: 1.02,
        saturation: 1.05
      })
      .convolve({
        width: 3,
        height: 3,
        kernel: [
          0.0625, 0.125, 0.0625,
          0.125,  0.25,  0.125,
          0.0625, 0.125, 0.0625
        ]
      });

    // Step 2: Enhanced Blur Detection and Analysis
    const blurAnalysis = await analyzeBlur(sharpInstance);
    const isBlurry = blurAnalysis.isBlurry;
    const blurType = blurAnalysis.blurType;

    // Step 3: Advanced Deblurring and Detail Recovery
    if (isBlurry) {
      if (blurType === 'motion') {
        sharpInstance = sharpInstance
          .convolve({
            width: 3,
            height: 3,
            kernel: [
              -1.8, 0, 1.8,
              -2.8, 0, 2.8,
              -1.8, 0, 1.8
            ]
          })
          .sharpen({
            sigma: 2.2,
            m1: 2.2,
            m2: 0.9
          });
      } else if (blurType === 'outOfFocus') {
        sharpInstance = sharpInstance
          .sharpen({
            sigma: 2.2,
            m1: 2.2,
            m2: 0.9
          })
          .convolve({
            width: 5,
            height: 5,
            kernel: [
              -0.1, -0.1, -0.1, -0.1, -0.1,
              -0.1,  0.2,  0.2,  0.2, -0.1,
              -0.1,  0.2,  0.8,  0.2, -0.1,
              -0.1,  0.2,  0.2,  0.2, -0.1,
              -0.1, -0.1, -0.1, -0.1, -0.1
            ]
          });
      } else {
        sharpInstance = sharpInstance
          .sharpen({
            sigma: 2.0,
            m1: 1.8,
            m2: 0.9
          })
          .convolve({
            width: 3,
            height: 3,
            kernel: [
              -0.5, -0.5, -0.5,
              -0.5,  5.0, -0.5,
              -0.5, -0.5, -0.5
            ]
          });
      }
    }

    // Step 4: Enhanced Detail Preservation
    sharpInstance = sharpInstance
      .modulate({
        brightness: 1.08,
        saturation: 1.12
      })
      .convolve({
        width: 3,
        height: 3,
        kernel: [
          -0.7, -0.7, -0.7,
          -0.7,  6.0, -0.7,
          -0.7, -0.7, -0.7
        ]
      });

    // Step 5: Progressive Upscaling with Enhanced Steps
    const steps = calculateProgressiveSteps(originalWidth, originalHeight, newWidth, newHeight);
    
    for (const step of steps) {
      sharpInstance = sharpInstance
        .resize(step.width, step.height, {
          fit: 'fill',
          withoutEnlargement: false,
          kernel: 'lanczos3',
          position: 'center'
        })
        .sharpen({
          sigma: 1.4,
          m1: 1.2,
          m2: 0.9
        })
        .convolve({
          width: 3,
          height: 3,
          kernel: [
            0.95, 1.0, 0.95,
            1.0, 1.1, 1.0,
            0.95, 1.0, 0.95
          ]
        });
    }

    // Step 6: Advanced Detail Enhancement
    sharpInstance = sharpInstance
      .convolve({
        width: 5,
        height: 5,
        kernel: [
          0.04, 0.08, 0.12, 0.08, 0.04,
          0.08, 0.16, 0.20, 0.16, 0.08,
          0.12, 0.20, 0.24, 0.20, 0.12,
          0.08, 0.16, 0.20, 0.16, 0.08,
          0.04, 0.08, 0.12, 0.08, 0.04
        ]
      })
      .modulate({
        brightness: 1.06,
        saturation: 1.08
      })
      .convolve({
        width: 3,
        height: 3,
        kernel: [
          0, -1.0, 0,
          -1.0, 5.0, -1.0,
          0, -1.0, 0
        ]
      });

    // Step 7: Final Enhancement and Quality Optimization
    sharpInstance = sharpInstance
      .sharpen({
        sigma: scale > 3 ? 1.8 : scale > 2 ? 1.4 : 1.2,
        m1: scale > 3 ? 1.4 : scale > 2 ? 1.2 : 1.0,
        m2: scale > 3 ? 1.0 : scale > 2 ? 1.1 : 1.2
      })
      .convolve({
        width: 3,
        height: 3,
        kernel: [
          0.92, 1.0, 0.92,
          1.0, 1.2, 1.0,
          0.92, 1.0, 0.92
        ]
      });

    // Step 8: Format-specific processing with enhanced settings
    if (format === 'jpeg' || format === 'jpg') {
      sharpInstance = sharpInstance.jpeg({ 
        quality: Math.min(qualityValue + 5, 100),
        mozjpeg: true,
        chromaSubsampling: '4:4:4',
        optimizeCoding: true,
        trellisQuantisation: true,
        overshootDeringing: true
      });
    } else if (format === 'png') {
      sharpInstance = sharpInstance.png({ 
        quality: Math.min(qualityValue + 5, 100),
        compressionLevel: 8,
        palette: false,
        effort: 10
      });
    } else if (format === 'webp') {
      sharpInstance = sharpInstance.webp({ 
        quality: Math.min(qualityValue + 5, 100),
        effort: 6,
        lossless: qualityValue > 80,
        nearLossless: true
      });
    } else {
      sharpInstance = sharpInstance.jpeg({ 
        quality: Math.min(qualityValue + 5, 100),
        mozjpeg: true,
        chromaSubsampling: '4:4:4',
        optimizeCoding: true,
        trellisQuantisation: true,
        overshootDeringing: true
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

// Helper function to calculate progressive upscaling steps
function calculateProgressiveSteps(
  originalWidth: number, 
  originalHeight: number, 
  targetWidth: number, 
  targetHeight: number
): Array<{ width: number, height: number }> {
  const steps: Array<{ width: number, height: number }> = [];
  
  // Calculate the total scale factor
  const scaleFactor = targetWidth / originalWidth;
  
  // For small scale factors (1.5x or less), just do one step
  if (scaleFactor <= 1.5) {
    steps.push({ width: targetWidth, height: targetHeight });
    return steps;
  }
  
  // For medium scale factors (2x-3x), use 2 steps
  if (scaleFactor <= 3) {
    const midWidth = Math.round(originalWidth * 1.5);
    const midHeight = Math.round(originalHeight * 1.5);
    
    steps.push({ width: midWidth, height: midHeight });
    steps.push({ width: targetWidth, height: targetHeight });
    return steps;
  }
  
  // For large scale factors (3x+), use 3 steps
  const step1Width = Math.round(originalWidth * 1.5);
  const step1Height = Math.round(originalHeight * 1.5);
  
  const step2Width = Math.round(step1Width * 1.5);
  const step2Height = Math.round(step1Height * 1.5);
  
  steps.push({ width: step1Width, height: step1Height });
  steps.push({ width: step2Width, height: step2Height });
  steps.push({ width: targetWidth, height: targetHeight });
  
  return steps;
} 