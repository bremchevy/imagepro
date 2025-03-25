import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function removeBackground(file: File) {
  try {
    // 1. Upload the image to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `background-removal/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // 2. Get the public URL of the uploaded image
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    // 3. Call the background removal API
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': process.env.NEXT_PUBLIC_REMOVE_BG_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: publicUrl,
        size: 'auto',
        type: 'auto',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to remove background');
    }

    // 4. Get the processed image as blob
    const blob = await response.blob();

    // 5. Upload the processed image back to Supabase
    const processedFileName = `processed-${fileName}`;
    const processedFilePath = `background-removal/${processedFileName}`;

    const { error: processedUploadError } = await supabase.storage
      .from('images')
      .upload(processedFilePath, blob);

    if (processedUploadError) throw processedUploadError;

    // 6. Get the public URL of the processed image
    const { data: { publicUrl: processedUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(processedFilePath);

    return processedUrl;
  } catch (error) {
    console.error('Error in background removal:', error);
    throw error;
  }
} 