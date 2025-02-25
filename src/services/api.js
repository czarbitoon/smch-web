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
  getAllDevices: () => axios.get('/devices'),
  addDevice: (data) => axios.post('/devices', data),
  updateDevice: (id, data) => axios.put(`/devices/${id}`, data),
  deleteDevice: (id) => axios.delete(`/devices/${id}`)
};

// Office related API calls
export const officeService = {
  getAllOffices: () => axios.get('/offices'),
  addOffice: (data) => axios.post('/offices', data),
  updateOffice: (id, data) => axios.put(`/offices/${id}`, data),
  deleteOffice: (id) => axios.delete(`/offices/${id}`)
};

// Report related API calls
export const reportService = {
  getAllReports: () => axios.get('/reports'),
  addReport: (data) => axios.post('/reports', data),
  updateReport: (id, data) => axios.put(`/reports/${id}`, data),
  deleteReport: (id) => axios.delete(`/reports/${id}`),
  resolveReport: (id) => axios.post(`/reports/${id}/resolve`)
};
