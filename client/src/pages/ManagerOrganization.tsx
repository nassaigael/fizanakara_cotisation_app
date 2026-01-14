import React, { useState, useEffect } from 'react';
import { useSuperAdmin } from '../hooks/useSuperAdmin';
import { superAdminService } from '../services/superAdminService';
import { AiOutlineGlobal, AiOutlineTeam, AiOutlinePlus, AiOutlineDelete } from 'react-icons/ai';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const ManageOrganization: React.FC = () => {
  const { handleAddDistrict, handleRemoveDistrict, handleAddTribute, handleRemoveTribute, loading } = useSuperAdmin();
  const [districts, setDistricts] = useState<any[]>([]);
  const [tributes, setTributes] = useState<any[]>([]);
  const [newName, setNewName] = useState({ district: '', tribute: '' });

  const fetchData = async () => {
    const [d, t] = await Promise.all([superAdminService.getDistricts(), superAdminService.getTributes()]);
    setDistricts(d);
    setTributes(t);
  };

  useEffect(() => { fetchData(); }, []);

  const onAdd = async (type: 'district' | 'tribute') => {
    const success = type === 'district' 
      ? await handleAddDistrict(newName.district) 
      : await handleAddTribute(newName.tribute);
    
    if (success) {
      setNewName({ ...newName, [type]: '' });
      fetchData();
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      <section className="bg-white p-8 rounded-4xl border-2 border-brand-border border-b-8 shadow-xl">
        <h2 className="text-xl font-black uppercase flex items-center gap-3 mb-6">
          <AiOutlineGlobal className="text-brand-primary" /> Districts
        </h2>
        <div className="flex gap-2 mb-6">
          <Input 
                      placeholder="Nom du district..."
                      value={newName.district}
                      onChange={(e) => setNewName({ ...newName, district: e.target.value })} name={''}          />
          <Button onClick={() => onAdd('district')} disabled={loading}><AiOutlinePlus /></Button>
        </div>
        <ul className="space-y-2">
          {districts.map(d => (
            <li key={d.id} className="flex justify-between items-center p-4 bg-brand-bg rounded-xl border-2 border-transparent hover:border-brand-primary transition-all">
              <span className="font-bold uppercase text-[12px]">{d.name}</span>
              <button onClick={() => handleRemoveDistrict(d.id).then(fetchData)} className="text-red-500 hover:scale-110"><AiOutlineDelete size={20}/></button>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white p-8 rounded-4xl border-2 border-brand-border border-b-8 shadow-xl">
        <h2 className="text-xl font-black uppercase flex items-center gap-3 mb-6">
          <AiOutlineTeam className="text-amber-500" /> Tribus (Tributes)
        </h2>
        <div className="flex gap-2 mb-6">
          <Input 
                      placeholder="Nom de la tribu..."
                      value={newName.tribute}
                      onChange={(e) => setNewName({ ...newName, tribute: e.target.value })} name={''}          />
          <Button onClick={() => onAdd('tribute')} disabled={loading} className="bg-amber-500 border-amber-700"><AiOutlinePlus /></Button>
        </div>
        <ul className="space-y-2">
          {tributes.map(t => (
            <li key={t.id} className="flex justify-between items-center p-4 bg-brand-bg rounded-xl border-2 border-transparent hover:border-amber-500 transition-all">
              <span className="font-bold uppercase text-[12px]">{t.name}</span>
              <button onClick={() => handleRemoveTribute(t.id).then(fetchData)} className="text-red-500 hover:scale-110"><AiOutlineDelete size={20}/></button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default ManageOrganization;