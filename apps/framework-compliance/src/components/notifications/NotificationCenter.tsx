import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  X, 
  Settings, 
  Filter,
  Trash2,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  FileText,
  ClipboardList,
  Scale,
  Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { notificationService, Notification, NotificationType, NotificationPreferences } from '../../utils/compliance';
import { toast } from '../ui/Toaster';

export const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | NotificationType>('all');
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    loadNotifications();
    loadPreferences();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [notifications, filter]);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await notificationService.getNotifications({ limit: 100 });
      setNotifications(data);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      toast.error('Failed to load notifications', 'Please try again');
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

  const applyFilter = () => {
    let filtered = [...notifications];

    if (filter === 'unread') {
      filtered = filtered.filter(n => !n.read);
    } else if (filter !== 'all') {
      filtered = filtered.filter(n => n.type === filter);
    }

    setFilteredNotifications(filtered);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      await loadNotifications();
      toast.success('Notification marked as read');
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      toast.error('Failed to mark notification as read', 'Please try again');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      await loadNotifications();
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      toast.error('Failed to mark all as read', 'Please try again');
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      await loadNotifications();
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Failed to delete notification:', error);
      toast.error('Failed to delete notification', 'Please try again');
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to delete all notifications?')) {
      return;
    }

    try {
      for (const notification of notifications) {
        await notificationService.deleteNotification(notification.id);
      }
      await loadNotifications();
      toast.success('All notifications deleted');
    } catch (error) {
      console.error('Failed to delete all notifications:', error);
      toast.error('Failed to delete all notifications', 'Please try again');
    }
  };

  const handleUpdatePreferences = async (updates: Partial<NotificationPreferences>) => {
    if (!preferences) return;

    try {
      const updated = { ...preferences, ...updates };
      await notificationService.updatePreferences(updated);
      setPreferences(updated);
      toast.success('Preferences updated');
    } catch (error) {
      console.error('Failed to update preferences:', error);
      toast.error('Failed to update preferences', 'Please try again');
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
      case 'deadline':
        return <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />;
      case 'report':
        return <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      case 'assessment':
        return <ClipboardList className="h-5 w-5 text-purple-600 dark:text-purple-400" />;
      case 'regulatory':
        return <Scale className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />;
      case 'alert':
        return <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />;
      default:
        return <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">Notification Center</h1>
            <p className="text-muted-foreground">
              Manage your notifications and preferences
            </p>
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" onClick={handleMarkAllAsRead}>
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark all read
              </Button>
            )}
            <Button variant="outline" onClick={() => setShowPreferences(!showPreferences)}>
              <Settings className="h-4 w-4 mr-2" />
              Preferences
            </Button>
          </div>
        </div>
      </div>

      {showPreferences && preferences && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Email Notifications</label>
                <input
                  type="checkbox"
                  checked={preferences.email_enabled}
                  onChange={(e) => handleUpdatePreferences({ email_enabled: e.target.checked })}
                  className="h-4 w-4"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">In-App Notifications</label>
                <input
                  type="checkbox"
                  checked={preferences.in_app_enabled}
                  onChange={(e) => handleUpdatePreferences({ in_app_enabled: e.target.checked })}
                  className="h-4 w-4"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Notification Frequency</label>
                <select
                  value={preferences.frequency}
                  onChange={(e) => handleUpdatePreferences({ frequency: e.target.value as NotificationPreferences['frequency'] })}
                  className="px-3 py-1 border rounded"
                >
                  <option value="real_time">Real-time</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
              {unreadCount > 0 && (
                <span className="text-sm font-normal text-muted-foreground">
                  ({unreadCount} unread)
                </span>
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 border rounded p-1">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as typeof filter)}
                  className="border-0 bg-transparent text-sm"
                >
                  <option value="all">All</option>
                  <option value="unread">Unread</option>
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                  <option value="deadline">Deadline</option>
                  <option value="report">Report</option>
                  <option value="assessment">Assessment</option>
                  <option value="regulatory">Regulatory</option>
                  <option value="alert">Alert</option>
                </select>
              </div>
              {notifications.length > 0 && (
                <Button variant="outline" size="sm" onClick={handleDeleteAll}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete all
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">
              Loading notifications...
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No notifications found
            </div>
          ) : (
            <div className="space-y-2">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border rounded-lg hover:bg-muted/50 transition-colors ${
                    !notification.read ? 'bg-muted/30 border-primary/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className={`font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          {notification.priority === 'critical' && (
                            <span className="text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 px-2 py-0.5 rounded">
                              Critical
                            </span>
                          )}
                          {notification.priority === 'high' && (
                            <span className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200 px-2 py-0.5 rounded">
                              High
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {new Date(notification.created_at).toLocaleString()}
                        </span>
                        <div className="flex items-center gap-2">
                          {notification.action_url && (
                            <Link to={notification.action_url}>
                              <Button variant="outline" size="sm" className="text-xs h-7">
                                {notification.action_label || 'View'}
                              </Button>
                            </Link>
                          )}
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="text-xs h-7"
                              title="Mark as read"
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Mark read
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(notification.id)}
                            className="text-xs h-7 text-muted-foreground hover:text-destructive"
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
        </CardContent>
      </Card>
    </div>
  );
};

