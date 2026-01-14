import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';

export const usePasswordLogic = () => {
  const [searchParams] = useSearchParams();
  const [isResetMode, setIsResetMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (searchParams.get('token')) setIsResetMode(true);
  }, [searchParams]);

  const handleRequestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setMessage({ text: "Si ce compte existe, un lien a été envoyé.", type: 'success' });
    } catch (err) {
      setMessage({ text: "Erreur lors de l'envoi de l'email.", type: 'error' });
    } finally { setLoading(false); }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage({ text: "Les mots de passe ne correspondent pas.", type: 'error' });
      return;
    }
    setLoading(true);
    try {
      const token = searchParams.get('token') || "";
      await authService.resetPassword({ token, newPassword: password });
      setMessage({ text: "Mot de passe mis à jour ! Redirection...", type: 'success' });
    } catch (err) {
      setMessage({ text: "Lien invalide ou expiré.", type: 'error' });
    } finally { setLoading(false); }
  };

  return { isResetMode, email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, loading, message, handleRequestEmail, handleResetPassword };
};