// src/components/Profile.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  CalendarToday,
  Security,
  Edit,
  CameraAlt,
  Save,
  Cancel,
} from '@mui/icons-material';
import axios from '../axiosInstance';
import { format } from 'date-fns';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/profile');
        const userData = response.data.user || response.data;
        setUser(userData);
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
        });
        if (userData.profile_picture) {
          setPreviewUrl(`${import.meta.env.VITE_API_BASE_URL}/storage/${userData.profile_picture}`);
        }
      } catch (error) {
        setError('Failed to load profile data');
        console.error('Profile fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setImageDialogOpen(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      if (image) {
        formDataToSend.append('profile_picture', image);
      }

      const response = await axios.post('/api/profile/update', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUser(response.data.user);
      setIsEditing(false);
      setImage(null);
      if (response.data.user.profile_picture) {
        setPreviewUrl(`${import.meta.env.VITE_API_BASE_URL}/storage/${response.data.user.profile_picture}`);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setImage(null);
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    if (user?.profile_picture) {
      setPreviewUrl(`${import.meta.env.VITE_API_BASE_URL}/storage/${user.profile_picture}`);
    } else {
      setPreviewUrl('');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={previewUrl}
                sx={{ width: 120, height: 120 }}
              >
                {!previewUrl && <Person sx={{ fontSize: 60 }} />}
              </Avatar>
              {isEditing && (
                <IconButton
                  onClick={() => setImageDialogOpen(true)}
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  }}
                >
                  <CameraAlt />
                </IconButton>
              )}
            </Box>
            <Typography variant="h4" component="h1" sx={{ mt: 2 }}>
              {user?.name}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {user?.email}
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
              disabled={!isEditing}
            />
            <TextField
              fullWidth
              label="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              margin="normal"
              disabled={!isEditing}
            />
            <TextField
              fullWidth
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              margin="normal"
              disabled={!isEditing}
            />

            {isEditing ? (
              <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  startIcon={<Cancel />}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                </Button>
              </Box>
            ) : (
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setIsEditing(true)}
                sx={{ mt: 3 }}
              >
                Edit Profile
              </Button>
            )}
          </Box>

          <Divider sx={{ my: 4 }} />

          <List>
            <ListItem>
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              <ListItemText
                primary="Role"
                secondary={user?.role || 'User'}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CalendarToday />
              </ListItemIcon>
              <ListItemText
                primary="Member Since"
                secondary={user?.created_at ? format(new Date(user.created_at), 'MMM d, y') : 'Unknown'}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Security />
              </ListItemIcon>
              <ListItemText
                primary="Last Login"
                secondary={user?.last_login ? format(new Date(user.last_login), 'MMM d, y h:mm a') : 'Unknown'}
              />
            </ListItem>
          </List>
        </Paper>
      </Box>

      <Dialog open={imageDialogOpen} onClose={() => setImageDialogOpen(false)}>
        <DialogTitle>Change Profile Picture</DialogTitle>
        <DialogContent>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
            id="profile-image-input"
          />
          <label htmlFor="profile-image-input">
            <Button
              variant="contained"
              component="span"
              startIcon={<CameraAlt />}
              fullWidth
            >
              Choose Image
            </Button>
          </label>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;