import axios from 'axios';

let rawBase = import.meta.env.VITE_API_BASE_URL || '/api';
if (rawBase.endsWith('/')) {
  rawBase = rawBase.slice(0, -1);
}
if (rawBase.startsWith('http') && !rawBase.endsWith('/api')) {
  rawBase = `${rawBase}/api`;
}

const api = axios.create({
  baseURL: rawBase,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
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

// Response interceptor to handle unauthenticated 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect on login failure itself
      if (!error.config.url.includes('/auth/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
