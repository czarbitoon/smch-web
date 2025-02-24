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
  Paper,
  Button,
  Stack
} from '@mui/material';
import AddReport from './AddReport';
import axios from '../axiosInstance';
import { AuthContext } from '../context/AuthProvider';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 500 }}>
          Reports
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsAddModalOpen(true)}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            px: 3,
            py: 1,
            borderRadius: 1.5
          }}
        >
          Add Report
        </Button>
      </Stack>
      <Box sx={{ mt: 2 }}>
        <List sx={{ '& .MuiListItem-root': { px: 0, py: 1 } }}>
          {reports.map(report => (
            <ListItem key={report.id}>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 3, 
                  width: '100%',
                  borderRadius: 2,
                  '&:hover': {
                    boxShadow: 2
                  }
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 500 }}>
                      {report.title}
                    </Typography>
                  }
                  secondary={
                    <Stack spacing={1} sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Generated on: {new Date(report.created_at).toLocaleDateString()}
                      </Typography>
                      {report.user && (
                        <Typography variant="body2" color="text.secondary">
                          Reported by: {report.user.name}
                        </Typography>
                      )}
                      {report.office && (
                        <Typography variant="body2" color="text.secondary">
                          Office: {report.office.name}
                        </Typography>
                      )}
                    </Stack>
                  }
                />
              </Paper>
            </ListItem>
          ))}
        </List>
      </Box>
      <AddReport
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          setIsAddModalOpen(false);
          fetchReports();
        }}
      />
    </Container>
  );
};

export default Reports;
