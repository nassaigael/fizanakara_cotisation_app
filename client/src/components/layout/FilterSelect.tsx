import React, { memo } from "react";
import { THEME } from "../../styles/theme";
import { AiOutlineFilter } from "react-icons/ai";

export const FilterSelect: React.FC<any> = memo(({ label, value, onChange, options, icon }) => (
    <div className="w-full sm:flex-1 min-w-[140px] space-y-1.5">
        <label className={`block text-[10px] ${THEME.font.black} text-brand-muted uppercase ml-1 tracking-widest`}>
            {label}
        </label>
        <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-primary transition-colors pointer-events-none">
                {icon || <AiOutlineFilter size={16} />}
            </div>
            <select 
                value={value} 
                onChange={(e) => onChange(e.target.value)} 
                className="w-full bg-white border-2 border-brand-border border-b-4 p-3 pl-10 rounded-xl font-bold text-[12px] uppercase outline-none focus:border-brand-primary transition-all appearance-none cursor-pointer shadow-sm text-brand-text"
            >
                <option value="">Tous les {label}s</option>
                {options.map((o: any) => (
                    <option key={o.v} value={o.v}>{o.l}</option>
                ))}
            </select>
        </div>
    </div>
));