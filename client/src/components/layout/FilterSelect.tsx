import React from "react";
import { THEME } from "../../styles/theme";

interface FilterOption {
    l: string;
    v: string;
}

interface FilterSelectProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
    options: FilterOption[];
}

export const FilterSelect: React.FC<FilterSelectProps> = ({ label, value, onChange, options }) => (
    <div className="space-y-1">
        <label className={`block text-[10px] ${THEME.font.black} text-brand-muted uppercase ml-1 tracking-wider`}>
            {label}
        </label>
        <div className="relative group">
            <select 
                value={value} 
                onChange={(e) => onChange(e.target.value)} 
                className="w-full bg-white border-2 border-brand-border p-2.5 rounded-xl font-bold text-sm outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 shadow-sm appearance-none cursor-pointer transition-all"
            >
                <option value="">Tous les {label}s</option>
                {options.map((o) => (
                    <option key={o.v} value={o.v}>{o.l}</option>
                ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-brand-muted group-focus-within:text-brand-primary transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    </div>
);