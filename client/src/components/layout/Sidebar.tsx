import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AiOutlineLogout, AiOutlineUser } from 'react-icons/ai';
import { sidebarLinks } from '../../utils/constants/sidebarLinks';
import { useAuth } from '../../context/useAuth';

const Sidebar: React.FC = () => {
  const { logout, admin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white h-screen border-r border-gray-100 flex flex-col sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-red-600 p-2 rounded-lg text-white">
          <AiOutlineUser size={24} />
        </div>
        <span className="text-xl font-bold text-gray-800 tracking-tight">Fizanakara</span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {sidebarLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                ? 'bg-red-50 text-red-600 shadow-sm shadow-red-50' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <link.icon size={22} />
            <span className="font-medium">{link.title}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-50">
        <div className="bg-gray-50 rounded-2xl p-4 mb-4">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Connecté en tant que</p>
          <p className="text-sm font-semibold text-gray-700 truncate">{admin?.firstName} {admin?.lastName}</p>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
        >
          <AiOutlineLogout size={22} />
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;