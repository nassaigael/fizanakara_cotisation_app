import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Proxy configuré dans vite.config.ts
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour injecter le token
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

// Intercepteur pour gérer les erreurs 401 (Token expiré)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/'; // Redirection forcée
    }
    return Promise.reject(error);
  }
);

export default api;