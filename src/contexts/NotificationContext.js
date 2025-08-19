import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

// Mock notification data
const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    type: 'banner',
    title: 'Annual HOA Meeting',
    message: 'Join us for the annual HOA meeting on March 15th at 7:00 PM in the community center.',
    category: 'info',
    priority: 'high',
    active: true,
    startDate: '2024-03-01',
    endDate: '2024-03-15',
    targetRole: 'all',
    createdBy: 'Admin',
    createdAt: '2024-02-28T10:00:00Z',
    readBy: []
  },
  {
    id: '2',
    type: 'banner',
    title: 'Pool Maintenance Notice',
    message: 'The community pool will be closed for maintenance from March 20-22. Thank you for your patience.',
    category: 'warning',
    priority: 'medium',
    active: true,
    startDate: '2024-03-18',
    endDate: '2024-03-23',
    targetRole: 'all',
    createdBy: 'Maintenance',
    createdAt: '2024-03-10T14:30:00Z',
    readBy: []
  },
  {
    id: '3',
    type: 'notification',
    title: 'Payment Reminder',
    message: 'Your monthly HOA dues payment is due in 5 days.',
    category: 'reminder',
    priority: 'medium',
    active: true,
    startDate: '2024-03-10',
    endDate: '2024-03-31',
    targetRole: 'members',
    createdBy: 'System',
    createdAt: '2024-03-10T09:00:00Z',
    readBy: []
  },
  {
    id: '4',
    type: 'alert',
    title: 'Board Meeting Tomorrow',
    message: 'Reminder: Board meeting scheduled for tomorrow at 7:00 PM.',
    category: 'info',
    priority: 'high',
    active: true,
    startDate: '2024-03-14',
    endDate: '2024-03-15',
    targetRole: 'board',
    createdBy: 'Secretary',
    createdAt: '2024-03-14T16:00:00Z',
    readBy: []
  }
];

const NOTIFICATION_CATEGORIES = [
  { value: 'info', label: 'Information', color: 'blue', bgColor: 'blue-500/10', textColor: 'blue-600' },
  { value: 'warning', label: 'Warning', color: 'amber', bgColor: 'amber-500/10', textColor: 'amber-600' },
  { value: 'success', label: 'Success', color: 'emerald', bgColor: 'emerald-500/10', textColor: 'emerald-600' },
  { value: 'error', label: 'Error', color: 'red', bgColor: 'red-500/10', textColor: 'red-600' },
  { value: 'reminder', label: 'Reminder', color: 'violet', bgColor: 'violet-500/10', textColor: 'violet-600' }
];

const NOTIFICATION_TYPES = [
  { value: 'banner', label: 'Banner', description: 'Displayed prominently at top of pages' },
  { value: 'notification', label: 'Notification', description: 'Appears in notification center' },
  { value: 'alert', label: 'Alert', description: 'Urgent notifications with special styling' },
  { value: 'email', label: 'Email', description: 'Sent via email to recipients' }
];

const TARGET_ROLES = [
  { value: 'all', label: 'Everyone', description: 'All users including public visitors' },
  { value: 'members', label: 'Members', description: 'HOA members only' },
  { value: 'board', label: 'Board Members', description: 'Board members only' },
  { value: 'admin', label: 'Administrators', description: 'Admin users only' }
];

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, hasRole } = useAuth();

  // Filter notifications based on user role and activity
  const getVisibleNotifications = () => {
    if (!user) return notifications.filter(n => n.targetRole === 'all');
    
    const now = new Date().toISOString().split('T')[0];
    
    return notifications.filter(notification => {
      // Check if notification is active and within date range
      if (!notification.active) return false;
      if (notification.startDate && notification.startDate > now) return false;
      if (notification.endDate && notification.endDate < now) return false;
      
      // Check role permissions
      switch (notification.targetRole) {
        case 'all':
          return true;
        case 'members':
          return hasRole('member');
        case 'board':
          return hasRole('board');
        case 'admin':
          return hasRole('admin');
        default:
          return false;
      }
    });
  };

  const getNotificationsByType = (type) => {
    return getVisibleNotifications().filter(n => n.type === type);
  };

  const getActiveBanners = () => {
    return getNotificationsByType('banner');
  };

  const getUnreadNotifications = () => {
    const userId = user?.id;
    if (!userId) return [];
    
    return getVisibleNotifications().filter(n => 
      !n.readBy.includes(userId)
    );
  };

  const addNotification = async (notificationData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newNotification = {
        id: Date.now().toString(),
        ...notificationData,
        createdBy: user?.name || 'Unknown',
        createdAt: new Date().toISOString(),
        readBy: []
      };
      
      setNotifications(prev => [...prev, newNotification]);
      return newNotification;
    } catch (err) {
      setError('Failed to create notification');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateNotification = async (notificationId, updates) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, ...updates }
            : notification
        )
      );
    } catch (err) {
      setError('Failed to update notification');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNotification = async (notificationId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (err) {
      setError('Failed to delete notification');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    const userId = user?.id;
    if (!userId) return;
    
    try {
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { 
                ...notification, 
                readBy: [...new Set([...notification.readBy, userId])]
              }
            : notification
        )
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    const userId = user?.id;
    if (!userId) return;
    
    try {
      const visibleNotifications = getVisibleNotifications();
      const updates = {};
      
      visibleNotifications.forEach(notification => {
        if (!notification.readBy.includes(userId)) {
          updates[notification.id] = {
            ...notification,
            readBy: [...new Set([...notification.readBy, userId])]
          };
        }
      });
      
      setNotifications(prev => 
        prev.map(notification => 
          updates[notification.id] || notification
        )
      );
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  const dismissNotification = async (notificationId) => {
    try {
      await updateNotification(notificationId, { active: false });
    } catch (err) {
      console.error('Failed to dismiss notification:', err);
    }
  };

  const getCategoryConfig = (category) => {
    return NOTIFICATION_CATEGORIES.find(cat => cat.value === category) || NOTIFICATION_CATEGORIES[0];
  };

  const getNotificationStats = () => {
    const visible = getVisibleNotifications();
    const unread = getUnreadNotifications();
    
    return {
      total: visible.length,
      unread: unread.length,
      banners: getNotificationsByType('banner').length,
      alerts: getNotificationsByType('alert').length,
      byCategory: NOTIFICATION_CATEGORIES.reduce((acc, cat) => {
        acc[cat.value] = visible.filter(n => n.category === cat.value).length;
        return acc;
      }, {}),
      byPriority: {
        high: visible.filter(n => n.priority === 'high').length,
        medium: visible.filter(n => n.priority === 'medium').length,
        low: visible.filter(n => n.priority === 'low').length
      }
    };
  };

  const value = {
    notifications: getVisibleNotifications(),
    allNotifications: notifications,
    categories: NOTIFICATION_CATEGORIES,
    types: NOTIFICATION_TYPES,
    targetRoles: TARGET_ROLES,
    isLoading,
    error,
    
    // Filtered getters
    getNotificationsByType,
    getActiveBanners,
    getUnreadNotifications,
    getCategoryConfig,
    getNotificationStats,
    
    // Actions
    addNotification,
    updateNotification,
    deleteNotification,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    
    // Utilities
    clearError: () => setError(null)
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;