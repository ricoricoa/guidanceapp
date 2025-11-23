//npm install axios
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8001',
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
    const token = localStorage.getItem('token');
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
