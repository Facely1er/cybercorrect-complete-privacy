// Notification service for in-app and email notifications
import { supabase } from '../../lib/supabase';
import { secureStorage } from '../storage/secureStorage';

export type NotificationType = 'info' | 'warning' | 'error' | 'success' | 'deadline' | 'report' | 'assessment' | 'regulatory' | 'alert';
export type NotificationPriority = 'low' | 'normal' | 'high' | 'critical';

export interface Notification {
  id: string;
  user_id?: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  created_at: string;
  expires_at?: string;
  action_url?: string;
  action_label?: string;
}

export interface NotificationPreferences {
  id?: string;
  user_id?: string;
  email_enabled: boolean;
  in_app_enabled: boolean;
  channels: {
    email?: boolean;
    in_app?: boolean;
    sms?: boolean;
    slack?: boolean;
    teams?: boolean;
  };
  frequency: 'real_time' | 'hourly' | 'daily' | 'weekly';
  created_at?: string;
  updated_at?: string;
}

const NOTIFICATIONS_STORAGE_KEY = 'cybercorrect_notifications';
const PREFERENCES_STORAGE_KEY = 'cybercorrect_notification_preferences';

class NotificationService {
  private notificationsCache: Notification[] = [];
  private preferencesCache: NotificationPreferences | null = null;

  /**
   * Create a new notification
   */
  async createNotification(
    notification: Omit<Notification, 'id' | 'read' | 'created_at'>
  ): Promise<Notification | null> {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Store locally if not authenticated
        return this.createLocalNotification(notification);
      }

      // Create notification in Supabase
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          type: notification.type,
          priority: notification.priority,
          title: notification.title,
          message: notification.message,
          data: notification.data || {},
          expires_at: notification.expires_at,
          action_url: notification.action_url,
          action_label: notification.action_label,
        })
        .select()
        .single();

      if (error) throw error;

      // Update cache
      if (data) {
        this.notificationsCache.unshift(data as Notification);
        this.syncNotificationsToLocal();
      }

      return data as Notification;
    } catch (error) {
      console.error('Failed to create notification:', error);
      // Fallback to local storage
      return this.createLocalNotification(notification);
    }
  }

  /**
   * Create local notification (for offline/unauthenticated users)
   */
  private createLocalNotification(
    notification: Omit<Notification, 'id' | 'read' | 'created_at'>
  ): Notification {
    const localNotification: Notification = {
      id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: notification.type,
      priority: notification.priority,
      title: notification.title,
      message: notification.message,
      data: notification.data,
      read: false,
      created_at: new Date().toISOString(),
      expires_at: notification.expires_at,
      action_url: notification.action_url,
      action_label: notification.action_label,
    };

    // Add to local cache
    this.notificationsCache.unshift(localNotification);
    this.syncNotificationsToLocal();

    return localNotification;
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      // Update in cache
      const notification = this.notificationsCache.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Update in Supabase
        const { error } = await supabase
          .from('notifications')
          .update({ read: true })
          .eq('id', notificationId)
          .eq('user_id', user.id);

        if (error) throw error;
      }

      // Sync to local storage
      this.syncNotificationsToLocal();

      return true;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      return false;
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<boolean> {
    try {
      // Update in cache
      this.notificationsCache.forEach(n => { n.read = true; });

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Update in Supabase
        const { error } = await supabase
          .from('notifications')
          .update({ read: true })
          .eq('user_id', user.id)
          .eq('read', false);

        if (error) throw error;
      }

      // Sync to local storage
      this.syncNotificationsToLocal();

      return true;
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      return false;
    }
  }

  /**
   * Get user notifications
   */
  async getNotifications(options?: {
    limit?: number;
    offset?: number;
    unreadOnly?: boolean;
    type?: NotificationType;
  }): Promise<Notification[]> {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Fetch from Supabase
        let query = supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (options?.unreadOnly) {
          query = query.eq('read', false);
        }

        if (options?.type) {
          query = query.eq('type', options.type);
        }

        if (options?.limit) {
          query = query.limit(options.limit);
        }

        if (options?.offset) {
          query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
        }

        const { data, error } = await query;

        if (error) throw error;

        if (data) {
          this.notificationsCache = data as Notification[];
          this.syncNotificationsToLocal();
          return this.notificationsCache;
        }
      }

      // Fallback to local storage
      return this.getLocalNotifications(options);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      return this.getLocalNotifications(options);
    }
  }

  /**
   * Get local notifications
   */
  private getLocalNotifications(options?: {
    limit?: number;
    offset?: number;
    unreadOnly?: boolean;
    type?: NotificationType;
  }): Notification[] {
    const localNotifications = secureStorage.getItem<Notification[]>(NOTIFICATIONS_STORAGE_KEY) || [];
    
    let filtered = [...localNotifications];

    if (options?.unreadOnly) {
      filtered = filtered.filter(n => !n.read);
    }

    if (options?.type) {
      filtered = filtered.filter(n => n.type === options.type);
    }

    // Sort by created_at descending
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    if (options?.limit) {
      filtered = filtered.slice(options.offset || 0, (options.offset || 0) + options.limit);
    }

    this.notificationsCache = filtered;
    return filtered;
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      // Remove from cache
      this.notificationsCache = this.notificationsCache.filter(n => n.id !== notificationId);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Delete from Supabase
        const { error } = await supabase
          .from('notifications')
          .delete()
          .eq('id', notificationId)
          .eq('user_id', user.id);

        if (error) throw error;
      }

      // Sync to local storage
      this.syncNotificationsToLocal();

      return true;
    } catch (error) {
      console.error('Failed to delete notification:', error);
      return false;
    }
  }

  /**
   * Get unread count
   */
  async getUnreadCount(): Promise<number> {
    try {
      const notifications = await this.getNotifications({ unreadOnly: true });
      return notifications.length;
    } catch (error) {
      console.error('Failed to get unread count:', error);
      return 0;
    }
  }

  /**
   * Schedule future notification
   */
  async scheduleNotification(
    notification: Omit<Notification, 'id' | 'read' | 'created_at'>,
    scheduledAt: Date
  ): Promise<boolean> {
    try {
      // Store scheduled notification locally
      const scheduledNotifications = secureStorage.getItem<Array<{
        notification: Omit<Notification, 'id' | 'read' | 'created_at'>;
        scheduledAt: string;
      }>>('cybercorrect_scheduled_notifications') || [];

      scheduledNotifications.push({
        notification,
        scheduledAt: scheduledAt.toISOString(),
      });

      secureStorage.setItem('cybercorrect_scheduled_notifications', scheduledNotifications);

      // Check for scheduled notifications on app load
      this.checkScheduledNotifications();

      return true;
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      return false;
    }
  }

  /**
   * Check and create scheduled notifications
   */
  async checkScheduledNotifications(): Promise<void> {
    try {
      const scheduledNotifications = secureStorage.getItem<Array<{
        notification: Omit<Notification, 'id' | 'read' | 'created_at'>;
        scheduledAt: string;
      }>>('cybercorrect_scheduled_notifications') || [];

      const now = new Date();
      const toCreate: typeof scheduledNotifications = [];
      const toKeep: typeof scheduledNotifications = [];

      scheduledNotifications.forEach(scheduled => {
        const scheduledDate = new Date(scheduled.scheduledAt);
        if (scheduledDate <= now) {
          toCreate.push(scheduled);
        } else {
          toKeep.push(scheduled);
        }
      });

      // Create notifications that are due
      for (const scheduled of toCreate) {
        await this.createNotification(scheduled.notification);
      }

      // Update scheduled notifications
      secureStorage.setItem('cybercorrect_scheduled_notifications', toKeep);
    } catch (error) {
      console.error('Failed to check scheduled notifications:', error);
    }
  }

  /**
   * Get notification preferences
   */
  async getPreferences(): Promise<NotificationPreferences> {
    try {
      if (this.preferencesCache) {
        return this.preferencesCache;
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Fetch from Supabase
        const { data, error } = await supabase
          .from('notification_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          throw error;
        }

        if (data) {
          this.preferencesCache = data as NotificationPreferences;
          this.syncPreferencesToLocal();
          return this.preferencesCache;
        }
      }

      // Fallback to local storage or defaults
      return this.getLocalPreferences();
    } catch (error) {
      console.error('Failed to fetch preferences:', error);
      return this.getLocalPreferences();
    }
  }

  /**
   * Get local preferences
   */
  private getLocalPreferences(): NotificationPreferences {
    const local = secureStorage.getItem<NotificationPreferences>(PREFERENCES_STORAGE_KEY);
    if (local) {
      this.preferencesCache = local;
      return local;
    }

    // Return defaults
    const defaults: NotificationPreferences = {
      email_enabled: true,
      in_app_enabled: true,
      channels: {
        email: true,
        in_app: true,
        sms: false,
        slack: false,
        teams: false,
      },
      frequency: 'real_time',
    };

    this.preferencesCache = defaults;
    return defaults;
  }

  /**
   * Update notification preferences
   */
  async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<boolean> {
    try {
      // Update cache
      if (this.preferencesCache) {
        this.preferencesCache = { ...this.preferencesCache, ...preferences };
      } else {
        const current = await this.getPreferences();
        this.preferencesCache = { ...current, ...preferences };
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Update in Supabase (upsert)
        const { error } = await supabase
          .from('notification_preferences')
          .upsert({
            user_id: user.id,
            ...this.preferencesCache,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id',
          });

        if (error) throw error;
      }

      // Sync to local storage
      this.syncPreferencesToLocal();

      return true;
    } catch (error) {
      console.error('Failed to update preferences:', error);
      return false;
    }
  }

  /**
   * Sync notifications to local storage
   */
  private syncNotificationsToLocal(): void {
    try {
      secureStorage.setItem(NOTIFICATIONS_STORAGE_KEY, this.notificationsCache);
    } catch (error) {
      console.error('Failed to sync notifications to local storage:', error);
    }
  }

  /**
   * Sync preferences to local storage
   */
  private syncPreferencesToLocal(): void {
    try {
      if (this.preferencesCache) {
        secureStorage.setItem(PREFERENCES_STORAGE_KEY, this.preferencesCache);
      }
    } catch (error) {
      console.error('Failed to sync preferences to local storage:', error);
    }
  }

  /**
   * Initialize notification service
   */
  async initialize(): Promise<void> {
    try {
      // Load from local storage first
      const localNotifications = secureStorage.getItem<Notification[]>(NOTIFICATIONS_STORAGE_KEY);
      if (localNotifications) {
        this.notificationsCache = localNotifications;
      }

      // Check scheduled notifications
      await this.checkScheduledNotifications();

      // Fetch from Supabase if authenticated
      await this.getNotifications({ limit: 50 });
      await this.getPreferences();
    } catch (error) {
      console.error('Failed to initialize notification service:', error);
    }
  }
}

export const notificationService = new NotificationService();

// Initialize on module load
if (typeof window !== 'undefined') {
  notificationService.initialize();
}

