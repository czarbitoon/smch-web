import React, { useState, useEffect } from 'react'; // eslint-disable-line no-unused-vars

import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Chip,
  Box,
  Button // eslint-disable-line no-unused-vars
} from '@mui/material';

import axios from 'axios';

function ViewReports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/reports')
      .then((response) => {
        setReports(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        View Reports
      </Typography>
      
      <Grid container spacing={3}>
        {reports.map((report) => (
          <Grid item xs={12} sm={6} md={4} key={report.id}>
            <Card sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-2px)',
                transition: 'all 0.3s ease'
              }
            }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2
                }}>
                  <Typography variant="h6" component="h2">
                    {report.title}
                  </Typography>
                  <Chip 
                    label={report.resolved_by ? "Resolved" : "Pending"}
                    color={report.resolved_by ? "success" : "warning"}
                    size="small"
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {report.description}
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" display="block">
                    Reported by: {report.user?.name || 'Unknown'}
                  </Typography>
                  {report.resolved_by && (
                    <Typography variant="caption" display="block">
                      Resolved by: {report.resolved_by_user?.name || 'Unknown'}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default ViewReports;
