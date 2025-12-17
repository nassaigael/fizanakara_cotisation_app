import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const usePasswordLogic = () => {
    const {token} = useParams();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
    const isResetMode = !!token;
    
    const handleRequestEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
        setMessage({type: 'success', text: "Si cet email existe, un lien a été envoyé."});
        setLoading(false);
        }, 1500);
    };
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
        setMessage({type: 'error', text: "Les mots de passe ne correspondent pas."});
        return;
        }
        setLoading(true);
        setTimeout(() => {
        setMessage({type: 'success', text: "Mot de passe modifié avec succès !"});
        setLoading(false);
        setTimeout(() => navigate('/login'), 2000);
        }, 1500);
    };
    return {
        isResetMode, email, setEmail, password, setPassword, 
        confirmPassword, setConfirmPassword, loading, message,
        handleRequestEmail, handleResetPassword
    };
}