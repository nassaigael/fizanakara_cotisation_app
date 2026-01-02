import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';

export const usePasswordLogic = () => {
  const [searchParams] = useSearchParams();
  const [isResetMode, setIsResetMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'warning' } | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) setIsResetMode(true);
  }, [searchParams]);

  const handleRequestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/forgot-password', { email });
      setMessage({ text: "Lien envoyé ! Vérifiez votre boîte mail.", type: 'success' });
    } catch (err) {
      setMessage({ text: "Compte introuvable ou erreur serveur.", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage({ text: "Les mots de passe ne correspondent pas.", type: 'warning' });
      return;
    }
    setLoading(true);
    try {
      const token = searchParams.get('token');
      await api.post('/reset-password', { token, newPassword: password });
      setMessage({ text: "Mot de passe modifié avec succès !", type: 'success' });
    } catch (err) {
      setMessage({ text: "Le lien est invalide ou a expiré.", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return { isResetMode, email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, loading, message, handleRequestEmail, handleResetPassword };
};