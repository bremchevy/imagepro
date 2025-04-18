import { useState } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { ProfileService } from '../services/profile';
import { AvatarUploadResponse } from '../types/profile';

export const useAvatarUpload = () => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadAvatar = async (file: File): Promise<AvatarUploadResponse> => {
    if (!user) {
      setError('Please sign in to upload an avatar');
      return { url: '', error: 'Please sign in to upload an avatar' };
    }

    setIsUploading(true);
    setError(null);

    try {
      // First, clear any existing avatars
      await ProfileService.clearAllAvatars(user.id);

      // Then upload the new avatar
      const result = await ProfileService.uploadAvatar(user.id, file);
      if (result.error) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload avatar';
      setError(errorMessage);
      return { url: '', error: errorMessage };
    } finally {
      setIsUploading(false);
    }
  };

  const deleteAvatar = async (avatarUrl: string): Promise<boolean> => {
    if (!user) {
      setError('Please sign in to delete an avatar');
      return false;
    }

    setIsUploading(true);
    setError(null);

    try {
      const success = await ProfileService.deleteAvatar(user.id, avatarUrl);
      if (!success) {
        setError('Failed to delete avatar');
      }
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete avatar';
      setError(errorMessage);
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadAvatar,
    deleteAvatar,
    isUploading,
    error
  };
}; 