import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { notificationService, Notification, NotificationPreferences } from '../utils/notificationService';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  preferences: NotificationPreferences | null;
  isLoading: boolean;
  loadNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  updatePreferences: (prefs: Partial<NotificationPreferences>) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await notificationService.getNotifications({ limit: 50 });
      setNotifications(data);
      
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPreferences = async () => {
    try {
      const prefs = await notificationService.getPreferences();
      setPreferences(prefs);
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      await loadNotifications();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      await loadNotifications();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      await loadNotifications();
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const updatePreferences = async (prefs: Partial<NotificationPreferences>) => {
    try {
      await notificationService.updatePreferences(prefs);
      await loadPreferences();
    } catch (error) {
      console.error('Failed to update preferences:', error);
    }
  };

  const refreshNotifications = async () => {
    await loadNotifications();
  };

  useEffect(() => {
    loadNotifications();
    loadPreferences();

    // Refresh notifications periodically
    const interval = setInterval(() => {
      loadNotifications();
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        preferences,
        isLoading,
        loadNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        updatePreferences,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

