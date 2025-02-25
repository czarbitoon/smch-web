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
    BASE: '/devices',
    GET_ALL: '/devices',
    GET_ONE: (id) => `/devices/${id}`,
    CREATE: '/devices',
    UPDATE: (id) => `/devices/${id}`,
    DELETE: (id) => `/devices/${id}`
  },
  OFFICES: {
    BASE: '/offices',
    GET_ALL: '/offices',
    GET_ONE: (id) => `/offices/${id}`,
    CREATE: '/offices',
    UPDATE: (id) => `/offices/${id}`,
    DELETE: (id) => `/offices/${id}`
  },
  REPORTS: {
    BASE: '/reports',
    GET_ALL: '/reports',
    GET_ONE: (id) => `/reports/${id}`,
    CREATE: '/reports',
    UPDATE: (id) => `/reports/${id}`,
    DELETE: (id) => `/reports/${id}`
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
