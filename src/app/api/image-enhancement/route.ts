import { NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const brightness = parseInt(formData.get('brightness') as string);
    const contrast = parseInt(formData.get('contrast') as string);
    const sharpness = parseInt(formData.get('sharpness') as string);

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Process image with sharp
    const processedImageBuffer = await sharp(buffer)
      .modulate({
        brightness: (brightness - 50) / 25, // Convert 0-100 to -2 to 2
        saturation: 1,
        hue: 0,
      })
      .linear(contrast / 50, -(contrast - 50) / 2) // Adjust contrast
      .sharpen(sharpness / 20) // Convert 0-100 to 0-5
      .toBuffer();

    // Convert buffer to base64
    const base64Image = `data:image/png;base64,${processedImageBuffer.toString('base64')}`;

    return NextResponse.json({ processedImage: base64Image });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
} 