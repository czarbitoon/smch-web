// src/utils/constants.js

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    LOGOUT: '/logout',
    PROFILE: '/profile'
  },
  DEVICES: {
    BASE: '/api/devices',
    GET_ALL: '/api/devices',
    GET_ONE: (id) => `/api/devices/${id}`,
    CREATE: '/api/devices',
    UPDATE: (id) => `/api/devices/${id}`,
    DELETE: (id) => `/api/devices/${id}`
  },
  OFFICES: {
    BASE: '/api/offices',
    GET_ALL: '/api/offices',
    GET_ONE: (id) => `/api/offices/${id}`,
    CREATE: '/api/offices',
    UPDATE: (id) => `/api/offices/${id}`,
    DELETE: (id) => `/api/offices/${id}`
  },
  REPORTS: {
    BASE: '/api/reports',
    GET_ALL: '/api/reports',
    GET_ONE: (id) => `/api/reports/${id}`,
    CREATE: '/api/reports',
    UPDATE: (id) => `/api/reports/${id}`,
    DELETE: (id) => `/api/reports/${id}`
  }
};

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
  USER: 'user'
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'token',
  USER_DATA: 'user_data'
};

// Error messages
export const ERROR_MESSAGES = {
  AUTH: {
    LOGIN_FAILED: 'Login failed. Please check your credentials.',
    REGISTER_FAILED: 'Registration failed. Please try again.',
    UNAUTHORIZED: 'You are not authorized to access this resource.'
  },
  NETWORK: {
    CONNECTION_ERROR: 'Network connection error. Please try again.',
    SERVER_ERROR: 'Server error. Please try again later.'
  }
};
