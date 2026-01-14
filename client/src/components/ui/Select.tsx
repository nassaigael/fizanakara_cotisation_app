import React, { memo } from "react";
import { AiOutlineDown } from "react-icons/ai";
import { THEME } from "../../styles/theme";
import type { SelectProps } from "../../utils/types/components/Select.types";

const Select: React.FC<SelectProps> = ({
    label,
    options,
    error,
    containerClassName = "",
    placeholder = "Sélectionner...",
    ...props
}) => {
    return (
        <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
            {label && (
                <label htmlFor={props.name} className={`block ${THEME.font.black} text-brand-muted ml-1 text-[11px] uppercase tracking-wider`}>
                    {label}
                </label>
            )}

            <div className="relative group">
                <select
                    id={props.name}
                    className={`
                        w-full p-4 px-5 bg-brand-bg appearance-none
                        border-2 ${error ? "border-red-500" : "border-brand-border"} 
                        border-b-4 rounded-2xl font-bold text-brand-text text-sm
                        outline-none focus:border-brand-primary transition-all
                        cursor-pointer disabled:opacity-50
                    `}
                    {...props}
                >
                    <option value="" disabled>{placeholder}</option>
                    
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-brand-muted group-focus-within:text-brand-primary transition-colors">
                    <AiOutlineDown size={14} />
                </div>
            </div>

            {error && (
                <span className="text-[10px] text-red-500 font-black ml-2 animate-pulse">
                    {error}
                </span>
            )}
        </div>
    );
};

export default memo(Select);