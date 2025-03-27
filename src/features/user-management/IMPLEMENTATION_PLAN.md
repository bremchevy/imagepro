# User Profile Management Implementation Plan

## Overview
This document outlines the implementation plan for the user profile management feature in ImagePra. The feature will allow users to manage their profile information including full name, location, bio, and avatar.

## Data Structure

### Database Schema (Supabase)
```sql
-- User Profiles Table
create table public.user_profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  location text,
  bio text,
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.user_profiles enable row level security;

-- Create policies
create policy "Users can view their own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.user_profiles for insert
  with check (auth.uid() = id);
```

## Storage Configuration (Supabase)

### Avatar Storage Bucket
1. Create a new storage bucket named 'avatars'
2. Configure bucket policies:
   ```sql
   -- Allow users to upload their own avatars
   create policy "Users can upload their own avatars"
     on storage.objects for insert
     with check (
       bucket_id = 'avatars' and
       auth.uid()::text = (storage.foldername(name))[1]
     );

   -- Allow users to read all avatars
   create policy "Anyone can view avatars"
     on storage.objects for select
     using (bucket_id = 'avatars');
   ```

## Frontend Implementation

### Components Structure
```
src/features/user-management/
├── components/
│   ├── ProfileForm.tsx
│   ├── AvatarUpload.tsx
│   └── ProfileCard.tsx
├── hooks/
│   ├── useProfile.ts
│   └── useAvatarUpload.ts
├── types/
│   └── profile.ts
└── utils/
    └── profile-helpers.ts
```

### Types Definition
```typescript
// types/profile.ts
export interface UserProfile {
  id: string;
  full_name: string;
  location: string;
  bio: string;
  avatar_url: string | null;
  updated_at: string;
  created_at: string;
}

export interface ProfileFormData {
  full_name: string;
  location: string;
  bio: string;
}
```

### API Integration

#### Profile Service
```typescript
// services/profile.ts
import { supabase } from '@/lib/supabase';
import { UserProfile, ProfileFormData } from '@/features/user-management/types/profile';

export const profileService = {
  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, data: ProfileFormData): Promise<UserProfile> {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .update(data)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return profile;
  },

  async uploadAvatar(userId: string, file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return publicUrl;
  }
};
```

### Custom Hooks

#### useProfile Hook
```typescript
// hooks/useProfile.ts
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { profileService } from '../services/profile';
import { UserProfile, ProfileFormData } from '../types/profile';

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getProfile(user!.id);
      setProfile(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: ProfileFormData) => {
    try {
      setLoading(true);
      const updated = await profileService.updateProfile(user!.id, data);
      setProfile(updated);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, error, updateProfile, refreshProfile: loadProfile };
}
```

#### useAvatarUpload Hook
```typescript
// hooks/useAvatarUpload.ts
import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { profileService } from '../services/profile';

export function useAvatarUpload() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadAvatar = async (file: File) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setUploading(true);
      const avatarUrl = await profileService.uploadAvatar(user.id, file);
      return avatarUrl;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return { uploadAvatar, uploading, error };
}
```

## UI Components

### ProfileForm Component
```typescript
// components/ProfileForm.tsx
'use client';

import { useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-hot-toast';

export function ProfileForm() {
  const { profile, loading, updateProfile } = useProfile();
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    location: profile?.location || '',
    bio: profile?.bio || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="full_name">Full Name</label>
        <Input
          id="full_name"
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="location">Location</label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="bio">Bio</label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
        />
      </div>
      <Button type="submit">Save Changes</Button>
    </form>
  );
}
```

### AvatarUpload Component
```typescript
// components/AvatarUpload.tsx
'use client';

import { useState } from 'react';
import { useAvatarUpload } from '../hooks/useAvatarUpload';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'react-hot-toast';

export function AvatarUpload({ currentAvatarUrl, onAvatarUpdate }: {
  currentAvatarUrl: string | null;
  onAvatarUpdate: (url: string) => void;
}) {
  const { uploadAvatar, uploading } = useAvatarUpload();
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      const avatarUrl = await uploadAvatar(file);
      onAvatarUpdate(avatarUrl);
      toast.success('Avatar updated successfully');
    } catch (error) {
      toast.error('Failed to update avatar');
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-20 w-20">
        <AvatarImage src={previewUrl || ''} />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="avatar-upload"
        />
        <label htmlFor="avatar-upload">
          <Button variant="outline" asChild>
            <span>Change Avatar</span>
          </Button>
        </label>
      </div>
    </div>
  );
}
```

## Integration Steps

1. Database Setup
   - Execute the SQL commands to create the user_profiles table
   - Set up the storage bucket and policies in Supabase

2. Frontend Implementation
   - Create the necessary directories and files
   - Implement the types, services, and hooks
   - Create the UI components
   - Integrate with the existing auth context

3. Testing
   - Test profile creation
   - Test profile updates
   - Test avatar uploads
   - Test error handling
   - Test loading states

4. Documentation
   - Update API documentation
   - Add component documentation
   - Document database schema

## Security Considerations

1. Row Level Security (RLS) policies ensure users can only:
   - View their own profile
   - Update their own profile
   - Upload avatars to their own folder

2. File Upload Security
   - Validate file types
   - Implement file size limits
   - Sanitize file names

3. Input Validation
   - Validate all user inputs
   - Sanitize text content
   - Implement rate limiting

## Performance Considerations

1. Image Optimization
   - Implement image compression
   - Use appropriate image formats
   - Implement lazy loading

2. Caching
   - Cache profile data
   - Implement optimistic updates
   - Use SWR or React Query for data fetching

## Error Handling

1. Form Validation
   - Implement client-side validation
   - Show appropriate error messages
   - Handle network errors

2. File Upload Errors
   - Handle upload failures
   - Implement retry logic
   - Show upload progress

## Future Enhancements

1. Profile Features
   - Social media links
   - Profile privacy settings
   - Profile verification

2. UI/UX Improvements
   - Drag and drop avatar upload
   - Image cropping
   - Rich text editor for bio

3. Integration Features
   - OAuth provider profile sync
   - Profile export/import
   - Profile analytics 