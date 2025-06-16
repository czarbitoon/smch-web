import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle as AccountIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthProvider';
import NotificationBell from './NotificationBell';

const AppHeader = ({ onToggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { user, userRole, logout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  const isAdmin = userRole === 'admin' || userRole === 'superadmin';
  const isStaff = userRole === 'staff';

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleProfileMenuClose();
    await logout();
    navigate('/login');
  };

  const handleProfile = () => {
    handleProfileMenuClose();
    navigate('/profile');
  };

  const handleSettings = () => {
    handleProfileMenuClose();
    navigate('/settings');
  };

  return (
    <AppBar position="fixed" color="default" elevation={2} sx={{ zIndex: theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={onToggleSidebar} sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 900, letterSpacing: 1 }}>
          {location.pathname === '/' ? 'Dashboard' : location.pathname.replace('/', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </Typography>
        {/* Notification Bell */}
        <NotificationBell />
        {/* Profile/Settings Menu */}
        <Box sx={{ ml: 2 }}>
          <Tooltip title="Account settings">
            <IconButton onClick={handleProfileMenuOpen} color="inherit" size="large">
              {user?.profile_picture ? (
                <Avatar src={user.profile_picture} />
              ) : (
                <AccountIcon fontSize="large" />
              )}
            </IconButton>
          </Tooltip>
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={handleProfile}><ListItemIcon><PersonIcon /></ListItemIcon>Profile</MenuItem>
          <MenuItem onClick={handleSettings}><ListItemIcon><SettingsIcon /></ListItemIcon>Settings</MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}><ListItemIcon><LogoutIcon /></ListItemIcon>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default AppHeader;
