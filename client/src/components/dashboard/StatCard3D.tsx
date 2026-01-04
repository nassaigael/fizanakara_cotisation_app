import React from 'react';
import { THEME } from '../../styles/theme';
import type { StatCardProps } from '../../utils/types/types';

/**
 * StatCard3D - Composant de carte statistique avec effet de profondeur.
 * Utilise des bordures asymétriques pour créer un effet 3D plat (Neubrutalism).
 **/
export const StatCard3D: React.FC<StatCardProps> = ({ title, value, subValue, icon: Icon, color }) => 
{
  // Mapping des couleurs pour correspondre aux styles de bordures 3D
  const colorMap = 
  {
    red: "bg-red-500 border-red-700",
    blue: "bg-blue-400 border-blue-600",
    green: "bg-green-500 border-green-700",
    yellow: "bg-yellow-400 border-yellow-600"
  };

  return (
    <div className={`
      bg-white border-2 border-b-8 border-brand-border 
      rounded-4xl p-6 transition-all duration-200 hover:-translate-y-1 hover:border-b-10 
      active:translate-y-1 active:border-b-4 group cursor-default
    `}>
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className={`text-[9px] ${THEME.font.black} text-brand-muted uppercase tracking-[0.2em] opacity-70`}>
            {title}
          </p>
          <h3 className={`text-2xl ${THEME.font.black} text-brand-text tracking-tighter leading-none`}>
            {value}
          </h3>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-tight">
            {subValue}
          </p>
        </div>

        {/* Icône avec effet 3D réduit */}
        <div className={`
          w-12 h-12 ${colorMap[color]} 
          rounded-2xl flex items-center justify-center 
          text-white border-b-4 border-black/20 
          shadow-lg group-hover:scale-110 transition-transform
        `}>
          <Icon size={24} />
        </div>
      </div>

      {/* Barre de progression décorative optionnelle au pied de la carte */}
      <div className="mt-4 w-full h-1.5 bg-brand-bg rounded-full overflow-hidden">
        <div className={`h-full ${colorMap[color].split(' ')[0]} opacity-30 w-1/3 group-hover:w-full transition-all duration-700`}></div>
      </div>
    </div>
  );
};