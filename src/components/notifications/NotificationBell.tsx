import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, X, Settings } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { notificationService, Notification } from '../../utils/notificationService';
import { Link } from 'react-router-dom';

export const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();

    // Refresh notifications periodically
    const interval = setInterval(() => {
      loadNotifications();
      loadUnreadCount();
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await notificationService.getNotifications({ limit: 10, unreadOnly: false });
      setNotifications(data);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      await loadNotifications();
      await loadUnreadCount();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      await loadNotifications();
      await loadUnreadCount();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      await loadNotifications();
      await loadUnreadCount();
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'error':
        return '✕';
      case 'deadline':
        return '⏰';
      case 'report':
        return '📊';
      case 'assessment':
        return '📋';
      case 'regulatory':
        return '📜';
      case 'alert':
        return '🚨';
      default:
        return 'ℹ';
    }
  };

  const getNotificationColor = (type: Notification['type'], priority: Notification['priority']) => {
    if (priority === 'critical') return 'text-red-600 dark:text-red-400';
    if (priority === 'high') return 'text-orange-600 dark:text-orange-400';
    
    switch (type) {
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-blue-600 dark:text-blue-400';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 mt-2 w-96 max-h-[600px] overflow-hidden z-50 shadow-lg">
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-lg">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    className="text-xs"
                  >
                    Mark all read
                  </Button>
                )}
                <Link to="/notifications">
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="max-h-[500px] overflow-y-auto">
              {isLoading ? (
                <div className="p-8 text-center text-muted-foreground">
                  Loading notifications...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No notifications
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-muted/50 transition-colors ${
                        !notification.read ? 'bg-muted/30' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`text-lg ${getNotificationColor(notification.type, notification.priority)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className={`font-medium text-sm ${!notification.read ? 'font-semibold' : ''}`}>
                              {notification.title}
                            </h4>
                            {notification.priority === 'critical' && (
                              <span className="text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 px-2 py-0.5 rounded">
                                Critical
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">
                              {new Date(notification.created_at).toLocaleDateString()}
                            </span>
                            <div className="flex items-center gap-2">
                              {notification.action_url && (
                                <Link to={notification.action_url}>
                                  <Button variant="ghost" size="sm" className="text-xs h-6">
                                    {notification.action_label || 'View'}
                                  </Button>
                                </Link>
                              )}
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="text-xs h-6"
                                  title="Mark as read"
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(notification.id)}
                                className="text-xs h-6 text-muted-foreground hover:text-destructive"
                                title="Delete"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-4 border-t text-center">
                <Link to="/notifications">
                  <Button variant="outline" size="sm" className="w-full">
                    View all notifications
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

