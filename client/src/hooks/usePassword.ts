import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthService } from '../services/auth.service';

export const usePassword = () => {
  const [searchParams] = useSearchParams();
  const [isResetMode, setIsResetMode] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // On détecte uniquement si le token est présent pour afficher le formulaire de changement
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setIsResetMode(true);
    } else {
      setIsResetMode(false);
    }
  }, [searchParams]);

  /**
   * PHASE 1 : Demande de lien par Email
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
      // Sécurité : même si l'email n'existe pas, on affiche un message de succès
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
      setMessage({ text: "Le lien est invalide ou a expiré.", type: 'error' });
    } finally { 
        setLoading(false); 
    }
  };

  return { 
    isResetMode, 
    email, setEmail, 
    password, setPassword, 
    confirmPassword, setConfirmPassword, 
    loading, 
    message, 
    handleRequestEmail, 
    handleResetPassword 
  };
};