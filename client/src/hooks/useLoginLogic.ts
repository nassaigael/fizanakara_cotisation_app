import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth"; 

export const useLoginLogic = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
        setError("Veuillez remplir tous les champs");
        return;
    }

    setError(null);
    setLoading(true);

    try {
      await login(email, password, rememberMe);
      navigate("/admin/dashboard");
    } catch (err: any) {
      // On capture l'erreur venant du service ou du serveur
      setError(err.response?.data?.message || err.message || "Identifiants invalides");
    } finally {
      setLoading(false);
    }
  };

  return {
    email, setEmail,
    password, setPassword,
    rememberMe, setRememberMe,
    loading, error,
    handleLogin
  };
};