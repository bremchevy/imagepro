'use client';

import { useProfile } from '../hooks/useProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

export function ProfileCard() {
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 animate-pulse rounded-full bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-muted" />
              <div className="h-3 w-24 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <User className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-medium">{profile?.full_name || 'Guest User'}</h3>
            <p className="text-sm text-muted-foreground">
              {profile?.location || 'No location set'}
            </p>
          </div>
        </div>
        {profile?.bio && (
          <div className="mt-4">
            <h4 className="text-sm font-medium">About</h4>
            <p className="mt-1 text-sm text-muted-foreground">{profile.bio}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 