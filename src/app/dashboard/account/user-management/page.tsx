'use client';

import { useProfile } from '@/features/user-management/hooks/useProfile';
import { ProfileForm } from '@/features/user-management/components/ProfileForm';
import { AvatarUpload } from '@/features/user-management/components/AvatarUpload';
import { EmailChangeForm } from '@/features/user-management/components/EmailChangeForm';
import { PasswordChangeForm } from '@/features/user-management/components/PasswordChangeForm';
import { NotificationPreferences } from '@/features/user-management/components/NotificationPreferences';
import { TwoFactorAuth } from '@/features/user-management/components/TwoFactorAuth';
import { AccountDeletion } from '@/features/user-management/components/AccountDeletion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Shield, Bell, Settings, AlertTriangle } from 'lucide-react';

export default function UserManagementPage() {
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="space-y-2 text-center">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Account Settings
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage your profile and preferences
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-background/50 backdrop-blur-sm rounded-2xl border shadow-lg p-6">
            <Tabs defaultValue="profile" className="space-y-8">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-0 h-auto sm:h-12 bg-muted/50 p-2 sm:p-1 rounded-xl">
                <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm py-3 sm:py-0">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="security" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm py-3 sm:py-0">
                  <Shield className="w-4 h-4 mr-2" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="notifications" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm py-3 sm:py-0">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="preferences" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm py-3 sm:py-0">
                  <Settings className="w-4 h-4 mr-2" />
                  Preferences
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <Card className="border-none shadow-none bg-transparent">
                  <CardHeader className="px-0">
                    <CardTitle className="text-2xl font-semibold">Profile Information</CardTitle>
                    <CardDescription className="text-base">
                      Update your profile information and avatar
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-0 space-y-8">
                    <div className="bg-card rounded-xl border p-6">
                      <AvatarUpload
                        currentAvatarUrl={profile?.avatar_url}
                        onAvatarUpdate={() => {}}
                      />
                    </div>
                    <div className="bg-card rounded-xl border p-6">
                      <ProfileForm />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <Card className="border-none shadow-none bg-transparent">
                  <CardHeader className="px-0">
                    <CardTitle className="text-2xl font-semibold">Security Settings</CardTitle>
                    <CardDescription className="text-base">
                      Manage your account security settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-0 space-y-6">
                    <div className="bg-card rounded-xl border p-6 space-y-8">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Change Email</h3>
                        <EmailChangeForm />
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Change Password</h3>
                        <PasswordChangeForm />
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                        <TwoFactorAuth />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <Card className="border-none shadow-none bg-transparent">
                  <CardHeader className="px-0">
                    <CardTitle className="text-2xl font-semibold">Notification Preferences</CardTitle>
                    <CardDescription className="text-base">
                      Choose what notifications you want to receive
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-0">
                    <div className="bg-card rounded-xl border p-6">
                      <NotificationPreferences />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preferences" className="space-y-6">
                <Card className="border-none shadow-none bg-transparent">
                  <CardHeader className="px-0">
                    <CardTitle className="text-2xl font-semibold">Account Preferences</CardTitle>
                    <CardDescription className="text-base">
                      Manage your account preferences and settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-0 space-y-6">
                    <div className="bg-card rounded-xl border p-6">
                      <div className="space-y-8">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Theme</h3>
                          <p className="text-sm text-muted-foreground">
                            Coming soon: Choose your preferred theme
                          </p>
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Language</h3>
                          <p className="text-sm text-muted-foreground">
                            Coming soon: Select your preferred language
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-card rounded-xl border p-6">
                      <CardHeader className="px-0 pb-4">
                        <CardTitle className="text-xl font-semibold text-destructive flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5" />
                          Danger Zone
                        </CardTitle>
                        <CardDescription className="text-base">
                          Irreversible and destructive actions
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="px-0">
                        <AccountDeletion />
                      </CardContent>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
} 