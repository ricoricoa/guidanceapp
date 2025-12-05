import api from "./axios";

// Ensure Sanctum CSRF cookie is set before making auth requests
export const getCsrf = async () => {
  try {
    return api.get('/sanctum/csrf-cookie');
  } catch (error) {
    console.warn('CSRF cookie endpoint not available, continuing without it', error.message);
    return null;
  }
};

export const login = async (email, password) => {
  // Try to request CSRF cookie first (optional for token-based auth)
  try {
    await getCsrf();
  } catch (error) {
    console.warn('CSRF cookie request failed, continuing with login', error.message);
  }
  
  const response = await api.post('/api/login', { email, password });
  
  // Store token if received
  if (response.data.data?.token) {
    console.log('Login: Received token, storing...');
    localStorage.setItem('authToken', response.data.data.token);
    // Set default header for future requests
    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
    console.log('Login: Token set in headers');
  } else {
    console.log('Login: No token in response', response.data);
  }
  
  return response;
};

export const register = async (data) => {
  try {
    await getCsrf();
  } catch (error) {
    console.warn('CSRF cookie request failed, continuing with registration', error.message);
  }
  
  return api.post('/api/register', data);
};

export const getUser = async () => {
  // prefer v1 namespaced user endpoint so frontend uses same API prefix
  return api.get('/api/v1/user');
};

export const logout = async () => {
  const response = await api.post('/api/logout');
  
  // Clear token on logout
  localStorage.removeItem('authToken');
  delete api.defaults.headers.common['Authorization'];
  
  return response;
};

export const getCars = async () => {
  return api.get('/api/v1/cars');
};

// Initialize auth header from storage on page load
export const initializeAuth = () => {
  const token = localStorage.getItem('authToken');
  if (token) {
    console.log('InitializeAuth: Found token in storage, setting headers');
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    console.log('InitializeAuth: No token found in storage');
  }
};

export const verifyEmail = async (email, code) => {
  try {
    const response = await api.post('/api/verify-email', { email, code });
    // store token if provided
    if (response.data.data?.token) {
      localStorage.setItem('authToken', response.data.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
    }
    return response;
  } catch (error) {
    throw error;
  }
};

export const resendVerification = async (email) => {
  return api.post('/api/resend-verification', { email });
};

export const sendPasswordReset = async (email) => {
  return api.post('/api/password/forgot', { email });
};

export const resetPassword = async ({ token, email, password, password_confirmation }) => {
  return api.post('/api/password/reset', { token, email, password, password_confirmation });
};