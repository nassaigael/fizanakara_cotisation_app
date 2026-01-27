import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
    // AJOUT DE /api POUR CORRESPONDRE AU BACKEND
    baseURL: 'https://fizanakara-cotisation-app.onrender.com', 
    headers: {
        'Content-Type': 'application/json',
    },
});

// axios.config.ts
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    
    // Debug pour voir ce qui est envoyé (à retirer après)
    console.log("Request URL:", config.url, "Token present:", !!token);

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
api.interceptors.response.use(
    (res) => res,
    (error) => {
        // ON NE REDIRIGE PLUS AVEC window.location ICI
        // C'est le AuthContext qui doit gérer la session
        if (error.response?.status === 401) {
            localStorage.clear();
            toast.error("Session expirée");
        }
        return Promise.reject(error);
    }
);

export default api;