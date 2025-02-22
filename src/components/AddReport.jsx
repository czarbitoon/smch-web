import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Paper, Stack } from '@mui/material';
import { reportService } from '../services/api';

function AddReport() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (image) {
      formData.append('image', image);
    }

    try {
      await reportService.addReport(formData);
      alert('Report submitted successfully!');
      setTitle('');
      setDescription('');
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Submit Report
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={3}>
            <TextField
              required
              fullWidth
              label="Report Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              required
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Box>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="report-image"
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="report-image">
                <Button variant="outlined" component="span">
                  Upload Image
                </Button>
              </label>
              {imagePreview && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ maxWidth: '100%', maxHeight: '200px' }}
                  />
                </Box>
              )}
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
            >
              Submit Report
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}

export default AddReport;
