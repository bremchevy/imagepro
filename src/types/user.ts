import { User as SupabaseUser } from '@supabase/supabase-js';

export interface ImageProcessingHistoryItem {
  id: string;
  toolId: string;
  originalImage: string;
  processedImage: string;
  timestamp: Date;
  settings: Record<string, any>;
}

export interface User extends SupabaseUser {
  isPro: boolean;
  createdAt: Date;
  lastLoginAt: Date;
  trialCount: number;
  trialResetDate: Date;
  subscriptionStatus?: 'active' | 'cancelled' | 'expired';
  subscriptionEndDate?: Date;
  imageProcessingHistory: ImageProcessingHistoryItem[];
  preferences: {
    defaultTool?: string;
    imageQuality?: 'low' | 'medium' | 'high';
    autoSave?: boolean;
    notifications?: boolean;
  };
} 