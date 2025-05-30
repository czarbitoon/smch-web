import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  useTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Devices as DevicesIcon,
  Business as BusinessIcon,
  Assignment as ReportsIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthProvider';

const DRAWER_WIDTH = 240;

const AppSidebar = ({ open, onClose, variant = 'persistent' }) => {
  const location = useLocation();
  const theme = useTheme();
  const { user, userRole } = useContext(AuthContext);
  const isAdmin = userRole === 'admin' || userRole === 'superadmin';
  const isStaff = userRole === 'staff';

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: isAdmin ? '/admin/dashboard' : isStaff ? '/staff/dashboard' : '/user/dashboard',
      active: location.pathname.includes('dashboard')
    },
    {
      text: 'Devices',
      icon: <DevicesIcon />,
      path: '/devices',
      active: location.pathname.includes('devices')
    },
    ...(isAdmin || isStaff ? [{
      text: 'Offices',
      icon: <BusinessIcon />,
      path: '/offices',
      active: location.pathname.includes('offices')
    }] : []),
    {
      text: 'Reports',
      icon: <ReportsIcon />,
      path: '/reports',
      active: location.pathname.includes('reports')
    },
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      path: '/settings',
      active: location.pathname.includes('settings')
    }
  ];

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box 
        sx={{ 
          p: 3, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          SMCH System
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
          Hardware Monitoring
        </Typography>
      </Box>

      <Divider />

      {/* User Info */}
      <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
        <Typography variant="body2" color="text.secondary">
          Welcome back,
        </Typography>
        <Typography variant="subtitle2" fontWeight="medium">
          {user?.name || 'User'}
        </Typography>
        <Typography variant="caption" color="primary.main" sx={{ textTransform: 'capitalize' }}>
          {userRole}
        </Typography>
      </Box>

      <Divider />

      {/* Navigation */}
      <List sx={{ flex: 1, pt: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.path}
              onClick={variant === 'temporary' ? onClose : undefined}
              sx={{
                mx: 1,
                mb: 0.5,
                borderRadius: 2,
                '&.active': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '& .MuiListItemIcon-root': {
                    color: 'white'
                  },
                  '&:hover': {
                    bgcolor: 'primary.dark'
                  }
                },
                '&:hover': {
                  bgcolor: item.active ? 'primary.dark' : 'action.hover'
                }
              }}
              className={item.active ? 'active' : ''}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: item.active ? 600 : 400
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
          boxShadow: variant === 'temporary' ? theme.shadows[8] : 'none'
        },
      }}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

AppSidebar.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['permanent', 'persistent', 'temporary'])
};

export default AppSidebar;