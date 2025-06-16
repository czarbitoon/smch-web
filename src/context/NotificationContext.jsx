import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios from '../axiosInstance';
// import Echo from 'laravel-echo'; // Uncomment and configure if using Echo
// import Pusher from 'pusher-js';

export const NotificationContext = createContext({
  notifications: [],
  unreadCount: 0,
  markAllAsRead: () => {},
  fetchNotifications: () => {},
});

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userId, setUserId] = useState(null);

  // Fetch notifications from backend
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await axios.get('/api/notifications');
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.read_at).length);
    } catch (e) {
      // Handle error
    }
  }, []);

  // Mark all as read
  const markAllAsRead = async () => {
    await axios.post('/api/notifications/mark-all-read');
    fetchNotifications();
  };

  // Get user id from /api/profile
  useEffect(() => {
    axios.get('/api/profile').then(res => {
      setUserId(res.data.id || res.data.user?.id);
    });
  }, []);

  // Listen for real-time notifications
  useEffect(() => {
    fetchNotifications();
    // Uncomment and configure below for Echo/Pusher
    // window.Pusher = Pusher;
    // window.Echo = new Echo({
    //   broadcaster: 'pusher',
    //   key: process.env.VITE_PUSHER_APP_KEY,
    //   cluster: process.env.VITE_PUSHER_APP_CLUSTER,
    //   wsHost: process.env.VITE_PUSHER_HOST,
    //   wsPort: process.env.VITE_PUSHER_PORT,
    //   forceTLS: false,
    //   encrypted: true,
    //   disableStats: true,
    //   enabledTransports: ['ws', 'wss'],
    // });
    // if (userId) {
    //   window.Echo.private(`App.Models.User.${userId}`)
    //     .notification((notification) => {
    //       setNotifications(prev => [notification, ...prev]);
    //       setUnreadCount(count => count + 1);
    //     });
    // }
  }, [userId, fetchNotifications]);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead, fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
