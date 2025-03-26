import { supabase } from '@/lib/supabase';

if (!process.env.NEXT_PUBLIC_REMOVE_BG_API_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_REMOVE_BG_API_KEY');
}

export async function removeBackground(imageFile: File): Promise<string> {
  try {
    // Validate file size (max 25MB)
    if (imageFile.size > 25 * 1024 * 1024) {
      throw new Error('Image size must be less than 25MB');
    }

    // Validate file type
    if (!imageFile.type.startsWith('image/')) {
      throw new Error('Please upload a valid image file');
    }

    // Call Remove.bg API directly with the file
    const formData = new FormData();
    formData.append('image_file', imageFile);
    formData.append('size', 'auto');

    console.log('Sending request to Remove.bg API...');
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': process.env.NEXT_PUBLIC_REMOVE_BG_API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Remove.bg API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.errors?.[0]?.title || 'Failed to remove background. Please try again.');
      } catch (e) {
        throw new Error(`Failed to remove background: ${response.status} ${response.statusText}`);
      }
    }

    const blob = await response.blob();
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        const base64data = reader.result as string;
        resolve(base64data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error in removeBackground:', error);
    throw error;
  }
} 