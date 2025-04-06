import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as Blob;
    const outputFormat = formData.get('outputFormat') as string || 'png';
    const quality = formData.get('quality') as string || 'high';

    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Convert quality to number
    const qualityValue = quality === 'high' ? 90 : quality === 'medium' ? 80 : 70;

    // Convert blob to buffer
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Get image metadata
    const metadata = await sharp(buffer).metadata();
    const originalFormat = metadata.format || 'unknown';
    const originalWidth = metadata.width || 0;
    const originalHeight = metadata.height || 0;

    // Process image with Sharp based on output format
    let processedBuffer;
    
    console.log(`Converting image to format: ${outputFormat}`);
    
    if (outputFormat === 'png') {
      processedBuffer = await sharp(buffer)
        .png({ quality: qualityValue })
        .toBuffer();
    } else if (outputFormat === 'jpeg' || outputFormat === 'jpg') {
      processedBuffer = await sharp(buffer)
        .jpeg({ quality: qualityValue })
        .toBuffer();
    } else if (outputFormat === 'webp') {
      processedBuffer = await sharp(buffer)
        .webp({ quality: qualityValue })
        .toBuffer();
    } else if (outputFormat === 'gif') {
      processedBuffer = await sharp(buffer)
        .gif()
        .toBuffer();
    } else if (outputFormat === 'tiff') {
      processedBuffer = await sharp(buffer)
        .tiff({ quality: qualityValue })
        .toBuffer();
    } else if (outputFormat === 'avif') {
      processedBuffer = await sharp(buffer)
        .avif({ quality: qualityValue })
        .toBuffer();
    } else if (outputFormat === 'heic') {
      processedBuffer = await sharp(buffer)
        .heif({ quality: qualityValue })
        .toBuffer();
    } else {
      console.error(`Unsupported output format: ${outputFormat}`);
      return NextResponse.json(
        { error: 'Unsupported output format' },
        { status: 400 }
      );
    }
    
    console.log(`Successfully converted image to ${outputFormat}`);

    // Get processed image metadata
    const processedMetadata = await sharp(processedBuffer).metadata();
    const processedWidth = processedMetadata.width || 0;
    const processedHeight = processedMetadata.height || 0;
    const processedSize = processedBuffer.length;

    // Convert to base64 with proper MIME type
    let mimeType = outputFormat;
    if (outputFormat === 'jpg') {
      mimeType = 'jpeg';
    } else if (outputFormat === 'heic') {
      mimeType = 'heif';
    }
    
    const base64Image = `data:image/${mimeType};base64,${processedBuffer.toString('base64')}`;

    return NextResponse.json({ 
      processedImage: base64Image,
      metadata: {
        originalFormat,
        originalWidth,
        originalHeight,
        outputFormat,
        processedWidth,
        processedHeight,
        processedSize
      }
    });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
} 