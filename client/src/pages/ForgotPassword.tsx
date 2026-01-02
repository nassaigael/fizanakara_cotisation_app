import React, { useState, useEffect, memo } from 'react';
import { 
  AiOutlineMail, AiOutlineLock, AiOutlineArrowLeft, 
  AiOutlinePhone, AiOutlineSecurityScan 
} from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert'; 
import { usePasswordLogic } from '../hooks/usePasswordLogic';
import { THEME } from '../styles/theme';

/**
 * ForgotPassword Page - Gère le cycle de récupération de compte.
 * Phase 1: Envoi d'email | Phase 2: Reset mot de passe + Profil.
 */
const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { 
    isResetMode, email, setEmail, password, setPassword, 
    confirmPassword, setConfirmPassword, loading, message,
    handleRequestEmail, handleResetPassword 
  } = usePasswordLogic();

  // On peut lier ces états au hook de logique si nécessaire pour la persistance
  const [profile, setProfile] = useState({ firstName: "", lastName: "", phone: "" });
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
      
      {/* Background Decor (Subtil pour ne pas distraire) */}
      <div className="absolute top-0 left-0 w-full h-1 bg-brand-primary/20" />
      
      <div className={`w-full ${isResetMode ? 'max-w-2xl' : 'max-w-md'} bg-white ${THEME.card} p-8 md:p-10 animate-in fade-in zoom-in-95 duration-500 relative`}>
        
        {/* Navigation Retour */}
        <Link to="/" className={`inline-flex items-center ${THEME.font.black} text-[10px] text-brand-muted hover:text-brand-primary mb-8 transition-all group tracking-widest uppercase`}>
          <AiOutlineArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={16} /> 
          Retour à la connexion
        </Link>

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-brand-primary/10 rounded-xl text-brand-primary border-2 border-brand-primary border-b-4">
               <AiOutlineSecurityScan size={24} />
             </div>
             <h1 className={`text-3xl ${THEME.font.black} text-brand-text tracking-tighter uppercase leading-none`}>
               {isResetMode ? "Récupération" : "Accès Oublié"}
             </h1>
          </div>
          <p className="text-brand-muted text-[10px] font-black uppercase tracking-wider opacity-70">
            {isResetMode 
              ? "Veuillez définir vos nouveaux identifiants de sécurité." 
              : "Entrez votre email de secours pour réinitialiser votre accès."}
          </p>
        </header>

        <form onSubmit={isResetMode ? handleResetPassword : handleRequestEmail} className="space-y-6">
          {!isResetMode ? (
            /* --- PHASE 1 : IDENTIFICATION --- */
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
            /* --- PHASE 2 : RÉINITIALISATION COMPLÈTE --- */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-right-4 duration-500">
              
              {/* Colonne : Sécurité */}
              <div className="space-y-5">
                <h3 className={`text-[10px] ${THEME.font.black} text-brand-primary uppercase tracking-widest border-b-2 border-brand-bg pb-2`}>
                  Nouveaux Identifiants
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
                  label="Confirmer" 
                  type="password" 
                  placeholder="••••••••"
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  icon={<AiOutlineLock size={20}/>}
                />
              </div>

              {/* Colonne : Profil (Validation visuelle) */}
              <div className="space-y-5 bg-brand-bg/30 p-5 rounded-3xl border-2 border-dashed border-brand-border">
                <h3 className={`text-[10px] ${THEME.font.black} text-brand-muted uppercase tracking-widest mb-2`}>
                  Vérification Profil
                </h3>
                <div className="grid grid-cols-1 gap-4">
                   <Input 
                    label="Prénom" 
                    value={profile.firstName} 
                    onChange={(e) => setProfile({...profile, firstName: e.target.value})} 
                    placeholder="Prénom"
                  />
                   <Input 
                    label="Nom" 
                    value={profile.lastName} 
                    onChange={(e) => setProfile({...profile, lastName: e.target.value})} 
                    placeholder="Nom"
                  />
                </div>
                <Input 
                  label="Contact Mobile" 
                  value={profile.phone} 
                  onChange={(e) => setProfile({...profile, phone: e.target.value})} 
                  placeholder="034 -- --- --"
                  icon={<AiOutlinePhone size={20}/>}
                />
              </div>
            </div>
          )}

          <div className="pt-4">
            <Button type="submit" className="w-full py-5 text-[12px]" disabled={loading}>
              {loading ? "TRAITEMENT..." : (isResetMode ? "ACTUALISER MA SÉCURITÉ" : "OBTENIR LE LIEN DE RÉCUPÉRATION")}
            </Button>
          </div>
        </form>
      </div>

      <Alert 
        isOpen={isAlertOpen}
        title={message?.type === 'success' ? "SYSTÈME ACTUALISÉ" : "ERREUR DE RÉCUPÉRATION"}
        message={message?.text || ""}
        variant={message?.type === 'success' ? 'success' : 'danger'} 
        onClose={() => setIsAlertOpen(false)}
        onConfirm={handleAlertConfirm}
        confirmText="RETOUR AU LOGIN"
      />

      <p className="mt-8 text-[9px] font-black text-brand-muted uppercase tracking-[0.3em] opacity-40">
        Fizanakara Security Core • Antananarivo
      </p>
    </div>
  );
};

export default memo(ForgotPassword);