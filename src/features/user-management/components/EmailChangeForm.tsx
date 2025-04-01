import { useState } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function EmailChangeForm() {
  const { user } = useAuth();
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsLoading(true);

      // First verify the current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: currentPassword,
      });

      if (signInError) {
        throw new Error('Current password is incorrect');
      }

      // Update the email
      const { error: updateError } = await supabase.auth.updateUser({
        email: newEmail,
      });

      if (updateError) {
        throw updateError;
      }

      // Update the profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({ email: newEmail })
        .eq('id', user.id);

      if (profileError) {
        throw profileError;
      }

      toast.success('Email updated successfully. Please check your new email for verification.');
      setNewEmail('');
      setCurrentPassword('');
    } catch (error) {
      console.error('Error updating email:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleEmailChange} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="current-email">Current Email</Label>
        <Input
          id="current-email"
          type="email"
          value={user?.email || ''}
          disabled
          className="bg-muted"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="new-email">New Email</Label>
        <Input
          id="new-email"
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="Enter new email"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="current-password">Current Password</Label>
        <Input
          id="current-password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Enter current password"
          required
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Updating...
          </>
        ) : (
          'Update Email'
        )}
      </Button>
    </form>
  );
} 