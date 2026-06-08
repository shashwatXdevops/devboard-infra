import axios from 'axios';

// The Nginx container proxies /api to the core-backend container
const api = axios.create({
  baseURL: '/api/v1',
});

// Interceptor to inject the JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Unified Error handler (e.g., catching 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if token is expired/invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
