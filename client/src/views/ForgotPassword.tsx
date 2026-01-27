import React, { useState, useEffect, memo } from 'react';
import { 
  AiOutlineMail, AiOutlineLock, AiOutlineArrowLeft, 
  AiOutlineSecurityScan
} from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/shared/Input';
import Button from '../components/shared/Button';
import Alert from '../components/shared/Alert'; 
import { usePassword } from '../hooks/usePassword';
import { THEME } from '../styles/theme';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { 
    isResetMode, email, setEmail, password, setPassword, 
    confirmPassword, setConfirmPassword, 
    loading, message,
    handleRequestEmail, handleResetPassword 
  } = usePassword();

  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    if (message) setIsAlertOpen(true);
  }, [message]);

  const handleAlertConfirm = () => {
    setIsAlertOpen(false);
    if (message?.type === 'success') navigate('/');
  };

  return (
    <div className="bg-brand-bg min-h-screen flex flex-col items-center justify-center p-4 transition-all duration-500 overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-brand-primary/20" />
      
      <div className={`w-full max-w-md bg-white ${THEME.card} p-8 md:p-10 animate-in fade-in zoom-in-95 duration-500 relative`}>
        
        <Link to="/" className={`inline-flex items-center ${THEME.font.black} text-[10px] text-brand-muted hover:text-brand-primary mb-8 transition-all group tracking-widest uppercase`}>
          <AiOutlineArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={16} /> 
          SE CONNECTER
        </Link>

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-brand-primary/10 rounded-xl text-brand-primary border-2 border-brand-primary border-b-4">
               <AiOutlineSecurityScan size={24} />
             </div>
             <h1 className={`text-2xl ${THEME.font.black} text-brand-text tracking-tighter uppercase leading-none`}>
               {isResetMode ? "NOUVEAU MOT DE PASSE" : "MOT DE PASSE OUBLIÉ"}
             </h1>
          </div>
          <p className="text-brand-muted text-[10px] font-black uppercase tracking-wider opacity-70">
            {isResetMode 
              ? "Veuillez définir votre nouveau mot de passe sécurisé." 
              : "Entrez votre email de secours pour réinitialiser votre accès."}
          </p>
        </header>

        <form onSubmit={isResetMode ? handleResetPassword : handleRequestEmail} className="space-y-6">
          {!isResetMode ? (
            /* --- PHASE 1 : DEMANDE DE LIEN --- */
            <div className="animate-in slide-in-from-bottom-2 duration-300">
              <Input 
                label="Email Administrateur" 
                type="email" 
                placeholder="ex: admin@fizankara.mg"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                icon={<AiOutlineMail size={20}/>}
              />
            </div>
          ) : (
            /* --- PHASE 2 : RÉINITIALISATION (SANS APERÇU PROFIL) --- */
            <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
              <Input 
                label="Nouveau Mot de Passe" 
                type="password" 
                placeholder="••••••••"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                icon={<AiOutlineLock size={20}/>}
              />
              <Input 
                label="Confirmer le Mot de Passe" 
                type="password" 
                placeholder="••••••••"
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                icon={<AiOutlineLock size={20}/>}
              />
            </div>
          )}

          <div className="pt-4">
            <Button type="submit" className="w-full py-5 text-sm font-black tracking-widest" disabled={loading}>
              {loading ? "TRAITEMENT EN COURS..." : (isResetMode ? "SAUVEGARDER" : "RECEVOIR LE LIEN")}
            </Button>
          </div>
        </form>
      </div>

     <Alert 
        isOpen={isAlertOpen}
        title={message?.type === 'success' ? "MODIFICATION ENREGISTRÉE" : "ERREUR"}
        message={message?.text || ""}
        variant={message?.type === 'success' ? 'success' : 'danger'} 
        onClose={() => setIsAlertOpen(false)}
        onConfirm={handleAlertConfirm}
        confirmText="RETOUR À L'ACCUEIL"
      />

      <footer className="mt-8">
        <p className="text-[9px] font-black text-brand-muted uppercase tracking-[0.3em] opacity-40 text-center">
          Fizanakara Security Core • Antananarivo
        </p>
      </footer>
    </div>
  );
};

export default memo(ForgotPassword);