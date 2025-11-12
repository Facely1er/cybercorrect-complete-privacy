// Local reminder service with browser notifications
import { secureStorage } from './secureStorage';
import { notificationService } from './notificationService';

export interface LocalReminder {
  id: string;
  title: string;
  message: string;
  scheduledAt: string;
  actionUrl?: string;
  priority?: 'low' | 'normal' | 'high' | 'critical';
  metadata?: Record<string, unknown>;
}

const REMINDERS_STORAGE_KEY = 'cybercorrect_local_reminders';

class LocalReminderService {
  private remindersCache: LocalReminder[] = [];
  private checkInterval: NodeJS.Timeout | null = null;

  /**
   * Request notification permission
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('Browser does not support notifications');
      return 'denied';
    }

    if (Notification.permission === 'default') {
      return await Notification.requestPermission();
    }

    return Notification.permission;
  }

  /**
   * Create local reminder
   */
  async createReminder(reminder: Omit<LocalReminder, 'id'>): Promise<LocalReminder> {
    try {
      const localReminder: LocalReminder = {
        ...reminder,
        id: `reminder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      this.remindersCache.push(localReminder);
      this.syncRemindersToLocal();

      // Start checking if not already running
      this.startChecking();

      return localReminder;
    } catch (error) {
      console.error('Failed to create reminder:', error);
      throw error;
    }
  }

  /**
   * Get reminders
   */
  async getReminders(options?: {
    upcomingOnly?: boolean;
    limit?: number;
  }): Promise<LocalReminder[]> {
    try {
      const reminders = secureStorage.getItem<LocalReminder[]>(REMINDERS_STORAGE_KEY) || [];
      
      let filtered = [...reminders];

      if (options?.upcomingOnly) {
        const now = new Date();
        filtered = filtered.filter(r => new Date(r.scheduledAt) >= now);
      }

      // Sort by scheduledAt
      filtered.sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

      if (options?.limit) {
        filtered = filtered.slice(0, options.limit);
      }

      this.remindersCache = filtered;
      return filtered;
    } catch (error) {
      console.error('Failed to get reminders:', error);
      return [];
    }
  }

  /**
   * Delete reminder
   */
  async deleteReminder(reminderId: string): Promise<boolean> {
    try {
      this.remindersCache = this.remindersCache.filter(r => r.id !== reminderId);
      this.syncRemindersToLocal();
      return true;
    } catch (error) {
      console.error('Failed to delete reminder:', error);
      return false;
    }
  }

  /**
   * Check and trigger reminders
   */
  async checkReminders(): Promise<void> {
    try {
      const now = new Date();
      const reminders = await this.getReminders({ upcomingOnly: false });

      for (const reminder of reminders) {
        const scheduledAt = new Date(reminder.scheduledAt);
        
        // Check if reminder is due (within 1 minute)
        if (scheduledAt <= now && scheduledAt.getTime() > now.getTime() - 60000) {
          await this.triggerReminder(reminder);
          
          // Delete reminder after triggering
          await this.deleteReminder(reminder.id);
        }
      }
    } catch (error) {
      console.error('Failed to check reminders:', error);
    }
  }

  /**
   * Trigger reminder notification
   */
  private async triggerReminder(reminder: LocalReminder): Promise<void> {
    try {
      // Check permission
      const permission = await this.requestPermission();
      
      if (permission === 'granted') {
        // Show browser notification
        const notification = new Notification(reminder.title, {
          body: reminder.message,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: reminder.id,
          requireInteraction: reminder.priority === 'critical' || reminder.priority === 'high',
        });

        // Handle notification click
        notification.onclick = () => {
          window.focus();
          if (reminder.actionUrl) {
            window.location.href = reminder.actionUrl;
          }
          notification.close();
        };

        // Auto-close after 5 seconds (unless critical/high)
        if (reminder.priority !== 'critical' && reminder.priority !== 'high') {
          setTimeout(() => {
            notification.close();
          }, 5000);
        }
      }

      // Also create in-app notification
      await notificationService.createNotification({
        type: 'deadline',
        priority: reminder.priority || 'normal',
        title: reminder.title,
        message: reminder.message,
        action_url: reminder.actionUrl,
        action_label: 'View',
      });
    } catch (error) {
      console.error('Failed to trigger reminder:', error);
    }
  }

  /**
   * Start checking reminders
   */
  startChecking(): void {
    if (this.checkInterval) {
      return; // Already checking
    }

    // Check immediately
    this.checkReminders();

    // Check every minute
    this.checkInterval = setInterval(() => {
      this.checkReminders();
    }, 60000);
  }

  /**
   * Stop checking reminders
   */
  stopChecking(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Sync reminders to local storage
   */
  private syncRemindersToLocal(): void {
    try {
      secureStorage.setItem(REMINDERS_STORAGE_KEY, this.remindersCache);
    } catch (error) {
      console.error('Failed to sync reminders to local storage:', error);
    }
  }

  /**
   * Initialize reminder service
   */
  async initialize(): Promise<void> {
    try {
      // Load from local storage
      const localReminders = secureStorage.getItem<LocalReminder[]>(REMINDERS_STORAGE_KEY);
      if (localReminders) {
        this.remindersCache = localReminders;
      }

      // Request permission
      await this.requestPermission();

      // Start checking
      this.startChecking();
    } catch (error) {
      console.error('Failed to initialize reminder service:', error);
    }
  }
}

export const localReminderService = new LocalReminderService();

// Initialize on module load
if (typeof window !== 'undefined') {
  localReminderService.initialize();
}

