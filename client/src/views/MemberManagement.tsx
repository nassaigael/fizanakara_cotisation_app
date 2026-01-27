import React, { useState, useMemo } from "react";
import { 
  AiOutlineSearch, AiOutlineEye, AiOutlineDelete, 
  AiOutlinePlus, AiOutlineFilter, AiOutlineEdit, AiOutlineClose,
  AiOutlineTeam, AiOutlineCalendar, AiOutlinePhone, AiOutlineGlobal,
  AiOutlineUser
} from "react-icons/ai";
import { useMemberLogic } from "../hooks/useMembers";
import { MemberHelper } from "../lib/helper/member.helper";
import Button from "../components/shared/Button";
import { ActionButton } from "../components/shared/ActionButton";
import { PersonResponseDto } from "../lib/types/models/person.type";
import MemberForm from "../components/modals/MemberForm";
import { useAuth } from "../context/AuthContext";
import { THEME } from "../styles/theme";

const MemberManagement: React.FC = () => {
    const { currentTheme } = useAuth();
    const { 
        members, allMembers, search, setSearch, 
        filterSex, setFilterSex, 
        filterDistrict, setFilterDistrict, 
        filterTribe, setFilterTribe, 
        deleteAction, refreshMembers 
    } = useMemberLogic();
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [viewMember, setViewMember] = useState<PersonResponseDto | null>(null);
    const [formModal, setFormModal] = useState<{isOpen: boolean; memberToEdit: PersonResponseDto | null;}>({
        isOpen: false,
        memberToEdit: null
    });
    const districtOptions = useMemo(() => Array.from(new Set(allMembers.map(m => m.districtName))), [allMembers]);
    const tribeOptions = useMemo(() => Array.from(new Set(allMembers.map(m => m.tributeName))), [allMembers]);

    return (
        <div className="h-screen flex flex-col bg-brand-bg/20 overflow-hidden">
            <header className="p-4 md:px-8 md:py-6 bg-white border-b-2 border-brand-border shrink-0">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className={`text-xl md:text-3xl ${THEME.font.black} uppercase leading-none`} style={{ color: currentTheme }}>
                            Membres
                        </h1>
                        <p className="text-[9px] font-bold text-brand-muted uppercase mt-1 italic leading-none">
                            {members.length} inscrits
                        </p>
                    </div>
                    <Button
                        onClick={() => setFormModal({ isOpen: true, memberToEdit: null })}
                        className="flex items-center justify-center gap-2 py-3 px-6 md:py-2.5 md:px-8 text-[10px] md:text-[11px] font-black uppercase rounded-[1.75rem] shadow-[0_6px_0_0_rgba(0,0,0,0.15)] transition-all transform hover:-translate-y-1 hover:shadow-[0_10px_0_0_rgba(0,0,0,0.2)] active:translate-y-0 active:shadow-[0_4px_0_0_rgba(0,0,0,0.15)]"
                        style={{ backgroundColor: currentTheme, color: "#fff" }}
                    >
                        <AiOutlinePlus size={18} /> <span className="hidden md:inline">NOUVEAU MEMBRE</span>
                    </Button>
                </div>
            </header>

            <section className="px-4 py-3 bg-white/50 border-b border-brand-border shrink-0">
                <div className="max-w-7xl mx-auto flex flex-col gap-3">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={16} />
                            <input 
                                type="text" 
                                placeholder="Rechercher..." 
                                className="w-full pl-9 pr-4 py-2.5 bg-white rounded-xl border-2 border-brand-border font-bold text-xs"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <button 
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`p-2.5 rounded-xl border-2 transition-all ${isFilterOpen ? `bg-[${currentTheme}] text-white border-[${currentTheme}]` : 'bg-white text-brand-text border-brand-border'}`}
                        >
                            <AiOutlineFilter size={20} />
                        </button>
                    </div>

                    {isFilterOpen && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 bg-white rounded-xl border-2 border-brand-primary/20 animate-in fade-in duration-200">
                            <FilterSelect value={filterSex} onChange={setFilterSex} options={[{v:"MALE", l:"Hommes"}, {v:"FEMALE", l:"Femmes"}]} label="Sexe" />
                            <FilterSelect value={filterDistrict} onChange={setFilterDistrict} options={districtOptions.map(d=>({v:d, l:d}))} label="District" />
                            <FilterSelect value={filterTribe} onChange={setFilterTribe} options={tribeOptions.map(t=>({v:t, l:t}))} label="Tribu" />
                        </div>
                    )}
                </div>
            </section>
            <main className="flex-1 overflow-hidden p-2 md:p-6">
                <div className="max-w-7xl mx-auto h-full overflow-y-auto custom-scrollbar">
                    <div className="hidden md:block bg-white rounded-[2.5rem] border-2 border-brand-border shadow-xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-brand-bg/50 border-b-2 border-brand-border sticky top-0">
                                <tr>
                                    <th className="p-5 text-[9px] font-black uppercase text-brand-muted">Membre</th>
                                    <th className="p-5 text-[9px] font-black uppercase text-brand-muted">Localisation</th>
                                    <th className="p-5 text-[9px] font-black uppercase text-brand-muted">Paiement</th>
                                    <th className="p-5 text-right text-[9px] font-black uppercase text-brand-muted">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-bg">
                                {members.map(m => (
                                    <tr key={m.id} className="hover:bg-brand-bg/30 transition-colors">
                                        <td className="p-4 flex items-center gap-3">
                                            <img src={m.imageUrl} className="w-10 h-10 rounded-xl object-cover border-2 border-brand-border shadow-md" alt="" />
                                            <div>
                                                <div className="font-black text-[11px] uppercase text-brand-text">{m.firstName} {m.lastName}</div>
                                                <div className="text-[8px] font-bold text-brand-muted">{m.parentId ? `Fils de ${m.parentName}` : 'Titulaire'}</div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-[10px] font-bold uppercase">{m.districtName} <span className="text-[${currentTheme}]">({m.tributeName})</span></td>
                                        <td className="p-4">
                                            <PaymentStatusBadge active={m.isActiveMember} theme={currentTheme} />
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <ActionButton variant="view" onClick={() => setViewMember(m)} icon={<AiOutlineEye size={18} />} theme={currentTheme}/>
                                                <ActionButton variant="edit" onClick={() => setFormModal({ isOpen: true, memberToEdit: m })} icon={<AiOutlineEdit size={18} />} theme={currentTheme}/>
                                                <ActionButton variant="delete" onClick={() => deleteAction([m.id])} icon={<AiOutlineDelete size={18} />} theme={currentTheme}/>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="md:hidden space-y-3">
                        {members.map(m => (
                            <div key={m.id} className="bg-white p-4 rounded-3xl border-2 border-brand-border flex items-center justify-between shadow-md">
                                <div className="flex items-center gap-3 min-w-0">
                                    <img src={m.imageUrl} className="w-12 h-12 rounded-2xl object-cover border-2 border-brand-border shadow-sm shrink-0" alt="" />
                                    <div className="truncate">
                                        <h4 className="font-black text-xs uppercase text-brand-text truncate leading-tight">{m.firstName}</h4>
                                        <PaymentStatusBadge active={m.isActiveMember} theme={currentTheme}/>
                                    </div>
                                </div>
                                <div className="flex gap-1.5 shrink-0">
                                    <ActionButton variant="view" onClick={() => setViewMember(m)} icon={<AiOutlineEye size={16} />} theme={currentTheme}/>
                                    <ActionButton variant="edit" onClick={() => setFormModal({ isOpen: true, memberToEdit: m })} icon={<AiOutlineEdit size={16} />} theme={currentTheme}/>
                                    <ActionButton variant="delete" onClick={() => deleteAction([m.id])} icon={<AiOutlineDelete size={16} />} theme={currentTheme}/>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            {viewMember && (
                <div className="fixed inset-0 z-120 flex items-center justify-center p-4 bg-brand-text/40 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] w-full max-w-lg overflow-hidden shadow-2xl border-4 border-white flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-brand-bg flex justify-between items-center shrink-0">
                            <h2 className="text-sm font-black uppercase text-brand-text tracking-widest">Détails du membre</h2>
                            <button onClick={() => setViewMember(null)} className="p-2 hover:bg-brand-bg rounded-full transition-colors"><AiOutlineClose size={22} /></button>
                        </div>
                        
                        <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar text-center">
                            <div className="relative inline-block mb-8">
                                <img src={viewMember.imageUrl} className="w-32 h-40 md:w-40 md:h-52 object-cover rounded-[2.5rem] shadow-xl border-4 border-brand-bg rotate-2" alt="" />
                                <div className="absolute -bottom-2 -right-2 bg-[${currentTheme}] text-white text-[8px] font-black px-4 py-1.5 rounded-full uppercase border-2 border-white shadow-lg">
                                    {viewMember.parentId ? 'Enfant' : 'Titulaire'}
                                </div>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-black text-brand-text uppercase tracking-tighter mb-1 leading-none">{viewMember.firstName} {viewMember.lastName}</h3>
                            <p className="text-brand-muted font-bold text-[10px] uppercase tracking-[0.2em] mb-8">Membre ID: {viewMember.sequenceNumber || '---'}</p>           
                            <div className="grid grid-cols-2 gap-3 text-left">
                                <DetailBox icon={<AiOutlineCalendar/>} label="Naissance" value={MemberHelper.formatDate?.(viewMember.birthDate) || viewMember.birthDate} theme={currentTheme}/>
                                <DetailBox icon={<AiOutlineTeam/>} label="Sexe" value={viewMember.gender === 'MALE' ? 'Homme' : 'Femme'} theme={currentTheme}/>
                                <DetailBox icon={<AiOutlineGlobal/>} label="District" value={viewMember.districtName} theme={currentTheme}/>
                                <DetailBox icon={<AiOutlineTeam/>} label="Tribu" value={viewMember.tributeName} theme={currentTheme}/>
                                <DetailBox icon={<AiOutlineUser/>} label="Statut" value={viewMember.status === 'STUDENT' ? 'Étudiant' : 'Travailleur'} theme={currentTheme}/>
                                <DetailBox icon={<AiOutlinePhone/>} label="Contact" value={viewMember.phoneNumber || "N/A"} theme={currentTheme}/>
                                <div className="col-span-2">
                                    <DetailBox icon={<AiOutlineUser/>} label="Parent Responsable" value={viewMember.parentName || "Lui-même (Titulaire)"} theme={currentTheme}/>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-brand-bg/30 shrink-0">
                            <Button onClick={() => setViewMember(null)} className="w-full py-4 text-[10px]" style={{backgroundColor: currentTheme, color: "#fff"}}>FERMER LA FICHE</Button>
                        </div>
                    </div>
                </div>
            )}
            <MemberForm 
                isOpen={formModal.isOpen} 
                onClose={() => setFormModal({ isOpen: false, memberToEdit: null })} 
                memberToEdit={formModal.memberToEdit}
                onSuccess={refreshMembers}
                allMembers={allMembers} 
            />
        </div>
    );
};
const PaymentStatusBadge = ({ active, theme }: { active: boolean; theme: string }) => (
    <span className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase inline-block`} 
        style={{ 
            backgroundColor: active ? '#D1FAE5' : '#FEE2E2', 
            color: active ? '#065F46' : '#B91C1C', 
            borderColor: active ? '#A7F3D0' : '#FECACA', 
            borderStyle: 'solid',
            borderWidth: 1
        }}>
        {active ? 'À JOUR' : 'IMPAYÉ'}
    </span>
);

const DetailBox = ({ label, value, icon, theme }: { label: string; value: string; icon: any; theme: string }) => (
    <div className="bg-brand-bg/50 p-3 rounded-2xl border-2 border-brand-border/50 flex items-start gap-2">
        <div className="text-brand-primary mt-0.5 opacity-50">{icon}</div>
        <div className="min-w-0">
            <p className="text-[7px] font-black text-brand-muted uppercase tracking-widest leading-none mb-1">{label}</p>
            <p className="font-bold text-[10px] uppercase text-brand-text truncate leading-none">{value}</p>
        </div>
    </div>
);

const FilterSelect = ({ label, value, onChange, options }: any) => (
    <div className="flex flex-col">
        <label className="text-[7px] font-black text-brand-muted uppercase ml-2 mb-1">{label}</label>
        <select value={value} onChange={(e) => onChange(e.target.value)} className="bg-brand-bg p-2 rounded-xl border-none font-bold text-[10px] uppercase">
            <option value="">Tous</option>
            {options.map((o:any) => <option key={o.v} value={o.v}>{o.l}</option>)}
        </select>
    </div>
);

export default MemberManagement;
