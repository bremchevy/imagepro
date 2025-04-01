export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  location?: string;
  bio?: string;
  avatar_url?: string;
  phone_number?: string;
  website?: string;
  social_links?: Record<string, string>;
  email_notifications: boolean;
  marketing_emails: boolean;
  security_alerts: boolean;
  updates_and_news: boolean;
  two_factor_enabled: boolean;
  account_status: string;
  created_at: Date;
  updated_at: Date;
}

export interface ProfileFormData {
  full_name: string;
  location?: string;
  bio?: string;
}

export interface AvatarUploadResponse {
  url: string;
  error?: string;
}

export interface ProfileError {
  message: string;
  details: any;
} 