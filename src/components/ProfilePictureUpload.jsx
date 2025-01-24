// src\components\ProfilePictureUpload.jsx

import React, { useState } from 'react';
import { Button, Box, Avatar } from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function ProfilePictureUpload() {
  const { user, updateProfilePicture } = React.useContext(AuthContext);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('profile_picture', file);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/profile/upload-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      console.log('Upload Response:', response.data);
      updateProfilePicture(response.data.profile_picture);
      alert('Profile picture uploaded successfully!');
    } catch (error) {
      console.error('Upload Error:', error.response ? error.response.data : error.message);
      alert('Failed to upload profile picture.');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Avatar
        src={user.profile_picture ? `http://127.0.0.1:8000/storage/${user.profile_picture}` : 'https://via.placeholder.com/150'}
        sx={{ width: 100, height: 100 }}
      />
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <Button variant="contained" onClick={handleUpload}>
        Upload
      </Button>
    </Box>
  );
}

export default ProfilePictureUpload;