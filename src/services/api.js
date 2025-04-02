// src/services/api.js

import axios from '../axiosInstance';
import { API_ENDPOINTS } from '../utils/constants';

// User related API calls
export const userService = {
  login: (credentials) => axios.post(API_ENDPOINTS.AUTH.LOGIN, credentials),
  getProfile: () => axios.get(API_ENDPOINTS.AUTH.PROFILE),
  updateProfile: (data) => axios.put(API_ENDPOINTS.AUTH.PROFILE, data),
  logout: () => axios.post(API_ENDPOINTS.AUTH.LOGOUT)
};

// Device related API calls
export const deviceService = {
  getAllDevices: () => axios.get(API_ENDPOINTS.DEVICES.GET_ALL),
  addDevice: (data) => axios.post(API_ENDPOINTS.DEVICES.CREATE, data),
  updateDevice: (id, data) => axios.put(API_ENDPOINTS.DEVICES.UPDATE(id), data),
  deleteDevice: (id) => axios.delete(API_ENDPOINTS.DEVICES.DELETE(id))
};

// Office related API calls
export const officeService = {
  getAllOffices: () => axios.get(API_ENDPOINTS.OFFICES.GET_ALL),
  addOffice: (data) => axios.post(API_ENDPOINTS.OFFICES.CREATE, data),
  updateOffice: (id, data) => axios.put(API_ENDPOINTS.OFFICES.UPDATE(id), data),
  deleteOffice: (id) => axios.delete(API_ENDPOINTS.OFFICES.DELETE(id))
};

// Report related API calls
export const reportService = {
  getAllReports: () => axios.get(API_ENDPOINTS.REPORTS.GET_ALL),
  addReport: (data) => axios.post(API_ENDPOINTS.REPORTS.CREATE, data),
  updateReport: (id, data) => axios.put(API_ENDPOINTS.REPORTS.UPDATE(id), data),
  deleteReport: (id) => axios.delete(API_ENDPOINTS.REPORTS.DELETE(id)),
  resolveReport: (id) => axios.post(`${API_ENDPOINTS.REPORTS.BASE}/${id}/resolve`)
};
