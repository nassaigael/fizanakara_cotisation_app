import { useState } from 'react';
import api from '../services/api';

export const usePasswordLogic = () => {
    const [isResetMode, setIsResetMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    const handleRequestEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setMessage({ text: "Veuillez entrer votre email", type: 'error' });
            return;
        }
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setMessage({ text: "Un lien de récupération a été envoyé à votre adresse.", type: 'success' });
        } catch (err: any) {
            setMessage({ text: "Email inconnu ou erreur serveur", type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) {
            setMessage({ text: "Le mot de passe doit contenir 6 caractères min.", type: 'error' });
            return;
        }
        if (password !== confirmPassword) {
            setMessage({ text: "Les mots de passe ne correspondent pas.", type: 'error' });
            return;
        }
        
        setLoading(true);
        try {
            await api.post('/auth/reset-password', { email, newPassword: password });
            setMessage({ text: "Mot de passe modifié avec succès ! Redirection...", type: 'success' });
        } catch (err: any) {
            setMessage({ text: "Échec de la modification. Lien expiré ?", type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return {
        isResetMode, setIsResetMode, email, setEmail, password, setPassword,
        confirmPassword, setConfirmPassword, loading, message,
        handleRequestEmail, handleResetPassword
    };
};