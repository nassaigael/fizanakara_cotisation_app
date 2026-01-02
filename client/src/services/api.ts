import axios from 'axios';

const api = axios.create({
  // ✅ CORRECTION : On retire '/api' car les contrôleurs de ton ami ne l'utilisent pas
  baseURL: 'http://localhost:8080', 
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// INTERCEPTEUR DE REQUÊTE : Injection du Token
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

// INTERCEPTEUR DE RÉPONSE
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Gestion de l'expiration du token (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refreshToken'); // Ton ami a prévu ça !
      
      if (refreshToken) {
        try {
          // Appel au endpoint /refresh de ton ami
          const res = await axios.post('http://localhost:8080/refresh', { refreshToken });
          const { accessToken } = res.data;

          localStorage.setItem('token', accessToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          
          return api(originalRequest);
        } catch (refreshError) {
          // Si le refresh token est aussi expiré
          localStorage.clear();
          window.location.href = '/';
        }
      } else {
        localStorage.clear();
        window.location.href = '/';
      }
    }
    
    // Message d'erreur clair si le serveur Spring Boot est éteint
    if (!error.response) {
      alert("Le serveur Backend n'est pas démarré (Port 8080)");
    }

    return Promise.reject(error);
  }
);

export default api;