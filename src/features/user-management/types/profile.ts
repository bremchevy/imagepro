export interface UserProfile {
  id: string;
  full_name: string | null;
  location: string | null;
  bio: string | null;
  avatar_url: string | null;
  updated_at: string;
  created_at: string;
}

export interface ProfileFormData {
  full_name: string;
  location: string;
  bio: string;
}

export interface AvatarUploadResponse {
  url: string;
  error?: string;
}

export interface ProfileError {
  message: string;
  code?: string;
  details?: unknown;
} 