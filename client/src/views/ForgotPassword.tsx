import React, { useState, useEffect, memo, useMemo } from 'react';
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
import { getImageUrl } from '../lib/constant/constant';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { 
    isResetMode, email, setEmail, password, setPassword, 
    confirmPassword, setConfirmPassword, 
    profile, loading, message,
    handleRequestEmail, handleResetPassword 
  } = usePassword();

  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const previewUrl = useMemo(() => 
    getImageUrl(profile.imageUrl, profile.firstName, 'admin'), 
    [profile.imageUrl, profile.firstName]
  );

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
      
      <div className={`w-full ${isResetMode ? 'max-w-3xl' : 'max-w-md'} bg-white ${THEME.card} p-8 md:p-10 animate-in fade-in zoom-in-95 duration-500 relative`}>
        
        <Link to="/" className={`inline-flex items-center ${THEME.font.black} text-[10px] text-brand-muted hover:text-brand-primary mb-8 transition-all group tracking-widest uppercase`}>
          <AiOutlineArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={16} /> 
          SE CONNECTER
        </Link>

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-brand-primary/10 rounded-xl text-brand-primary border-2 border-brand-primary border-b-4">
               <AiOutlineSecurityScan size={24} />
             </div>
             <h1 className={`text-3xl ${THEME.font.black} text-brand-text tracking-tighter uppercase leading-none`}>
               {isResetMode ? "NOUVEAU MOT DE PASSE" : "MOT DE PASSE OUBLIÉ"}
             </h1>
          </div>
          <p className="text-brand-muted text-[10px] font-black uppercase tracking-wider opacity-70">
            {isResetMode 
              ? "Veuillez définir votre nouvelle mot de passe" 
              : "Entrez votre email de secours pour réinitialiser votre accès."}
          </p>
        </header>

        <form onSubmit={isResetMode ? handleResetPassword : handleRequestEmail} className="space-y-6">
          {!isResetMode ? (
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-right-4 duration-500">
              
              <div className="space-y-6">
                <h3 className={`text-[10px] ${THEME.font.black} text-brand-primary uppercase tracking-widest border-b-2 border-brand-bg pb-2`}>
                  Mise à jour Sécurité
                </h3>
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

              <div className="flex flex-col justify-center items-center p-6 bg-brand-bg/40 rounded-4xl border-2 border-dashed border-brand-border">
                <div className="h-24 w-24 rounded-3xl border-4 border-white shadow-xl overflow-hidden mb-4 rotate-3 group-hover:rotate-0 transition-transform bg-white">
                  <img 
                    src={previewUrl} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${profile.firstName || 'A'}&background=FF4B4B&color=fff`)}
                  />
                </div>
                <div className="text-center">
                  <p className="text-[9px] font-black text-brand-primary uppercase tracking-widest mb-1">Session de</p>
                  <h4 className="text-xl font-black text-brand-text uppercase leading-none">
                    {profile.firstName || "Admin"}
                  </h4>
                  <p className="text-[10px] font-bold text-brand-muted mt-1 opacity-60">ID VERIFIÉ</p>
                </div>
              </div>
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
        title={message?.type === 'success' ? "MODIFICATION ENREGISTRER" : "ERREUR"}
        message={message?.text || ""}
        variant={message?.type === 'success' ? 'success' : 'danger'} 
        onClose={() => setIsAlertOpen(false)}
        onConfirm={handleAlertConfirm}
        confirmText="SE CONNECTER"
      />

      <footer className="mt-8">
        <p className="text-[9px] font-black text-brand-muted uppercase tracking-[0.3em] opacity-40">
          Fizanakara Security Core • Antananarivo
        </p>
      </footer>
    </div>
  );
};

export default memo(ForgotPassword);