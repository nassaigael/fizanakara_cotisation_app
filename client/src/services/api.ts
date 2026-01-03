import axios from 'axios';
// encoder tous les trafics pour la securité
const api = axios.create({
  baseURL: '/api', 
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
  const token = localStorage.getItem('accessToken'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        try {
          const res = await axios.post('http://localhost:8080/refresh', { refreshToken });
          const { accessToken } = res.data;
          localStorage.setItem('accessToken', accessToken); 
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.clear();
          window.location.href = '/';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;