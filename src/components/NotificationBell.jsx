import React from 'react';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useNotifications } from '../context/NotificationContext';

const NotificationBell = () => {
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    markAllAsRead();
  };
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton color="inherit" onClick={handleOpen} size="large">
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose} PaperProps={{ sx: { minWidth: 320 } }}>
        <Typography variant="h6" sx={{ px: 2, pt: 1 }}>Notifications</Typography>
        <Divider sx={{ my: 1 }} />
        {notifications.length === 0 && (
          <MenuItem disabled>No notifications</MenuItem>
        )}
        {notifications.slice(0, 10).map((n, i) => (
          <MenuItem key={n.id || i} selected={!n.read_at}>
            <ListItemText
              primary={n.data?.message || n.message || 'New notification'}
              secondary={n.created_at ? new Date(n.created_at).toLocaleString() : ''}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default NotificationBell;
