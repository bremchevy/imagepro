import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const backgroundType = formData.get('backgroundType') as string || 'transparent';

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const buffer = Buffer.from(await image.arrayBuffer());

    // Call the Background Remover API
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': process.env.REMOVE_BG_API_KEY || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_file_b64: buffer.toString('base64'),
        size: 'auto',
        type: 'auto',
        bg_color: backgroundType === 'transparent' ? null : backgroundType,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Background Remover API Error:', errorData);
      return NextResponse.json(
        { error: errorData.errors?.[0]?.message || 'Failed to process image' },
        { status: response.status }
      );
    }

    // Get the binary image data
    const imageBuffer = await response.arrayBuffer();
    
    // Convert to base64
    const base64Image = Buffer.from(imageBuffer).toString('base64');

    // Return the processed image
    return NextResponse.json({
      processedImage: `data:image/png;base64,${base64Image}`
    });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process image' },
      { status: 500 }
    );
  }
} 