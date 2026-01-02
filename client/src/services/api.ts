import axios from 'axios';


const api = axios.create({
  baseURL: '/api', // Correspond au proxy Vite vers ton Backend Java (ex: http://localhost:8080/api)
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Sécurité : annule la requête après 10s si le serveur ne répond pas
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

// INTERCEPTEUR DE RÉPONSE : Gestion centralisée des erreurs (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si le token est expiré ou invalide
    if (error.response?.status === 401) {
      const url = error.config?.url || "";
      
      // On évite de déconnecter si une requête mineure (chargement de listes) échoue
      const skipRedirect = url.includes('districts') || url.includes('tributes');

      if (!skipRedirect) {
        console.warn("Session expirée, redirection vers la page de connexion...");
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        // Redirection brutale mais nécessaire pour vider tous les caches/states
        window.location.href = '/'; 
      }
    }
    
    // Gestion des erreurs réseau
    if (!error.response) {
      console.error("Erreur Réseau : Le serveur Java est-il démarré ?");
    }

    return Promise.reject(error);
  }
);

export default api;