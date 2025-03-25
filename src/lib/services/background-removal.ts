import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function removeBackground(imageFile: File): Promise<string> {
  try {
    // Call Remove.bg API directly with the file
    const formData = new FormData();
    formData.append('image_file', imageFile);
    formData.append('size', 'auto');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': process.env.NEXT_PUBLIC_REMOVE_BG_API_KEY!,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors?.[0]?.title || 'Failed to remove background');
    }

    const blob = await response.blob();
    
    // Upload processed image to Supabase
    const processedFileName = `processed-${Date.now()}-${imageFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(processedFileName, blob);

    if (uploadError) throw uploadError;

    // Get public URL of processed image
    const { data: { publicUrl: processedUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(processedFileName);

    return processedUrl;
  } catch (error) {
    console.error('Error in background removal:', error);
    throw error;
  }
} 