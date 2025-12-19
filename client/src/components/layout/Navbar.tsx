import React from 'react';
import { AiOutlineSearch, AiOutlineBell, AiOutlineCalendar } from 'react-icons/ai';
import { useAuth } from '../../context/useAuth';

const Navbar: React.FC = () => {
  const { admin } = useAuth();
  
  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <header className="h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md group">
          <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher un membre..." 
            className="w-full pl-11 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-red-500/20 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest border-r pr-6 border-gray-100">
          <AiOutlineCalendar size={16} className="text-red-500" />
          <span>{today}</span>
        </div>

        <button className="relative p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors">
          <AiOutlineBell size={22} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-3 pl-2 border-l border-gray-100">
          <div className="text-right hidden sm:block">
            {/* Correction : first_name au lieu de firstName */}
            <p className="text-sm font-bold text-gray-800 leading-none">{admin?.first_name}</p>
            <p className="text-[10px] text-red-600 font-black mt-1 uppercase tracking-tighter">Administrateur</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gray-100 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
            {admin?.image_url ? (
              <img src={admin.image_url} alt="Profil" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400 font-bold">{admin?.first_name?.charAt(0)}</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;