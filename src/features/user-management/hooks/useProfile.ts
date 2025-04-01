import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { UserProfile, ProfileFormData, ProfileError } from '../types/profile';
import { supabase } from '@/lib/supabase';

const PROFILE_STORAGE_KEY = 'user_profile';

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          created_at: new Date(parsed.created_at),
          updated_at: new Date(parsed.updated_at)
        };
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ProfileError | null>(null);

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    if (profile) {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    }
  }, [profile]);

  // Load profile when user changes or component mounts
  useEffect(() => {
    if (user) {
      loadProfile();
      
      // Subscribe to real-time changes
      const subscription = supabase
        .channel('profile_changes')
        .on(
          'postgres_changes' as any,
          {
            event: '*',
            schema: 'public',
            table: 'user_profiles',
            filter: `id=eq.${user.id}`
          },
          (payload: { new: UserProfile | null }) => {
            console.log('Profile change received:', payload);
            if (payload.new) {
              const updatedProfile = {
                ...payload.new,
                created_at: new Date(payload.new.created_at),
                updated_at: new Date(payload.new.updated_at)
              };
              setProfile(updatedProfile);
              localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));
            }
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // Set loading to false immediately if there's no user
      setLoading(false);
      setProfile(null);
      localStorage.removeItem(PROFILE_STORAGE_KEY);
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (user) {
        // Load profile from Supabase
        const { data, error: fetchError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            // Profile doesn't exist, create it
            const newProfile = {
              id: user.id,
              email: user.email!,
              full_name: user.email?.split('@')[0] || 'User',
              avatar_url: undefined,
              location: undefined,
              bio: undefined,
              phone_number: undefined,
              website: undefined,
              social_links: undefined,
              email_notifications: true,
              marketing_emails: true,
              security_alerts: true,
              updates_and_news: true,
              two_factor_enabled: false,
              account_status: 'active',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };

            const { data: insertData, error: insertError } = await supabase
              .from('user_profiles')
              .insert([newProfile])
              .select()
              .single();

            if (insertError) throw insertError;
            
            if (insertData) {
              const profileData = {
                ...insertData,
                created_at: new Date(insertData.created_at),
                updated_at: new Date(insertData.updated_at)
              };
              setProfile(profileData);
              localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileData));
            }
          } else {
            throw fetchError;
          }
        } else if (data) {
          // Profile exists, set it in state
          const profileData = {
            ...data,
            created_at: new Date(data.created_at),
            updated_at: new Date(data.updated_at)
          };
          setProfile(profileData);
          localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileData));
        }
      } else {
        // Set default guest profile
        const guestProfile = {
          id: 'guest',
          email: 'guest@example.com',
          full_name: 'Guest User',
          location: undefined,
          bio: undefined,
          avatar_url: undefined,
          phone_number: undefined,
          website: undefined,
          social_links: undefined,
          email_notifications: false,
          marketing_emails: false,
          security_alerts: false,
          updates_and_news: false,
          two_factor_enabled: false,
          account_status: 'guest',
          created_at: new Date(),
          updated_at: new Date()
        };
        setProfile(guestProfile);
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(guestProfile));
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError({
        message: 'Failed to load profile',
        details: err
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: ProfileFormData) => {
    try {
      setLoading(true);
      setError(null);
      
      if (user) {
        console.log('Updating profile for user:', user.id);
        
        // Update profile in Supabase
        const { data: updateData, error: updateError } = await supabase
          .from('user_profiles')
          .update({
            full_name: data.full_name,
            location: data.location,
            bio: data.bio,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)
          .select()
          .single();

        if (updateError) {
          console.error('Supabase update error:', updateError);
          throw updateError;
        }

        console.log('Profile updated in Supabase:', updateData);
        
        // Update local state with the new data
        if (updateData) {
          const profileData = {
            ...updateData,
            created_at: new Date(updateData.created_at),
            updated_at: new Date(updateData.updated_at)
          };
          setProfile(profileData);
          localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileData));
        }
        
        return updateData;
      }

      return null;
    } catch (err) {
      console.error('Profile update error:', err);
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