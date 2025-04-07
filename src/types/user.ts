import { User as SupabaseUser } from '@supabase/supabase-js';

export interface ImageProcessingHistoryItem {
  id: string;
  toolId: string;
  originalImage: string;
  processedImage: string;
  timestamp: Date;
  settings: Record<string, any>;
}

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  isPro: boolean;
  createdAt: Date;
  lastLoginAt: Date;
  trialCount: number;
  trialResetDate: Date;
  subscriptionStatus?: string;
  subscriptionEndDate?: Date;
  imageProcessingHistory: any[];
  preferences: {
    defaultTool?: string;
    imageQuality?: string;
    autoSave?: boolean;
    notifications?: boolean;
  };
  user_metadata?: {
    avatar_url?: string;
    [key: string]: any;
  };
  created_at?: string;
} 