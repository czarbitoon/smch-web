import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: true, // Include cookies for CSRF protection
  timeout: 30000, // Set timeout to 30 seconds
  validateStatus: (status) => status >= 200 && status < 500, // Handle HTTP errors in interceptors
});

// Add a response interceptor for error handling and response validation
axiosInstance.interceptors.response.use(
  (response) => {
    // Validate successful responses
    if (response.status >= 200 && response.status < 300) {
      // Check if response has expected structure
      if (response.data === null || response.data === undefined) {
        console.warn('Empty response received');
        return { data: null, success: true };
      }
      
      // Return the response directly
      return response;
    }
    
    // For 4xx errors that weren't rejected by axios
    if (response.status >= 400 && response.status < 500) {
      const errorMessage = response.data?.message || `Request failed with status: ${response.status}`;
      console.error(`API Error: ${errorMessage}`);
      return Promise.reject({
        response,
        message: errorMessage
      });
    }
    
    return response;
  },
  (error) => {
    // Network errors or request cancellation
    if (!error.response) {
      // Check if it's a timeout error
      if (error.code === 'ECONNABORTED') {
        console.error('Request timeout:', error.message);
        return Promise.reject({
          message: 'Request timed out. Please try again.',
          originalError: error
        });
      }
      
      console.error('Network Error:', error.message);
      return Promise.reject({
        message: 'Network error. Please check your internet connection.',
        originalError: error
      });
    }
    
    // Handle specific HTTP status codes
    switch (error.response.status) {
      case 401:
        // Handle unauthorized access
        console.warn('Authentication error: User not authenticated');
        localStorage.removeItem('token');
        
        // Only redirect if not already on login page to prevent infinite loops
        if (window.location.pathname !== '/login') {
          // Use replace to prevent back button issues
          window.location.replace('/login');
        }
        break;
      case 403:
        console.error('Permission denied');
        break;
      case 404:
        console.error(`Resource not found: ${error.config.url}`);
        break;
      case 422:
        console.error('Validation failed:', error.response.data?.errors || error.response.data);
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        console.error(`Server error (${error.response.status}):`, error.response.data);
        break;
      default:
        console.error(`API Error (${error.response.status}):`, error.response.data);
    }
    
    // Format error message for UI display
    const errorMessage = error.response.data?.message || 
                        `Request failed with status: ${error.response.status}`;
    
    return Promise.reject({
      ...error,
      userMessage: errorMessage
    });
  }
);

// Add a request interceptor to include the token in headers
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Add CSRF token if available (for Laravel)
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (csrfToken) {
      config.headers['X-CSRF-TOKEN'] = csrfToken;
    }
    
    // Log outgoing requests in development
    if (import.meta.env.DEV) {
      console.debug(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('Request configuration error:', error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
