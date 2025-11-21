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

export default api;
