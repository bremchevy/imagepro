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

    // Process image with Sharp based on output format
    let processedBuffer;
    
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
    } else {
      return NextResponse.json(
        { error: 'Unsupported output format' },
        { status: 400 }
      );
    }

    // Convert to base64
    const base64Image = `data:image/${outputFormat};base64,${processedBuffer.toString('base64')}`;

    return NextResponse.json({ processedImage: base64Image });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
} 