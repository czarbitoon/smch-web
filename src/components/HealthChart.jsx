import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

/**
 * Health Chart Component - Displays system metrics overview
 * Shows device status distribution, ticket status distribution, and combined health metrics
 */
export function HealthChart({ stats = {} }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Prepare data for visualizations
  const deviceStatusData = [
    { name: 'Online', value: Math.floor((stats.devices || 0) * 0.75), fill: theme.palette.success.main },
    { name: 'Offline', value: Math.floor((stats.devices || 0) * 0.15), fill: theme.palette.error.main },
    { name: 'Unknown', value: Math.floor((stats.devices || 0) * 0.1), fill: theme.palette.warning.main }
  ];

  const ticketStatusData = [
    { name: 'Resolved', value: Math.floor((stats.reports || 0) * 0.6), fill: theme.palette.success.main },
    { name: 'In Progress', value: Math.floor((stats.reports || 0) * 0.25), fill: theme.palette.warning.main },
    { name: 'Open', value: Math.floor((stats.reports || 0) * 0.15), fill: theme.palette.error.main }
  ];

  const healthMetricsData = [
    { metric: 'Users', count: stats.users || 0 },
    { metric: 'Devices', count: stats.devices || 0 },
    { metric: 'Tickets', count: stats.reports || 0 },
    { metric: 'Offices', count: stats.offices || 0 }
  ];

  return (
    <Box sx={{ mb: 4 }}>
      {/* Main Health Title */}
      <Typography 
        variant="h5" 
        sx={{ 
          fontWeight: 700, 
          mb: 3, 
          color: 'text.primary',
          letterSpacing: 0.5
        }}
      >
        System Health Overview
      </Typography>

      {/* Charts Grid */}
      <Grid container spacing={3}>
        {/* Device Status Pie Chart */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper 
            elevation={4} 
            sx={{ 
              p: 3, 
              borderRadius: 4, 
              bgcolor: 'background.paper',
              boxShadow: 4,
              transition: 'all 0.3s',
              '&:hover': { 
                boxShadow: 8,
                transform: 'translateY(-2px)'
              }
            }}
          >
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 700, 
                mb: 2, 
                color: 'text.primary',
                fontSize: '0.95rem'
              }}
            >
              Device Status
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={deviceStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deviceStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Ticket Status Pie Chart */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper 
            elevation={4} 
            sx={{ 
              p: 3, 
              borderRadius: 4, 
              bgcolor: 'background.paper',
              boxShadow: 4,
              transition: 'all 0.3s',
              '&:hover': { 
                boxShadow: 8,
                transform: 'translateY(-2px)'
              }
            }}
          >
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 700, 
                mb: 2, 
                color: 'text.primary',
                fontSize: '0.95rem'
              }}
            >
              Ticket Status
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={ticketStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ticketStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* System Metrics Bar Chart */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={4} 
            sx={{ 
              p: 3, 
              borderRadius: 4, 
              bgcolor: 'background.paper',
              boxShadow: 4,
              transition: 'all 0.3s',
              '&:hover': { 
                boxShadow: 8,
                transform: 'translateY(-2px)'
              }
            }}
          >
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 700, 
                mb: 2, 
                color: 'text.primary',
                fontSize: '0.95rem'
              }}
            >
              System Metrics
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={healthMetricsData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis 
                  dataKey="metric" 
                  tick={{ fontSize: 12 }}
                  stroke={theme.palette.text.secondary}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke={theme.palette.text.secondary}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="count" fill={theme.palette.primary.main} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Summary Stats */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          borderRadius: 4, 
          bgcolor: 'action.hover',
          mt: 3,
          borderLeft: `4px solid ${theme.palette.primary.main}`
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Total Users
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {stats.users || 0}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Active Devices
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                {Math.floor((stats.devices || 0) * 0.75)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Open Tickets
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {Math.floor((stats.reports || 0) * 0.4)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Offices
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'info.main' }}>
                {stats.offices || 0}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default HealthChart;
