import React, { useState, useEffect } from 'react';
import { AiOutlineMail, AiOutlineLock, AiOutlineArrowLeft } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert'; 
import { usePasswordLogic } from '../hooks/usePasswordLogic';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { 
    isResetMode, email, setEmail, password, setPassword, 
    confirmPassword, setConfirmPassword, loading, message,
    handleRequestEmail, handleResetPassword 
  } = usePasswordLogic();

  const [isAlertOpen, setIsAlertOpen] = useState(false);

  // Synchronise l'affichage de l'alerte avec les messages du hook
  useEffect(() => {
    if (message) setIsAlertOpen(true);
  }, [message]);

  const handleAlertConfirm = () => {
    setIsAlertOpen(false);
    // Redirige vers le login uniquement en cas de succès de réinitialisation
    if (message?.type === 'success' && isResetMode) {
      navigate('/');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col items-center justify-center p-4">
      {/* Animation d'entrée pour un effet fluide */}
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-300">
        
        {/* Lien retour : cohérence avec le path racine '/' du Login */}
        <Link to="/" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-red-600 mb-8 transition-colors group">
          <AiOutlineArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
          Retour à la connexion
        </Link>

        <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
          {isResetMode ? "Nouveau mot de passe" : "Mot de passe oublié ?"}
        </h1>
        <p className="text-gray-500 text-sm mb-10 font-medium">
          {isResetMode 
            ? "Veuillez saisir votre nouveau mot de passe sécurisé." 
            : "Entrez votre email pour recevoir un lien de réinitialisation par courrier électronique."}
        </p>

       <form onSubmit={isResetMode ? handleResetPassword : handleRequestEmail} className="space-y-6">
          {!isResetMode ? (
            <Input 
              label="Adresse Email" 
              type="email" 
              placeholder="votre@email.mg"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              icon={<AiOutlineMail className="text-gray-400" size={20}/>}
            />
          ) : (
            <>
              <Input 
                label="Nouveau mot de passe" 
                type="password" 
                placeholder="••••••••"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                icon={<AiOutlineLock className="text-gray-400" size={20}/>}
              />
              <Input 
                label="Confirmer le mot de passe" 
                type="password" 
                placeholder="••••••••"
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                icon={<AiOutlineLock className="text-gray-400" size={20}/>}
              />
            </>
          )}

          <Button 
            type="submit" 
            className="w-full py-4" 
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Traitement...
              </span>
            ) : (
              isResetMode ? "Changer le mot de passe" : "Envoyer le lien"
            )}
          </Button>
        </form>
      </div>

      <footer className="mt-8 text-gray-400 text-xs font-medium">
        &copy; 2025 Fizanakara Administration
      </footer>

      <Alert 
        isOpen={isAlertOpen}
        title={message?.type === 'success' ? "Succès" : "Attention"}
        message={message?.text || ""}
        variant={message?.type === 'success' ? 'success' : 'warning'} 
        onClose={() => setIsAlertOpen(false)}
        onConfirm={handleAlertConfirm}
        confirmText={isResetMode && message?.type === 'success' ? "Aller au Login" : "Compris"}
      />
    </div>
  );
};

export default ForgotPassword;