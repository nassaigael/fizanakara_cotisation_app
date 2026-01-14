import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { AiOutlineMail, AiOutlineLock } from 'react-icons/ai';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { useLogin } from '../hooks/useLogin';
import { useAuth } from '../context/useAuth';
import { THEME } from '../styles/theme';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth(); 
  const { 
    email, setEmail, password, setPassword, 
    loading, message, handleLogin
  } = useLogin();

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  useEffect(() => {
    if (token) {
      navigate('/admin/dashboard'); 
    }
  }, [token, navigate]);
  useEffect(() => {
    if (message) setIsAlertOpen(true);
  }, [message]);
  return (
    <div className="bg-brand-bg min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-brand-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-brand-primary/5 rounded-full blur-3xl animate-pulse delay-700" />
      <div className="w-full max-w-md bg-white rounded-[2.5rem] border-2 border-brand-border border-b-8 p-8 sm:p-12 shadow-2xl z-10 transition-all">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-primary rounded-3xl border-b-4 border-brand-primary-dark mb-6">
            <AiOutlineLock className="text-white text-4xl" />
          </div>
          <h1 className={`text-3xl ${THEME.font.black} text-brand-text tracking-tight uppercase leading-none`}>
            Connexion
          </h1>
          <p className="text-[10px] font-bold text-brand-muted mt-3 tracking-[0.2em] uppercase opacity-60">
            Fizanakara Cotisation • Secure Access
          </p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <Input 
            name="email"
            label="Email Professionnel" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@fizanakara.mg"
            icon={<AiOutlineMail size={20}/>}
          />
          <div className="space-y-2">
            <Input 
              name="password"
              label="Mot de passe" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={<AiOutlineLock size={20}/>}
            />
            <div className="flex justify-end px-1">
              <Link to="/forgot-password" university-none className="text-[10px] font-black text-brand-primary uppercase hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>
          </div>

          <Button type="submit" className="w-full py-5 text-[12px] mt-4" disabled={loading}>
            {loading ? "AUTHENTIFICATION..." : "ACCÉDER AU PANEL"}
          </Button>
        </form>
      </div>
      <Alert 
        isOpen={isAlertOpen} 
        title="Système"
        message={message?.text || ""} 
        variant={message?.type === 'success' ? 'success' : 'danger'} 
        onClose={() => setIsAlertOpen(false)}
      />
    </div>
  );
};

export default Login;