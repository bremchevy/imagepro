import { supabase } from '@/lib/supabase';
import { UserProfile, ProfileFormData, AvatarUploadResponse, ProfileError } from '../types/profile';

export class ProfileService {
  static async getProfile(userId: string): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, create a default one
          return this.createDefaultProfile(userId);
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Return a default profile if there's an error
      return this.createDefaultProfile(userId);
    }
  }

  static async createDefaultProfile(userId: string): Promise<UserProfile> {
    const defaultProfile: UserProfile = {
      id: userId,
      full_name: 'New User',
      location: null,
      bio: null,
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([defaultProfile])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating default profile:', error);
      return defaultProfile;
    }
  }

  static async updateProfile(userId: string, data: ProfileFormData): Promise<UserProfile | null> {
    try {
      const { data: updated, error } = await supabase
        .from('profiles')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return updated;
    } catch (error) {
      console.error('Error updating profile:', error);
      return null;
    }
  }

  static async uploadAvatar(userId: string, file: File): Promise<AvatarUploadResponse> {
    try {
      // Don't allow avatar uploads for guest users
      if (userId === 'guest') {
        return {
          url: '',
          error: 'Guest users cannot upload avatars'
        };
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update user profile with new avatar URL
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      return { url: publicUrl };
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return {
        url: '',
        error: error instanceof Error ? error.message : 'Failed to upload avatar'
      };
    }
  }

  static async clearAllAvatars(userId: string): Promise<boolean> {
    try {
      // Don't allow avatar clearing for guest users
      if (userId === 'guest') {
        return false;
      }

      // First, get the current profile to get the avatar URL
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('avatar_url')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // If there's an avatar URL in the profile, delete it from storage
      if (profile?.avatar_url) {
        const filePath = profile.avatar_url.split('/').slice(-2).join('/');
        const { error: deleteError } = await supabase.storage
          .from('avatars')
          .remove([filePath]);

        if (deleteError) throw deleteError;
      }

      // Update user metadata to remove avatar_url
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { avatar_url: null }
      });

      if (metadataError) throw metadataError;

      // Update profile to remove avatar_url
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ avatar_url: null })
        .eq('id', userId);

      if (updateError) throw updateError;

      return true;
    } catch (error) {
      console.error('Error clearing avatars:', error);
      return false;
    }
  }

  static async deleteAvatar(userId: string, avatarUrl: string): Promise<boolean> {
    try {
      // Don't allow avatar deletion for guest users
      if (userId === 'guest') {
        return false;
      }

      // Extract file path from URL
      const filePath = avatarUrl.split('/').slice(-2).join('/');

      // Delete file from storage
      const { error: deleteError } = await supabase.storage
        .from('avatars')
        .remove([filePath]);

      if (deleteError) throw deleteError;

      // Update user profile to remove avatar URL
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ avatar_url: null })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Also clear the avatar from user metadata
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { avatar_url: null }
      });

      if (metadataError) throw metadataError;

      return true;
    } catch (error) {
      console.error('Error deleting avatar:', error);
      return false;
    }
  }
} 