'use client';

import { useProfile } from '../hooks/useProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, MapPin, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';

export function ProfileCard() {
  const { profile, loading, error } = useProfile();

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
            {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            No profile data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile.avatar_url || ''} />
            <AvatarFallback>
              {profile.full_name?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{profile.full_name || 'Unnamed User'}</CardTitle>
            <CardDescription>Member since {format(new Date(profile.created_at), 'MMMM yyyy')}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {profile.location && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{profile.location}</span>
          </div>
        )}
        
        {profile.bio && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="font-medium">About</span>
            </div>
            <p className="text-muted-foreground">{profile.bio}</p>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Last updated {format(new Date(profile.updated_at), 'MMMM d, yyyy')}</span>
        </div>
      </CardContent>
    </Card>
  );
} 