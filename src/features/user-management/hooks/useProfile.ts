import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { ProfileService } from '../services/profile';
import { UserProfile, ProfileFormData, ProfileError } from '../types/profile';

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ProfileError | null>(null);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) {
        // For unauthenticated users, set a default profile
        setProfile({
          id: 'guest',
          full_name: 'Guest User',
          location: null,
          bio: null,
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      } else {
        // For authenticated users, load their profile
        const data = await ProfileService.getProfile(user.id);
        setProfile(data);
      }
    } catch (err) {
      setError({
        message: 'Failed to load profile',
        details: err
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: ProfileFormData) => {
    if (!user) return null;

    try {
      setLoading(true);
      setError(null);
      const updated = await ProfileService.updateProfile(user.id, data);
      if (updated) {
        setProfile(updated);
      }
      return updated;
    } catch (err) {
      setError({
        message: 'Failed to update profile',
        details: err
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = () => {
    return loadProfile();
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    refreshProfile
  };
} 