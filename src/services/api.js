// src/services/api.js

import axios from '../axiosInstance';

// User related API calls
export const userService = {
  getProfile: () => axios.get('/profile'),
  updateProfile: (data) => axios.put('/profile', data),
  logout: () => axios.post('/logout')
};

// Device related API calls
export const deviceService = {
  getAllDevices: () => axios.get('/api/devices'),
  addDevice: (data) => axios.post('/api/devices', data),
  updateDevice: (id, data) => axios.put(`/api/devices/${id}`, data),
  deleteDevice: (id) => axios.delete(`/api/devices/${id}`)
};

// Office related API calls
export const officeService = {
  getAllOffices: () => axios.get('/api/offices'),
  addOffice: (data) => axios.post('/api/offices', data),
  updateOffice: (id, data) => axios.put(`/api/offices/${id}`, data),
  deleteOffice: (id) => axios.delete(`/api/offices/${id}`)
};

// Report related API calls
export const reportService = {
  getAllReports: () => axios.get('/api/reports'),
  addReport: (data) => axios.post('/api/reports', data),
  updateReport: (id, data) => axios.put(`/api/reports/${id}`, data),
  deleteReport: (id) => axios.delete(`/api/reports/${id}`)
};
