import React, { useState, useEffect } from 'react';
import { AiOutlineGlobal, AiOutlineTeam, AiOutlinePlus, AiOutlineDelete, AiOutlineBulb } from 'react-icons/ai';
import { DistrictService } from '../../services/district.service';
import { TributeService } from '../../services/tribute.service';
import { DistrictDto, TributeDto } from '../../lib/types/models/common.type';
import Button from '../shared/Button';
import toast from 'react-hot-toast';

const ManageOrganization: React.FC = () => {
    const [districts, setDistricts] = useState<DistrictDto[]>([]);
    const [tributes, setTributes] = useState<TributeDto[]>([]);
    const [loading, setLoading] = useState(false);
    
    // États pour la saisie multiple
    const [rawDistricts, setRawDistricts] = useState('');
    const [rawTributes, setRawTributes] = useState('');

    const loadData = async () => {
        try {
            const d = await DistrictService.getAll();
            setDistricts(d);
        } catch (err) { console.error("District Load Error"); }

        try {
            const t = await TributeService.getAll();
            setTributes(t);
        } catch (err: any) {
            // Ici on gère la 403 sans faire crash le composant
            console.error("Tribute Load Error (403 probable)");
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleBulkAdd = async (type: 'district' | 'tribute') => {
        const value = type === 'district' ? rawDistricts : rawTributes;
        if (!value.trim()) return;

        // On sépare par virgule ou retour à la ligne
        const names = value.split(/[,\n]/).map(n => n.trim()).filter(n => n !== "");
        
        setLoading(true);
        const toastId = toast.loading(`Création de ${names.length} éléments...`);

        try {
            // Création séquentielle
            for (const name of names) {
                if (type === 'district') await DistrictService.create({ name });
                else await TributeService.create({ name });
            }
            
            toast.success("Ajout réussi !", { id: toastId });
            type === 'district' ? setRawDistricts('') : setRawTributes('');
            loadData();
        } catch (err: any) {
            const status = err.response?.status;
            const msg = status === 403 
                ? "Interdit : Seul le rôle 'ADMIN' peut faire ça sur le serveur." 
                : "Erreur lors de l'ajout";
            toast.error(msg, { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Info Box */}
            <div className="bg-brand-primary/10 border-2 border-brand-primary/20 p-4 rounded-4xl flex items-center gap-4">
                <AiOutlineBulb className="text-brand-primary" size={24} />
                <p className="text-[10px] font-black uppercase text-brand-primary tracking-wider">
                    Saisie multiple : Séparez les noms par des virgules ou des retours à la ligne.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* SECTION DISTRICTS */}
                <section className="bg-white p-8 rounded-[2.5rem] border-2 border-brand-border border-b-8 shadow-xl">
                    <h2 className="text-xl font-black uppercase flex items-center gap-3 mb-6"><AiOutlineGlobal className="text-brand-primary" /> Districts</h2>
                    <textarea 
                        className="w-full p-4 bg-brand-bg border-2 border-brand-border rounded-2xl font-bold text-[12px] min-h-30 focus:border-brand-primary outline-none resize-none mb-4"
                        placeholder="District 1, District 2, District 3..."
                        value={rawDistricts}
                        onChange={(e) => setRawDistricts(e.target.value)}
                    />
                    <Button onClick={() => handleBulkAdd('district')} className="w-full" isLoading={loading}>
                        AJOUTER LA LISTE DES DISTRICTS
                    </Button>
                    
                    <div className="mt-8 space-y-2 max-h-75 overflow-y-auto pr-2 custom-scrollbar">
                        {districts.map(d => (
                            <div key={d.id} className="flex justify-between items-center p-4 bg-brand-bg rounded-2xl border-2 border-transparent hover:border-brand-primary/20 transition-all font-black uppercase text-[10px]">
                                {d.name}
                                <AiOutlineDelete className="text-red-400 cursor-pointer hover:text-red-600" onClick={() => d.id && DistrictService.delete(d.id).then(loadData)} />
                            </div>
                        ))}
                    </div>
                </section>

                {/* SECTION TRIBUTES */}
                <section className="bg-white p-8 rounded-[2.5rem] border-2 border-brand-border border-b-8 shadow-xl">
                    <h2 className="text-xl font-black uppercase flex items-center gap-3 mb-6"><AiOutlineTeam className="text-amber-500" /> Tribus</h2>
                    <textarea 
                        className="w-full p-4 bg-brand-bg border-2 border-brand-border rounded-2xl font-bold text-[12px] min-h-30 focus:border-amber-500 outline-none resize-none mb-4"
                        placeholder="Tribu A, Tribu B, Tribu C..."
                        value={rawTributes}
                        onChange={(e) => setRawTributes(e.target.value)}
                    />
                    <Button onClick={() => handleBulkAdd('tribute')} className="w-full bg-amber-500 border-amber-700 hover:bg-amber-600" isLoading={loading}>
                        AJOUTER LA LISTE DES TRIBUS
                    </Button>

                    <div className="mt-8 space-y-2 max-h-75 overflow-y-auto pr-2 custom-scrollbar">
                        {tributes.length > 0 ? tributes.map(t => (
                            <div key={t.id} className="flex justify-between items-center p-4 bg-brand-bg rounded-2xl border-2 border-transparent hover:border-amber-500/20 transition-all font-black uppercase text-[10px]">
                                {t.name}
                                <AiOutlineDelete className="text-red-400 cursor-pointer hover:text-red-600" onClick={() => t.id && TributeService.delete(t.id).then(loadData)} />
                            </div>
                        )) : (
                            <div className="text-center py-10 opacity-50 italic text-[10px] font-bold uppercase">
                                {loading ? "Chargement..." : "Aucune tribu accessible (Erreur 403)"}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ManageOrganization;