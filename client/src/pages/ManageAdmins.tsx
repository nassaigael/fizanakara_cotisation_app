import React, { useState } from 'react';
import { useSuperAdmin } from '../hooks/useSuperAdmin';
import { RegisterAdminSchema } from '../utils/types/schema/Validation.schema';
import { 
  AiOutlineUserAdd, AiOutlineMail, AiOutlinePhone, 
  AiOutlineCalendar, AiOutlineCamera, AiOutlineLock, AiOutlineUser 
} from 'react-icons/ai';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';

const ManageAdmins: React.FC = () => {
  const { handleRegisterAdmin, loading } = useSuperAdmin();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [errorAlert, setErrorAlert] = useState<{show: boolean, msg: string}>({ show: false, msg: '' });
  
  const [formData, setFormData] = useState({
    firstName: '', 
    lastName: '', 
    birthDate: '', 
    gender: 'MALE' as const,
    imageUrl: '', 
    phoneNumber: '', 
    email: '', 
    password: ''
  });

  const handlePrepareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = RegisterAdminSchema.safeParse(formData);
    
    if (!result.success) {
      setErrorAlert({ show: true, msg: result.error.issues[0].message });
      return;
    }
    setIsConfirmOpen(true);
  };

  const onConfirmAction = async () => {
    setIsConfirmOpen(false);

    const dataToSubmit = {
      ...formData,
      role: 'ADMIN',
      adminRole: "ADMIN",
      gender: formData.gender.toUpperCase()
    };

    const success = await handleRegisterAdmin(dataToSubmit);
    
    if (success) {
      setFormData({
        firstName: '', 
        lastName: '', 
        birthDate: '', 
        gender: 'MALE',
        imageUrl: '', 
        phoneNumber: '', 
        email: '', 
        password: ''
      });
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      <header className="mb-10 flex flex-col gap-2">
        <h2 className="text-3xl font-black uppercase text-brand-text flex items-center gap-4">
          <div className="p-3 bg-amber-500 rounded-2xl text-white shadow-lg">
            <AiOutlineUserAdd size={32} />
          </div>
          Nouveau Compte Maître
        </h2>
        <p className="text-amber-600 font-bold text-[10px] uppercase tracking-widest ml-1">
          Zone de haute sécurité • SuperAdmin Uniquement
        </p>
      </header>

      <form onSubmit={handlePrepareSubmit} className="bg-white rounded-[2.5rem] border-2 border-brand-border border-b-8 p-8 lg:p-12 shadow-2xl space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="Prénom" 
            icon={<AiOutlineUser />} 
            value={formData.firstName} 
            onChange={e => setFormData({ ...formData, firstName: e.target.value })} 
            placeholder="Jean" 
            name="firstName" 
          />
          <Input 
            label="Nom" 
            icon={<AiOutlineUser />} 
            value={formData.lastName} 
            onChange={e => setFormData({ ...formData, lastName: e.target.value })} 
            placeholder="Dupont" 
            name="lastName" 
          />
          
          <Input 
            label="Date de Naissance" 
            type="date" 
            value={formData.birthDate} 
            onChange={e => setFormData({ ...formData, birthDate: e.target.value })} 
            icon={<AiOutlineCalendar />} 
            name="birthDate" 
          />
          
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-brand-muted ml-2">Genre</label>
            <select 
              className="h-14 px-6 rounded-2xl border-2 border-brand-border bg-brand-bg font-bold text-sm outline-none focus:border-amber-500 transition-all cursor-pointer"
              value={formData.gender}
              onChange={e => setFormData({...formData, gender: e.target.value as any})}
            >
              <option value="MALE">MASCULIN</option>
              <option value="FEMALE">FÉMININ</option>
            </select>
          </div>

          <Input 
            label="Email Professionnel" 
            type="email" 
            value={formData.email} 
            onChange={e => setFormData({ ...formData, email: e.target.value })} 
            icon={<AiOutlineMail />} 
            name="email" 
          />
          <Input 
            label="Contact Mobile" 
            value={formData.phoneNumber} 
            onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })} 
            icon={<AiOutlinePhone />} 
            name="phoneNumber" 
          />
          
          <Input 
            label="Mot de passe temporaire" 
            type="password" 
            value={formData.password} 
            onChange={e => setFormData({ ...formData, password: e.target.value })} 
            icon={<AiOutlineLock />} 
            name="password" 
          />
          
          <div className="space-y-2">
            <Input 
              label="Identifiant Image GitHub"
              value={formData.imageUrl}
              onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
              icon={<AiOutlineCamera className="text-amber-500" />}
              placeholder="Ex: admin_01" 
              name="imageUrl"            
            />
            <p className="text-[9px] text-brand-muted font-bold italic ml-2">
                * Sera stocké sous : mekill404/.../admin/{formData.imageUrl || 'nom'}.jpg
            </p>
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full py-6 text-[12px] font-black bg-amber-500 border-amber-700 hover:bg-amber-600">
          {loading ? "COMMUNICATION SERVEUR..." : "VALIDER LA CRÉATION"}
        </Button>
      </form>

      <Alert 
        isOpen={isConfirmOpen}
        title="Confirmer l'inscription"
        message={`Voulez-vous accorder les accès Admin à ${formData.firstName} ${formData.lastName} ?`}
        variant="warning"
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={onConfirmAction}
      />

      <Alert 
        isOpen={errorAlert.show}
        title="Formulaire Invalide"
        message={errorAlert.msg}
        variant="danger"
        onClose={() => setErrorAlert({ show: false, msg: '' })}
        onConfirm={() => setErrorAlert({ show: false, msg: '' })}
      />
    </div>
  );
};

export default ManageAdmins;