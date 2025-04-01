import { useState } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function TwoFactorAuth() {
  const { user } = useAuth();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const newState = !isEnabled;

      const { error } = await supabase
        .from('user_profiles')
        .update({ two_factor_enabled: newState })
        .eq('id', user.id);

      if (error) throw error;

      setIsEnabled(newState);
      toast.success(
        newState
          ? 'Two-factor authentication enabled'
          : 'Two-factor authentication disabled'
      );
    } catch (error) {
      console.error('Error updating 2FA settings:', error);
      toast.error('Failed to update two-factor authentication settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Two-Factor Authentication</Label>
            <p className="text-sm text-muted-foreground">
              Add an extra layer of security to your account
            </p>
          </div>
          <Switch
            checked={isEnabled}
            onCheckedChange={handleToggle}
            disabled={isLoading}
          />
        </div>

        {isEnabled && (
          <div className="rounded-lg bg-muted p-4">
            <h4 className="font-medium">Setup Instructions</h4>
            <ol className="mt-2 list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Download an authenticator app (Google Authenticator, Authy, etc.)</li>
              <li>Scan the QR code that will be displayed</li>
              <li>Enter the 6-digit code from your authenticator app</li>
              <li>Save your backup codes in a secure location</li>
            </ol>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center text-sm text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Updating settings...
        </div>
      )}
    </div>
  );
} 