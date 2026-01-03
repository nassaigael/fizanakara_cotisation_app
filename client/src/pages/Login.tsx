import React, { useState, useEffect, memo } from 'react';
import { 
  AiOutlineMail, AiOutlineLock, AiOutlinePhone, 
  AiOutlineCalendar,
} from 'react-icons/ai';
import { Link } from 'react-router-dom'; 
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { useLoginLogic } from '../hooks/useLoginLogic';
import { THEME } from '../styles/theme';

/**
 * Login Page - Gère l'authentification et l'inscription initiale.
 * Inclut des animations CSS personnalisées pour un look moderne.
 */
const Login: React.FC = () => {
  const { 
    isRegister, setIsRegister, email, setEmail, password, setPassword,
    firstName, setFirstName, lastName, setLastName, birthDate, setBirthDate, 
    gender, setGender, phoneNumber, setPhoneNumber, rememberMe, setRememberMe, 
    loading, message, setMessage, handleLogin 
  } = useLoginLogic();

  const [isAlertOpen, setIsAlertOpen] = useState(false);

  // Déclencher l'alerte quand un message d'erreur/succès arrive du hook
  useEffect(() => {
    if (message) setIsAlertOpen(true);
  }, [message]);

  const handleConfirmAlert = () => {
    setIsAlertOpen(false);
    // Si l'inscription a réussi, on bascule automatiquement vers le mode connexion
    if (message?.type === 'success' && isRegister) setIsRegister(false);
    setMessage(null);
  };
  // redondance de code: minimiser le code en gardant le design pour diminuer la taille de l'application pour qu'il ne gaspille pas trop de ressource 
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-brand-bg">
      
      {/* --- BACKGROUND ANIMÉ (Blobs) --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[60vw] h-[60vw] rounded-full bg-brand-primary/5 blur-[100px] animate-blob" />
        <div className="absolute bottom-[0%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-blue-50/50 blur-[120px] animate-blob animation-delay-2000" />
      </div>

      {/* --- CARTE DE CONNEXION --- */}
      <div className={`relative z-10 w-full max-w-lg bg-white/80 backdrop-blur-2xl ${THEME.card} p-10 animate-in fade-in zoom-in-95 duration-500 shadow-2xl border-white/40`}>
        
        <header className="text-center mb-8">
          {/* LOGO INTERACTIF */}
          <div 
            onDoubleClick={() => setIsRegister(!isRegister)} 
            className="relative inline-flex items-center justify-center w-20 h-20 mb-4 cursor-pointer group select-none"
            title="Double-cliquez pour basculer Inscription/Connexion"
          >
             <svg viewBox="0 0 100 100" className="w-full h-full transform group-hover:scale-110 transition-all duration-500 drop-shadow-sm">
                <path 
                    fill="currentColor" 
                    className="text-brand-text"
                    d="M60,20 C42,20 22,38 22,65 C22,86 38,100 58,100 C43,90 38,70 48,50 C58,30 78,25 88,30 C82,20 72,20 60,20 Z" 
                />
                <circle cx="78" cy="42" r="3" className="fill-brand-primary animate-pulse" />
                <circle cx="88" cy="55" r="2" className="fill-brand-primary animate-pulse delay-300" />
             </svg>
          </div>
          
          <h1 className={`text-4xl ${THEME.font.black} text-brand-text uppercase tracking-tighter leading-none`}>
            Fizanakara
          </h1>
          <p className="text-brand-muted font-black text-[10px] uppercase tracking-[0.3em] mt-3 opacity-60">
            {isRegister ? "Nouveau Compte Admin" : "Espace Administration"}
          </p>
        </header>

        <form onSubmit={handleLogin} className="space-y-5">
          {isRegister && (
            <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Prénom" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Jean" />
                <Input label="Nom" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Dupont" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Input label="Naissance" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} icon={<AiOutlineCalendar size={18}/>} />
                <div className="flex flex-col gap-1.5">
                  <label className={`text-[10px] ${THEME.font.black} text-brand-muted uppercase ml-1 tracking-widest`}>Genre</label>
                  <select 
                    value={gender} 
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full h-[58px] px-5 bg-brand-bg border-2 border-brand-border border-t-brand-border-dark rounded-2xl font-bold text-sm outline-none focus:border-brand-primary focus:border-t-brand-primary-dark transition-all appearance-none cursor-pointer"
                  >
                    <option value="MALE">Masculin</option>
                    <option value="FEMALE">Féminin</option>
                  </select>
                </div>
              </div>

              <Input label="Téléphone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="034 00 000 00" icon={<AiOutlinePhone size={18}/>} />
            </div>
          )}

          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} icon={<AiOutlineMail size={18}/>} placeholder="admin@fizankara.mg" />
          <Input label="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} icon={<AiOutlineLock size={18}/>} placeholder="••••••••" />

          {!isRegister && (
            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)} 
                  className="w-5 h-5 rounded-lg border-2 border-brand-border accent-brand-primary cursor-pointer" 
                />
                {/**Cette option marche seulement si je rafraichi a page or il devrai aussi marcher même si je ferme le navigateur. car le token doivent être stocker en local Storage */}
                <span className="text-[10px] font-black text-brand-muted uppercase tracking-wider group-hover:text-brand-text transition-colors">Rester connecté</span>
              </label>
              <Link to="/forgot-password" className={`text-[10px] ${THEME.font.black} text-brand-primary uppercase hover:underline underline-offset-4 tracking-wider`}>Identifiant Oublié ?</Link>
            </div>
          )}

          <Button 
            type="submit" 
            className={`w-full py-5 text-[12px] shadow-lg shadow-brand-primary/10`}
            disabled={loading}
          >
            {loading ? "TRAITEMENT EN COURS..." : (isRegister ? "CRÉER MON COMPTE" : "ACCÉDER AU PANEL")}
          </Button>

          {/**Donc il supprime automatiquement l'email envoyer?? */}
          {isRegister && (
            <button 
                type="button" 
                onClick={() => setIsRegister(false)} 
                className={`w-full text-[10px] ${THEME.font.black} text-brand-muted uppercase hover:text-brand-primary transition-colors mt-2`}
            >
              Annuler et retourner au login
            </button>
          )}
        </form>
      </div>

      <Alert 
        isOpen={isAlertOpen} 
        title={message?.type === 'success' ? "SUCCÈS" : "ATTENTION"}
        message={message?.text || ""} 
        variant={message?.type === 'success' ? 'success' : 'danger'} 
        onClose={() => setIsAlertOpen(false)}
        onConfirm={handleConfirmAlert}
      />

      {/* --- ANIMATIONS GLOBALES --- */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 15s infinite ease-in-out; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
};

export default memo(Login);