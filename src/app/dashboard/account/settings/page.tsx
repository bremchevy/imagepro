'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';

export default function AccountSettings() {
  const { user, updateEmail, updatePassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    name: user?.user_metadata?.full_name || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await updateEmail(formData.email);
      setSuccess('Email updated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update email');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await updatePassword(formData.newPassword);
      setSuccess('Password updated successfully!');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-2xl font-bold mb-8">Account Settings</h1>

      <div className="space-y-8">
        {/* Profile Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Profile</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="h-12"
              />
            </div>
          </div>
        </div>

        {/* Email Section */}
        <form onSubmit={handleEmailUpdate} className="space-y-4">
          <h2 className="text-xl font-semibold">Email Settings</h2>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="h-12"
            />
          </div>
          <Button type="submit" className="h-12" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Email'
            )}
          </Button>
        </form>

        {/* Password Section */}
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <h2 className="text-xl font-semibold">Password Settings</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="h-12"
              />
            </div>
          </div>
          <Button type="submit" className="h-12" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Password'
            )}
          </Button>
        </form>

        {/* Billing Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Billing Details</h2>
          <p className="text-sm text-muted-foreground">
            Manage your billing information and subscription details.
          </p>
          <Button variant="outline" className="h-12">
            Manage Billing
          </Button>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="text-sm text-destructive mt-4">
            {error}
          </div>
        )}
        {success && (
          <div className="text-sm text-green-600 mt-4">
            {success}
          </div>
        )}
      </div>
    </div>
  );
}