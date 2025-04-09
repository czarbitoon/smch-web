import axios from '../axiosInstance';

const CACHE_TIME = 5 * 60 * 1000; // 5 minutes
let notificationsCache = {
  data: null,
  timestamp: null,
};

const notificationService = {
  // Get all notifications with pagination
  getAll: async ({ page = 1, perPage = 20 } = {}) => {
    try {
      const response = await axios.get('/api/notifications', {
        params: {
          page,
          per_page: perPage,
        },
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Get unread notifications with caching
  getUnread: async () => {
    try {
      // Check cache validity
      const now = Date.now();
      if (
        notificationsCache.data &&
        notificationsCache.timestamp &&
        now - notificationsCache.timestamp < CACHE_TIME
      ) {
        return notificationsCache.data;
      }

      const response = await axios.get('/api/notifications/unread', {
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      // Update cache
      notificationsCache = {
        data: response.data,
        timestamp: now,
      };

      return response.data;
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
      throw error;
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      const response = await axios.put(`/api/notifications/${notificationId}/read`);
      // Invalidate cache
      notificationsCache.timestamp = null;
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const response = await axios.put('/api/notifications/mark-all-read');
      // Invalidate cache
      notificationsCache.timestamp = null;
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  // Delete notification
  delete: async (notificationId) => {
    try {
      const response = await axios.delete(`/api/notifications/${notificationId}`);
      // Invalidate cache
      notificationsCache.timestamp = null;
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  // Delete all notifications
  deleteAll: async () => {
    try {
      const response = await axios.delete('/api/notifications');
      // Invalidate cache
      notificationsCache.timestamp = null;
      return response.data;
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      throw error;
    }
  },

  // Subscribe to real-time notifications with optimized polling
  subscribe: (callback) => {
    let lastNotificationId = null;
    let consecutiveEmptyPolls = 0;
    const MAX_EMPTY_POLLS = 3;

    const pollInterval = setInterval(async () => {
      try {
        const notifications = await notificationService.getUnread();
        
        // Check if there are new notifications
        const hasNewNotifications = notifications.some(
          notification => !lastNotificationId || notification.id > lastNotificationId
        );

        if (hasNewNotifications) {
          callback(notifications);
          consecutiveEmptyPolls = 0;
          if (notifications.length > 0) {
            lastNotificationId = Math.max(...notifications.map(n => n.id));
          }
        } else {
          consecutiveEmptyPolls++;
        }

        // Increase polling interval if no new notifications
        if (consecutiveEmptyPolls >= MAX_EMPTY_POLLS) {
          clearInterval(pollInterval);
          setTimeout(() => {
            notificationService.subscribe(callback);
          }, 60000); // Poll every minute after 3 empty polls
        }
      } catch (error) {
        console.error('Error polling notifications:', error);
        consecutiveEmptyPolls++;
      }
    }, 30000); // Start with polling every 30 seconds

    return () => clearInterval(pollInterval);
  },

  // Clear cache
  clearCache: () => {
    notificationsCache = {
      data: null,
      timestamp: null,
    };
  },
};

export default notificationService; 