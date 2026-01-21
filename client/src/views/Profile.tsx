import React, { useState, useEffect } from "react";
import { 
  AiOutlineMail, 
  AiOutlineLock, 
  AiOutlineUser, 
  AiOutlineCheckCircle,
  AiOutlineBgColors,
  AiOutlineCheck,
  AiOutlineCamera
} from "react-icons/ai";
import { useAuth } from "../context/AuthContext";
import { THEME } from "../styles/theme";
import { AuthService } from "../services/auth.service";
import { applyThemeToDOM } from "../lib/helper/helperTheme";
import Button from "../components/shared/Button";
import Input from "../components/shared/Input";
import toast from "react-hot-toast";

const Profile: React.FC = () => {
  const { user, isSuperAdmin, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });
  const [passwords, setPasswords] = useState({ new: "", confirm: "" });
  const [currentTheme, setCurrentTheme] = useState(localStorage.getItem("app-theme-color") || "#E51A1A");
  const themes = [
    { name: "Rouge", color: "#E51A1A" },
    { name: "Vert", color: "#10B981" },
    { name: "Bleu", color: "#3B82F6" },
    { name: "Violet", color: "#8B5CF6" },
    { name: "Orange", color: "#F59E0B" }
  ];
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: (user as any).firstname || user.firstName || "",
        lastName: (user as any).lastname || user.lastName || "",
        email: user.email || ""
      });
    }
  }, [user]);
  const handleUpdateTheme = (color: string) => {
    setCurrentTheme(color);
    applyThemeToDOM(color);
    toast.success("Thème mis à jour !");
  };
  const handleUpdateInfo = async () => {
    try {
      const updateData: any = { ...formData };
      if (passwords.new) {
        if (passwords.new !== passwords.confirm) {
          return toast.error("Les mots de passe ne correspondent pas");
        }
        updateData.password = passwords.new;
      }
      const response = await AuthService.updateMe(updateData);
      if (response.success || response.id) {
        toast.success("Profil mis à jour !");
        setPasswords({ new: "", confirm: "" });
        if (refreshUser) refreshUser();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Erreur de mise à jour");
    }
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto space-y-6 pb-24 lg:pb-8">
      <div className={THEME.card + " flex flex-col md:flex-row items-center text-center md:text-left gap-6 p-6 md:p-8"}>
        <div className="relative group">
          <div className="w-24 h-24 rounded-4xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border-2 border-brand-primary/20 shrink-0 overflow-hidden shadow-inner">
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt="avatar" className="w-full h-full object-cover"/>
            ) : (
              <AiOutlineUser size={44} />
            )}
          </div>
          <button className="absolute -bottom-1 -right-1 p-2 bg-white border-2 border-brand-border rounded-xl text-brand-muted hover:text-brand-primary transition-colors shadow-sm">
            <AiOutlineCamera size={16} />
          </button>
        </div>
        <div className="flex-1">
          <h1 className={THEME.font.black + " text-2xl text-brand-text italic"}>
            {formData.firstName} {formData.lastName}
          </h1>
          <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
            <span className="bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              {isSuperAdmin ? 'Super Administrateur' : 'Gestionnaire'}
            </span>
            <AiOutlineCheckCircle className="text-green-500" size={16} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          <section className={THEME.card + " p-6 md:p-8"}>
            <h2 className={THEME.font.bold + " text-lg mb-8 flex items-center gap-3"}>
               <AiOutlineUser className="text-brand-primary" /> Informations du compte
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <Input 
                label="Prénom" 
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
              <Input 
                label="Nom" 
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
              <div className="md:col-span-2">
                <Input 
                  label="Email professionnel" 
                  icon={<AiOutlineMail />} 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
          </section>
          <section className={THEME.card + " p-6 md:p-8"}>
            <h2 className={THEME.font.bold + " text-lg mb-6 flex items-center gap-3"}>
              <AiOutlineLock className="text-brand-primary" /> Sécurité
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <Input 
                label="Nouveau mot de passe" 
                type="password"
                placeholder="Laisser vide pour ignorer"
                value={passwords.new}
                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
              />
              <Input 
                label="Confirmer le mot de passe" 
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
              />
            </div>
          </section>
          <Button 
            className="w-full py-4 text-sm shadow-lg" 
            onClick={handleUpdateInfo}
          >
            Enregistrer les modifications
          </Button>
        </div>
        <div className="space-y-6 md:space-y-8">
          <section className={THEME.card + " p-6 md:p-8"}>
            <h2 className={THEME.font.mini + " mb-6 flex items-center gap-2"}>
              <AiOutlineBgColors size={16}/> Personnalisation
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {themes.map((t) => (
                <button
                  key={t.name}
                  onClick={() => handleUpdateTheme(t.color)}
                  className={`h-12 rounded-xl border-4 transition-all flex items-center justify-center ${
                    currentTheme === t.color ? 'border-brand-text scale-110 shadow-md' : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: t.color }}
                >
                  {currentTheme === t.color && <AiOutlineCheck className="text-white" />}
                </button>
              ))}
            </div>
            <p className="text-[9px] text-brand-muted mt-6 text-center uppercase font-bold tracking-tighter">
              Cliquez sur une couleur pour changer l'ambiance globale.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
};

export default Profile;