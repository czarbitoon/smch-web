import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { createEcho } from '../utils/echo';

export interface Notification {
  id?: string | number;
  message?: string;
  data?: { message?: string };
  created_at?: string;
  read_at?: string | null;
  [key: string]: any;
}

interface NotificationContextProps {
  notifications: Notification[];
  unreadCount: number;
  markAllAsRead: () => void;
  fetchNotifications: () => void;
  showNotification: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

const NotificationContext = createContext<NotificationContextProps>({
  notifications: [],
  unreadCount: 0,
  markAllAsRead: () => {},
  fetchNotifications: () => {},
  showNotification: () => {},
});

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/notifications`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setNotifications(res.data);
      setUnreadCount(res.data.filter((n: Notification) => !n.read_at).length);
    } catch (e) {
      // Handle error
    }
  }, []);

  const markAllAsRead = async () => {
    const token = localStorage.getItem('token');
    await axios.post(`/api/notifications/mark-all-read`, {}, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    fetchNotifications();
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    toast(message, { type });
  };

  // Optionally, you can use websockets or Echo for real-time notifications here
  useEffect(() => {
    fetchNotifications();
    // Real-time notifications with Echo/Pusher
    let echoInstance: any = null;
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');
    if (token && userId && process.env.REACT_APP_PUSHER_APP_KEY && process.env.REACT_APP_PUSHER_APP_CLUSTER) {
      echoInstance = createEcho(token);
      echoInstance.private(`App.Models.User.${userId}`)
        .notification((notification: Notification) => {
          setNotifications(prev => [notification, ...prev]);
          setUnreadCount(count => count + 1);
          showNotification(notification.message || notification.data?.message || 'New notification', 'info');
        });
    }
    return () => {
      if (echoInstance) {
        echoInstance.disconnect();
      }
    };
  }, [fetchNotifications]);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead, fetchNotifications, showNotification }}>
      {children}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
