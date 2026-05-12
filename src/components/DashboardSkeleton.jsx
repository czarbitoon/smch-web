import React from 'react';
import { 
  Box, 
  Paper, 
  Skeleton, 
  Grid, 
  Avatar, 
  Typography,
  useTheme 
} from '@mui/material';

/**
 * Skeleton loader for the profile card
 * Shows the "bones" of the dashboard while data is loading
 */
export function ProfileCardSkeleton() {
  const theme = useTheme();
  
  return (
    <Paper 
      elevation={6} 
      sx={{ 
        p: 5, 
        mb: 5, 
        borderRadius: 4, 
        textAlign: 'center',
        bgcolor: 'background.paper',
        boxShadow: 6,
      }}
    >
      <Skeleton variant="circular" width={96} height={96} sx={{ mx: 'auto', mb: 2 }} />
      <Skeleton variant="text" width="50%" height={32} sx={{ mx: 'auto', mb: 1 }} />
      <Skeleton variant="text" width="60%" height={24} sx={{ mx: 'auto' }} />
    </Paper>
  );
}

/**
 * Skeleton loader for stats cards
 * Displays 4 skeletal stat widgets arranged in a grid
 */
export function StatsCardsSkeleton() {
  return (
    <Grid container spacing={3} sx={{ mb: 6 }}>
      {[1, 2, 3, 4].map((item) => (
        <Grid item xs={12} sm={6} md={3} key={item}>
          <Paper 
            elevation={4} 
            sx={{ 
              p: 4, 
              textAlign: 'center', 
              borderRadius: 4, 
              bgcolor: 'background.paper', 
              boxShadow: 4,
              minHeight: '180px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Skeleton 
              variant="circular" 
              width={48} 
              height={48} 
              sx={{ mb: 2, mx: 'auto' }} 
            />
            <Skeleton variant="text" width="70%" height={24} sx={{ mx: 'auto', mb: 1 }} />
            <Skeleton variant="text" width="50%" height={40} sx={{ mx: 'auto' }} />
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

/**
 * Skeleton loader for health chart
 * Shows a rectangular skeleton to represent the chart area
 */
export function HealthChartSkeleton() {
  return (
    <Paper 
      elevation={4} 
      sx={{ 
        p: 3, 
        borderRadius: 4, 
        bgcolor: 'background.paper', 
        boxShadow: 4,
        minHeight: '300px',
        mb: 4
      }}
    >
      <Skeleton variant="text" width="30%" height={28} sx={{ mb: 3 }} />
      <Skeleton 
        variant="rectangular" 
        width="100%" 
        height={220} 
        sx={{ borderRadius: 2 }} 
      />
    </Paper>
  );
}

/**
 * Skeleton loader for menu buttons
 * Shows 4 skeletal button-like elements
 */
export function MenuButtonsSkeleton() {
  return (
    <Grid container spacing={3}>
      {[1, 2, 3, 4].map((item) => (
        <Grid item xs={12} md={6} key={item}>
          <Skeleton 
            variant="rectangular" 
            width="100%" 
            height={64} 
            sx={{ borderRadius: 4 }} 
          />
        </Grid>
      ))}
    </Grid>
  );
}

/**
 * Complete dashboard skeleton
 * Shows all loading placeholders together
 */
export function CompleteDashboardSkeleton() {
  return (
    <Box sx={{ py: 4, minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header Skeleton */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5, px: 1 }}>
        <Skeleton variant="text" width="30%" height={48} />
        <Skeleton variant="rectangular" width="120px" height={44} sx={{ borderRadius: 3 }} />
      </Box>

      {/* Profile Card Skeleton */}
      <ProfileCardSkeleton />

      {/* Divider */}
      <Box sx={{ mb: 4, borderBottom: 2, borderColor: 'divider', width: '100%' }} />

      {/* Stats Cards Skeleton */}
      <StatsCardsSkeleton />

      {/* Divider */}
      <Box sx={{ mb: 4, borderBottom: 2, borderColor: 'divider', width: '100%' }} />

      {/* Menu Buttons Skeleton */}
      <MenuButtonsSkeleton />
    </Box>
  );
}
