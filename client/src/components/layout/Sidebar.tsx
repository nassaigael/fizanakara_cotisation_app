import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AiOutlineLogout, AiOutlineUser } from 'react-icons/ai';
import { sidebarLinks } from '../../utils/constants/constants';
import { useAuth } from '../../context/useAuth';

const Sidebar: React.FC = () => {
  const { logout, admin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // On redirige vers la racine (Login)
  };

  return (
    <aside className="w-72 bg-white h-screen border-r border-gray-100 flex flex-col sticky top-0 z-40">
      <div className="p-8 flex items-center gap-4">
        <div className="bg-red-600 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-200">
          <AiOutlineUser size={24} />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black text-gray-900 tracking-tighter leading-none">Fizanakara</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Admin Panel</span>
        </div>
      </div>

      <nav className="flex-1 px-6 space-y-2 mt-6">
        {sidebarLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                isActive 
                ? 'bg-red-600 text-white shadow-xl shadow-red-200 translate-x-1' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <link.icon size={22} />
            <span className="font-bold text-sm tracking-tight">{link.title}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-6">
        <div className="bg-gray-50 rounded-2xl p-5 mb-4 border border-gray-100">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Session</p>
          <p className="text-sm font-bold text-gray-800 truncate">{admin?.first_name} {admin?.last_name}</p>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-bold text-sm"
        >
          <AiOutlineLogout size={22} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;