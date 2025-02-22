// src/components/Reports.jsx
import React, { useState, useEffect, useContext } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  CircularProgress,
  Snackbar,
  Paper
} from '@mui/material';
import axios from '../axiosInstance';
import { AuthContext } from '../context/AuthProvider';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchReports();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchReports, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      // If not admin/staff, only show reports from user's office
      if (user?.type < 1) {
        params.append('office_id', user.office_id);
      }

      const response = await axios.get('/reports', { params });
      setReports(response.data);
    } catch (error) {
      setError('Error fetching reports: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Reports
      </Typography>
      <Box sx={{ marginTop: 4 }}>
        <List>
          {reports.map(report => (
            <ListItem key={report.id}>
              <Paper elevation={2} sx={{ p: 2, width: '100%' }}>
                <ListItemText
                  primary={report.title}
                  secondary={
                    <>
                      Generated on: {new Date(report.created_at).toLocaleDateString()}
                      {report.user && ` | Reported by: ${report.user.name}`}
                      {report.office && ` | Office: ${report.office.name}`}
                    </>
                  }
                />
              </Paper>
            </ListItem>
          ))}
        </List>
      </Box>

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={() => setError('')}
        message={error}
      />
    </Container>
  );
};

export default Reports;
