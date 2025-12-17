import React from 'react';
import { AiOutlineUser, AiOutlineMail, AiOutlineLock } from 'react-icons/ai';
import { Link } from 'react-router-dom'; 
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useLoginLogic } from '../hooks/useLoginLogic';

const Login: React.FC = () => {
  const { 
    email, setEmail, 
    password, setPassword, 
    rememberMe, setRememberMe, 
    loading, error, 
    handleLogin 
  } = useLoginLogic();

  const iconStyle = "text-gray-400"; 


  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-red-100 rounded-full blur-[120px] opacity-60" /> */}
      {/* <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-red-200 rounded-full blur-[120px] opacity-50" /> */}

      <div className="relative z-10 w-full max-w-md p-10 bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/50">
        
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-red-600 to-red-400 rounded-3xl shadow-xl shadow-red-200 mb-6 rotate-3 hover:rotate-0 transition-transform duration-500">
            <AiOutlineUser size={42} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Fizanakara</h1>
          <p className="text-gray-500 font-medium mt-1">Espace Administration</p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-xl animate-bounce-subtle">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            label="Adresse Email"
            placeholder="admin@fizanakara.mg"
            value={email}
            onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setEmail(e.target.value)}
            icon={<AiOutlineMail className="text-gray-400" size={20} />}
          />

          <Input
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setPassword(e.target.value)}
            icon={<AiOutlineLock className="text-gray-400" size={20} />}
          />

          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                className="w-5 h-5 rounded-lg border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="text-sm text-gray-600 group-hover:text-red-600 transition-colors">Rester connecté</span>
            </label>
            <Link to="/forgot_password" className="text-sm font-bold text-red-600 hover:text-red-700">
              Oublié ?
            </Link>
          </div>

          <Button type="submit">
            {loading ? <span className="animate-pulse">Authentification...</span> : "Se connecter"}
          </Button>
        </form>

        <footer className="mt-10 text-center text-sm text-gray-400">
          &copy; 2025 Fizanakara. Tous droits réservés.
        </footer>
      </div>
    </div>
  );
};

export default Login;
