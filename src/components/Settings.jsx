import React, { useState, useContext, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button, Switch, FormControlLabel, Divider, Alert, Snackbar, Paper } from '@mui/material';
import axiosInstance from '../axiosInstance';
import { AuthContext } from '../context/AuthProvider';
import { useThemeMode } from '../context/ThemeContext';

const Settings = () => {
  const { user, setUser } = useContext(AuthContext);
  const { darkMode, setDarkMode } = useThemeMode();
  // Profile info state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // Preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  // Feedback
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await axiosInstance.post('/api/profile/update', { name, email });
      if (res.data && res.data.name && res.data.email) {
        setUser({ ...user, name: res.data.name, email: res.data.email });
        setSuccess('Profile updated!');
      } else {
        setError('Failed to update profile.');
      }
    } catch (err) {
      setError(err.userMessage || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post('/api/password/change', {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });
      setSuccess('Password changed!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.userMessage || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrefChange = (setter) => (e) => setter(e.target.checked);

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h4" fontWeight={900} mb={3} color="primary">Settings</Typography>
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {/* Profile Info */}
        <Typography variant="h6" fontWeight={700} mb={1}>Profile Information</Typography>
        <Box component="form" onSubmit={handleProfileUpdate} sx={{ mb: 3 }}>
          <TextField label="Name" fullWidth margin="normal" value={name} onChange={e => setName(e.target.value)} />
          <TextField label="Email" fullWidth margin="normal" value={email} onChange={e => setEmail(e.target.value)} />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 1 }} disabled={loading}>Update Profile</Button>
        </Box>
        <Divider sx={{ my: 3 }} />
        {/* Change Password */}
        <Typography variant="h6" fontWeight={700} mb={1}>Change Password</Typography>
        <Box component="form" onSubmit={handlePasswordChange} sx={{ mb: 3 }}>
          <TextField label="Current Password" type="password" fullWidth margin="normal" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
          <TextField label="New Password" type="password" fullWidth margin="normal" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
          <TextField label="Confirm New Password" type="password" fullWidth margin="normal" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
          <Button type="submit" variant="contained" color="secondary" sx={{ mt: 1 }} disabled={loading}>Change Password</Button>
        </Box>
        <Divider sx={{ my: 3 }} />
        {/* Preferences */}
        <Typography variant="h6" fontWeight={700} mb={1}>Preferences</Typography>
        <FormControlLabel control={<Switch checked={darkMode} onChange={(_, checked) => setDarkMode(checked)} />} label="Dark Mode" />
        <FormControlLabel control={<Switch checked={emailNotifications} onChange={handlePrefChange(setEmailNotifications)} />} label="Email Notifications" />
        <Divider sx={{ my: 3 }} />
        {/* Placeholder for more settings */}
        <Typography variant="body2" color="text.secondary">More settings coming soon...</Typography>
      </Paper>
      <Snackbar open={!!success || !!error} autoHideDuration={3000} onClose={() => { setSuccess(''); setError(''); }} />
    </Container>
  );
};

export default Settings;
