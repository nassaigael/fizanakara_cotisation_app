import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { authService } from '../services/authService';
import { LoginSchema } from '../utils/types/schema/Validation.schema';

export const useLogin = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = LoginSchema.safeParse({ email, password });
    if (!validation.success) {
      setMessage({ text: validation.error.issues[0].message, type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      await login(response);
      setMessage({ text: "Connexion réussie !", type: 'success' });
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Identifiants incorrects";
      setMessage({ text: errorMsg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return { email, setEmail, password, setPassword, loading, message, handleLogin };
};