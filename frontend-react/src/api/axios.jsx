//npm install axios
import axios from 'axios';

// NOTE: backend dev server typically runs on port 8000 (php artisan serve).
// Update this if you run the backend on a different port.
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  withXSRFToken: true,
});

// Add request interceptor to add token and log requests
api.interceptors.request.use(
  (config) => {
    // Add token from localStorage if available
    // Support both legacy 'token' key and current 'authToken' key
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to log responses and errors
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Response Error:', error.message, error.config?.url, error.response?.status);
    return Promise.reject(error);
  }
);

export default api;
