import api from "./axios";

// Ensure Sanctum CSRF cookie is set before making auth requests
export const getCsrf = async () => {
  return api.get('/sanctum/csrf-cookie');
};

export const login = async (email, password) => {
  // request CSRF cookie first (sets session cookie)
  await getCsrf();
  return api.post('/api/login', { email, password });
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
  await api.post('/api/logout');
};

export const getCars = async () => {
  return api.get('/api/v1/cars');
};