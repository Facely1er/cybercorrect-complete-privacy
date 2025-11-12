import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { Bell, Shield, Globe, Save, AlertCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { secureStorage } from '../../utils/secureStorage';

interface NotificationPreferences {
  emailEnabled: boolean;
  inAppEnabled: boolean;
  frequency: 'real_time' | 'daily' | 'weekly';
  channels: string[];
}

interface PrivacySettings {
  dataSharing: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface LanguageSettings {
  language: string;
  timezone: string;
  dateFormat: string;
}

const Settings = () => {
  const [notifications, setNotifications] = useState<NotificationPreferences>({
    emailEnabled: true,
    inAppEnabled: true,
    frequency: 'daily',
    channels: ['email', 'in_app'],
  });
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    dataSharing: false,
    analytics: true,
    marketing: false,
  });
  const [language, setLanguage] = useState<LanguageSettings>({
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    dateFormat: 'MM/DD/YYYY',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // Load from localStorage first (Privacy by Design)
      const localNotifications = secureStorage.getItem<NotificationPreferences>('notification_preferences');
      const localPrivacy = secureStorage.getItem<PrivacySettings>('privacy_settings');
      const localLanguage = secureStorage.getItem<LanguageSettings>('language_settings');

      if (localNotifications) setNotifications(localNotifications);
      if (localPrivacy) setPrivacy(localPrivacy);
      if (localLanguage) setLanguage(localLanguage);

      // Sync from Supabase if configured
      if (isSupabaseConfigured()) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Fetch notification preferences
          const { data: notificationData } = await supabase
            .from('notification_preferences')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (notificationData) {
            setNotifications({
              emailEnabled: notificationData.email_enabled || false,
              inAppEnabled: notificationData.in_app_enabled || true,
              frequency: notificationData.frequency || 'daily',
              channels: notificationData.channels || ['email', 'in_app'],
            });
          }
        }
      }
    } catch (err) {
      console.error('Error loading settings:', err);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      // Save to localStorage first (Privacy by Design)
      secureStorage.setItem('notification_preferences', notifications);
      secureStorage.setItem('privacy_settings', privacy);
      secureStorage.setItem('language_settings', language);

      // Sync to Supabase if configured
      if (isSupabaseConfigured()) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Update notification preferences
          const { error: notificationError } = await supabase
            .from('notification_preferences')
            .upsert({
              user_id: user.id,
              email_enabled: notifications.emailEnabled,
              in_app_enabled: notifications.inAppEnabled,
              frequency: notifications.frequency,
              channels: notifications.channels,
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'user_id',
            });

          if (notificationError) {
            throw notificationError;
          }
        }
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="py-20">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences, notifications, and privacy settings.
          </p>
        </div>

        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {success && (
          <Card className="mb-6 border-success">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-success">
                <span>Settings saved successfully!</span>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="notifications">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy">
              <Shield className="mr-2 h-4 w-4" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="language">
              <Globe className="mr-2 h-4 w-4" />
              Language & Region
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.emailEnabled}
                      onChange={(e) => setNotifications({ ...notifications, emailEnabled: e.target.checked })}
                      className="h-5 w-5"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">In-App Notifications</h4>
                      <p className="text-sm text-muted-foreground">Show notifications in the app</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.inAppEnabled}
                      onChange={(e) => setNotifications({ ...notifications, inAppEnabled: e.target.checked })}
                      className="h-5 w-5"
                    />
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Notification Frequency</h4>
                    <select
                      value={notifications.frequency}
                      onChange={(e) => setNotifications({ ...notifications, frequency: e.target.value as any })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="real_time">Real-time</option>
                      <option value="daily">Daily Digest</option>
                      <option value="weekly">Weekly Summary</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control your data sharing preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Data Sharing</h4>
                      <p className="text-sm text-muted-foreground">Allow data sharing for service improvement</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacy.dataSharing}
                      onChange={(e) => setPrivacy({ ...privacy, dataSharing: e.target.checked })}
                      className="h-5 w-5"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Analytics</h4>
                      <p className="text-sm text-muted-foreground">Help improve the platform with usage analytics</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacy.analytics}
                      onChange={(e) => setPrivacy({ ...privacy, analytics: e.target.checked })}
                      className="h-5 w-5"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Marketing Communications</h4>
                      <p className="text-sm text-muted-foreground">Receive marketing emails and updates</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacy.marketing}
                      onChange={(e) => setPrivacy({ ...privacy, marketing: e.target.checked })}
                      className="h-5 w-5"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="language">
            <Card>
              <CardHeader>
                <CardTitle>Language & Region</CardTitle>
                <CardDescription>Set your language, timezone, and date format</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Language</h4>
                    <select
                      value={language.language}
                      onChange={(e) => setLanguage({ ...language, language: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Timezone</h4>
                    <select
                      value={language.timezone}
                      onChange={(e) => setLanguage({ ...language, timezone: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Europe/London">London (GMT)</option>
                      <option value="Europe/Paris">Paris (CET)</option>
                      <option value="Asia/Tokyo">Tokyo (JST)</option>
                    </select>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Date Format</h4>
                    <select
                      value={language.dateFormat}
                      onChange={(e) => setLanguage({ ...language, dateFormat: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save All Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;


