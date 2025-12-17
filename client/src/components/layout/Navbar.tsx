// src/components/ui/Navbar.tsx
import React from 'react';
import { AiOutlineSearch, AiOutlineBell, AiOutlineCalendar } from 'react-icons/ai';
import { useAuth } from '../../context/useAuth';

const Navbar: React.FC = () => {
  const { admin } = useAuth();
  
  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md group">
          <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher un membre, une cotisation..." 
            className="w-full pl-11 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-red-500/20 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-2 text-gray-500 text-sm border-r pr-6 border-gray-100">
          <AiOutlineCalendar size={18} />
          <span className="capitalize">{today}</span>
        </div>

        <button className="relative p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors">
          <AiOutlineBell size={24} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-800 leading-none">{admin?.firstName}</p>
            <p className="text-xs text-red-600 font-medium mt-1">Administrateur</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-linear-to-tr from-gray-200 to-gray-100 border-2 border-white shadow-sm overflow-hidden">
            {admin?.imageUrl ? (
              <img src={admin.imageUrl} alt="Profil" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
                {admin?.firstName.charAt(0)}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;