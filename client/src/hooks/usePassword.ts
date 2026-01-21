import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthService } from '../services/auth.service';

export const usePassword = () => {
  const [searchParams] = useSearchParams();
  const [isResetMode, setIsResetMode] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    imageUrl: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Détection du token dans l'URL pour passer en mode "Changement de mot de passe"
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setIsResetMode(true);
      fetchAdminInfo(token);
    }
  }, [searchParams]);

  // Récupération des infos de l'admin via le token pour le Badge visuel
  const fetchAdminInfo = async (token: string) => {
    try {
      const response = await AuthService.verifyResetToken(token);
      if (response && response.data) {
        setProfile({
          firstName: response.data.firstName || "",
          lastName: response.data.lastName || "",
          phone: response.data.phoneNumber || "",
          imageUrl: response.data.imageUrl || ""
        });
      }
    } catch (err) {
      // Échec silencieux pour la sécurité et la fluidité
      console.log("Mode reset activé. Profil non pré-chargé.");
    }
  };

  /**
   * PHASE 1 : Demande de lien par Email
   * Inclut la sécurité anti-énumération
   */
  const handleRequestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
        setMessage({ text: "Veuillez entrer une adresse email.", type: 'error' });
        return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await AuthService.forgotPassword(email);
      
      setMessage({ 
        text: "Si ce compte existe, un lien a été envoyé.", 
        type: 'success' 
      });
    } catch (err: any) {

      if (err.response?.status === 404 || err.response?.status === 400) {
        setMessage({ 
            text: "Si ce compte existe, un lien a été envoyé.", 
            type: 'success' 
          });
      } else {
        setMessage({ text: "Service momentanément indisponible.", type: 'error' });
      }
    } finally { 
        setLoading(false); 
    }
  };

  /**
   * PHASE 2 : Réinitialisation du mot de passe
   */
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage({ text: "Les mots de passe ne correspondent pas.", type: 'error' });
      return;
    }
    if (password.length < 6) {
        setMessage({ text: "Le mot de passe est trop court (min 6).", type: 'error' });
        return;
    }

    setLoading(true);
    try {
      const token = searchParams.get('token') || "";
      await AuthService.resetPassword({ 
        token, 
        newPassword: password 
      });
      
      setMessage({ text: "Mot de passe mis à jour avec succès.", type: 'success' });
    } catch (err) {
      setMessage({ text: "Lien invalide ou expiré.", type: 'error' });
    } finally { 
        setLoading(false); 
    }
  };

  return { 
    isResetMode, 
    email, setEmail, 
    password, setPassword, 
    confirmPassword, setConfirmPassword, 
    profile, setProfile,
    loading, 
    message, 
    handleRequestEmail, 
    handleResetPassword 
  };
};