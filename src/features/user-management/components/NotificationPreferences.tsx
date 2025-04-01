import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface NotificationSettings {
  email_notifications: boolean;
  marketing_emails: boolean;
  security_alerts: boolean;
  updates_and_news: boolean;
}

export function NotificationPreferences() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<NotificationSettings>({
    email_notifications: true,
    marketing_emails: true,
    security_alerts: true,
    updates_and_news: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('email_notifications, marketing_emails, security_alerts, updates_and_news')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      if (data) setSettings(data);
    } catch (error) {
      console.error('Error loading notification settings:', error);
      toast.error('Failed to load notification settings');
    }
  };

  const handleToggle = async (setting: keyof NotificationSettings) => {
    if (!user) return;

    try {
      setIsLoading(true);
      const newSettings = { ...settings, [setting]: !settings[setting] };

      const { error } = await supabase
        .from('user_profiles')
        .update(newSettings)
        .eq('id', user.id);

      if (error) throw error;

      setSettings(newSettings);
      toast.success('Notification settings updated');
    } catch (error) {
      console.error('Error updating notification settings:', error);
      toast.error('Failed to update notification settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive notifications about your account activity
            </p>
          </div>
          <Switch
            checked={settings.email_notifications}
            onCheckedChange={() => handleToggle('email_notifications')}
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Marketing Emails</Label>
            <p className="text-sm text-muted-foreground">
              Receive emails about new features and promotions
            </p>
          </div>
          <Switch
            checked={settings.marketing_emails}
            onCheckedChange={() => handleToggle('marketing_emails')}
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Security Alerts</Label>
            <p className="text-sm text-muted-foreground">
              Get notified about important security updates
            </p>
          </div>
          <Switch
            checked={settings.security_alerts}
            onCheckedChange={() => handleToggle('security_alerts')}
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Updates and News</Label>
            <p className="text-sm text-muted-foreground">
              Stay informed about product updates and company news
            </p>
          </div>
          <Switch
            checked={settings.updates_and_news}
            onCheckedChange={() => handleToggle('updates_and_news')}
            disabled={isLoading}
          />
        </div>
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