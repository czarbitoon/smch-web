import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Badge,
  Menu,
  MenuItem,
  Divider,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  Snackbar,
  Alert,
} from '@mui/material';
import { Virtuoso } from 'react-virtuoso';
import {
  Notifications as NotificationsIcon,
  NotificationsActive,
  NotificationsOff,
  Delete,
  CheckCircle,
  Error,
  Info,
  Warning,
  Refresh,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import notificationService from '../services/notificationService';

const PAGE_SIZE = 20;

const Notifications = () => {
  const theme = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = useCallback((message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const fetchNotifications = useCallback(async (pageNum = 1) => {
    try {
      const data = await notificationService.getAll({ page: pageNum, perPage: PAGE_SIZE });
      setNotifications(prev => pageNum === 1 ? data : [...prev, ...data]);
      setHasMore(data.length === PAGE_SIZE);
      setError('');
    } catch (error) {
      setError('Failed to load notifications');
      showSnackbar('Failed to load notifications', 'error');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [showSnackbar]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchNotifications(nextPage);
  }, [fetchNotifications, hasMore, loadingMore, page]);

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      await fetchNotifications();
    };
    initialize();

    const unsubscribe = notificationService.subscribe((newNotifications) => {
      setNotifications(prev => {
        const combined = [...newNotifications, ...prev];
        const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
        return unique.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      });
    });

    return () => unsubscribe();
  }, [fetchNotifications]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
      showSnackbar('Notification marked as read');
    } catch (error) {
      showSnackbar('Failed to mark notification as read', 'error');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
      showSnackbar('All notifications marked as read');
    } catch (error) {
      showSnackbar('Failed to mark all as read', 'error');
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await notificationService.delete(notificationId);
      setNotifications(prev =>
        prev.filter(notification => notification.id !== notificationId)
      );
      showSnackbar('Notification deleted');
    } catch (error) {
      showSnackbar('Failed to delete notification', 'error');
    }
    setDeleteDialogOpen(false);
  };

  const handleDeleteAll = async () => {
    try {
      await notificationService.deleteAll();
      setNotifications([]);
      showSnackbar('All notifications deleted');
    } catch (error) {
      showSnackbar('Failed to delete all notifications', 'error');
    }
    setDeleteDialogOpen(false);
  };

  const getNotificationIcon = useCallback((type) => {
    switch (type) {
      case 'success':
        return <CheckCircle color="success" />;
      case 'error':
        return <Error color="error" />;
      case 'warning':
        return <Warning color="warning" />;
      default:
        return <Info color="info" />;
    }
  }, []);

  const unreadCount = useMemo(() => 
    notifications.filter(n => !n.read).length,
    [notifications]
  );

  const renderNotification = useCallback(({ item: notification }) => (
    <ListItem
      key={notification.id}
      sx={{
        bgcolor: notification.read ? 'inherit' : 'action.hover',
        '&:hover': { bgcolor: 'action.selected' },
        transition: theme.transitions.create(['background-color']),
      }}
    >
      <ListItemIcon>
        {getNotificationIcon(notification.type)}
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: notification.read ? 'normal' : 'bold',
            }}
          >
            {notification.title}
          </Typography>
        }
        secondary={
          <>
            <Typography component="span" variant="body2" color="text.primary">
              {notification.message}
            </Typography>
            <br />
            <Typography component="span" variant="caption" color="text.secondary">
              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
            </Typography>
          </>
        }
      />
      <ListItemSecondaryAction>
        {!notification.read && (
          <IconButton
            edge="end"
            size="small"
            onClick={() => handleMarkAsRead(notification.id)}
            sx={{ mr: 1 }}
          >
            <NotificationsActive />
          </IconButton>
        )}
        <IconButton
          edge="end"
          size="small"
          onClick={() => {
            setSelectedNotification(notification);
            setDeleteDialogOpen(true);
          }}
        >
          <Delete />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  ), [getNotificationIcon, handleMarkAsRead, theme.transitions]);

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        aria-label="show notifications"
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 360,
            maxHeight: '80vh',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Notifications</Typography>
          <Box>
            {notifications.length > 0 && (
              <>
                <IconButton
                  size="small"
                  onClick={() => fetchNotifications(1)}
                  sx={{ mr: 1 }}
                >
                  <Refresh />
                </IconButton>
                <Button
                  size="small"
                  onClick={handleMarkAllAsRead}
                  disabled={unreadCount === 0}
                >
                  Mark all as read
                </Button>
              </>
            )}
          </Box>
        </Box>

        <Divider />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : error ? (
          <Box sx={{ p: 2 }}>
            <Typography color="error" align="center">{error}</Typography>
            <Button
              fullWidth
              startIcon={<Refresh />}
              onClick={() => fetchNotifications(1)}
              sx={{ mt: 1 }}
            >
              Retry
            </Button>
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <NotificationsOff sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
            <Typography color="text.secondary">No notifications</Typography>
          </Box>
        ) : (
          <Virtuoso
            style={{ height: '60vh' }}
            data={notifications}
            endReached={loadMore}
            overscan={20}
            itemContent={(index, notification) => renderNotification({ item: notification })}
            components={{
              Footer: () =>
                loadingMore ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : null,
            }}
          />
        )}
      </Menu>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Notification</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this notification?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => handleDelete(selectedNotification?.id)}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Notifications;
