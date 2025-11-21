import api from "./axios";

// Ensure Sanctum CSRF cookie is set before making auth requests
export const getCsrf = async () => {
  return api.get('/sanctum/csrf-cookie');
};

export const login = async (email, password) => {
  // request CSRF cookie first
  await getCsrf();
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
  await getCsrf();
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