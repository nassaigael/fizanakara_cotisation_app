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

  useEffect(() => {
    if (message) setIsAlertOpen(true);
  }, [message]);

  const handleAlertConfirm = () => {
    setIsAlertOpen(false);
    if (message?.type === 'success' && isResetMode) navigate('/login');
  };
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        
        <Link to="/login" className="inline-flex items-center text-sm text-gray-500 hover:text-red-600 mb-6 transition-colors">
          <AiOutlineArrowLeft className="mr-2" /> Retour à la connexion
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {isResetMode ? "Nouveau mot de passe" : "Mot de passe oublié ?"}
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          {isResetMode 
            ? "Veuillez saisir votre nouveau mot de passe sécurisé." 
            : "Entrez votre email pour recevoir un lien de réinitialisation."}
        </p>

       <form onSubmit={isResetMode ? handleResetPassword : handleRequestEmail} className="space-y-6">
          {!isResetMode ? (
            <Input 
              label="Votre Email" 
              type="email" 
              value={email} 
              onChange={handleEmailChange} // Utilisation de la fonction typée
              icon={<AiOutlineMail className="text-gray-400" size={20}/>}
              required 
            />
          ) : (
            <>
              <Input 
                label="Nouveau mot de passe" 
                type="password" 
                value={password} 
                onChange={handlePasswordChange} // Utilisation de la fonction typée
                icon={<AiOutlineLock className="text-gray-400" size={20}/>}
                required 
              />
              <Input 
                label="Confirmer le mot de passe" 
                type="password" 
                value={confirmPassword} 
                onChange={handleConfirmPasswordChange} // Utilisation de la fonction typée
                icon={<AiOutlineLock className="text-gray-400" size={20}/>}
                required 
              />
            </>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Traitement..." : isResetMode ? "Réinitialiser" : "Envoyer le lien"}
          </Button>
        </form>
      </div>
      <Alert 
        isOpen={isAlertOpen}
        title={message?.type === 'success' ? "Succès" : "Attention"}
        message={message?.text || ""}
        variant={message?.type === 'success' ? 'success' : 'warning'} 
        onClose={() => setIsAlertOpen(false)}
        onConfirm={handleAlertConfirm}
        confirmText={isResetMode && message?.type === 'success' ? "Aller au Login" : "OK"}
      />
    </div>
  );
};

export default ForgotPassword;