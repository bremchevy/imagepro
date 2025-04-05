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

    // Apply advanced upscaling with optimal settings
    sharpInstance = sharpInstance
      .resize(newWidth, newHeight, {
        fit: 'fill',
        withoutEnlargement: false,
        kernel: 'lanczos3', // High-quality algorithm for upscaling
        position: 'center'
      })
      // Apply adaptive sharpening based on scale factor
      .sharpen({
        sigma: scale > 3 ? 1.2 : 0.8, // More sharpening for higher scale factors
        m1: scale > 3 ? 1.2 : 1.0,    // Larger radius for higher scale factors
        m2: scale > 3 ? 0.7 : 0.8     // Lower threshold for higher scale factors
      });

    // Apply format-specific processing with optimal settings
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

    return NextResponse.json({ processedImage: base64Image });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
} 