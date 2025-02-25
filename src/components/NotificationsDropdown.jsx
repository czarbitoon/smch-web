import React, { useState, useEffect, useContext } from 'react';
import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CBadge
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBell } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosInstance';
import { AuthContext } from '../context/AuthProvider';

const NotificationsDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchNotifications();
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/notifications');
      setNotifications(response.data);
      setUnreadCount(response.data.filter(notif => !notif.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      // Mark notification as read
      await axios.post(`/notifications/${notification.id}/read`);
      // Update local state
      setNotifications(prevNotifications =>
        prevNotifications.map(n =>
          n.id === notification.id ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // Navigate to the report
      if (notification.report_id) {
        navigate(`/reports/${notification.report_id}`);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <CDropdown variant="nav-item" alignment="end">
      <CDropdownToggle className="position-relative" caret={false}>
        <CIcon icon={cilBell} size="lg" />
        {unreadCount > 0 && (
          <CBadge 
            color="danger" 
            position="top-end" 
            shape="rounded-pill"
            className="position-absolute"
          >
            {unreadCount}
          </CBadge>
        )}
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" style={{ minWidth: '300px', maxHeight: '500px', overflowY: 'auto' }}>
        <CDropdownItem header="true" className="bg-light">
          <strong>You have {unreadCount} new notifications</strong>
        </CDropdownItem>
        {notifications.length === 0 ? (
          <CDropdownItem className="text-center">
            No notifications
          </CDropdownItem>
        ) : (
          notifications.map(notification => (
            <CDropdownItem
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={notification.read ? 'bg-light' : ''}
              style={{ cursor: 'pointer' }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-semibold">{notification.title}</div>
                  <small className="text-medium-emphasis">{notification.message}</small>
                </div>
                <small className="text-medium-emphasis">
                  {new Date(notification.created_at).toLocaleDateString()}
                </small>
              </div>
            </CDropdownItem>
          ))
        )}
      </CDropdownMenu>
    </CDropdown>
  );
};

export default NotificationsDropdown;