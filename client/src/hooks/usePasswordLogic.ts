import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api"; // Utilisation de l'instance Axios configurée

export const usePasswordLogic = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
    
    const isResetMode = !!token;

    // 1. Demande d'envoi de l'email de récupération
    const handleRequestEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        setMessage(null);

        try {
            // Correspond à ton endpoint forgot-password au Backend
            await api.post('/auth/forgot-password', { email });
            setMessage({
                type: 'success', 
                text: "Si cet email est enregistré, un lien de réinitialisation vous sera envoyé sous peu."
            });
        } catch (err: any) {
            setMessage({
                type: 'error', 
                text: "Une erreur est survenue. Veuillez réessayer plus tard."
            });
        } finally {
            setLoading(false);
        }
    };

    // 2. Réinitialisation effective avec le token
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password.length < 6) {
            setMessage({type: 'error', text: "Le mot de passe doit contenir au moins 6 caractères."});
            return;
        }

        if (password !== confirmPassword) {
            setMessage({type: 'error', text: "Les mots de passe ne correspondent pas."});
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            // Correspond à ton endpoint reset-password au Backend
            await api.post('/auth/reset-password', { 
                token, 
                newPassword: password 
            });

            setMessage({type: 'success', text: "Mot de passe modifié avec succès ! Redirection..."});
            
            // Redirection vers le login après 2 secondes
            setTimeout(() => navigate('/'), 2000);
        } catch (err: any) {
            setMessage({
                type: 'error', 
                text: err.response?.data?.message || "Le lien est invalide ou a expiré."
            });
        } finally {
            setLoading(false);
        }
    };

    return {
        isResetMode, 
        email, setEmail, 
        password, setPassword, 
        confirmPassword, setConfirmPassword, 
        loading, message,
        handleRequestEmail, 
        handleResetPassword
    };
};