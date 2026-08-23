import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial for CSRF and secure cookie support
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest' // Helps prevent CSRF
  },
  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config) => {
    // Add CSRF token to headers if it exists in cookies
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };
    
    const csrfToken = getCookie('xsrfToken');
    if (csrfToken) {
      config.headers['X-XSRF-TOKEN'] = csrfToken;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // API Security: Handle 401/403 dynamically to clear stale tokens
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('adminUser');
      if (window.location.pathname !== '/admin/login' && window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export default apiClient;

