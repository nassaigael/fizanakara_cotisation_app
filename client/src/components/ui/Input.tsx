import React from "react";
import type { InputProps } from "../../utils/types/types";

const Input: React.FC<InputProps> = ({ label, placeholder, value, type = "text", onChange, icon, name }) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-xs font-black text-gray-500 uppercase mb-2 ml-1 tracking-widest">
                    {label}
                </label>
            )}
            <div className="relative group">
                <input 
                    type={type} 
                    name={name}
                    placeholder={placeholder} 
                    value={value}
                    onChange={onChange} 
                    className={`
                        w-full py-3.5 px-4 rounded-xl bg-gray-50 border border-gray-200
                        focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 
                        transition-all duration-200 outline-none placeholder-gray-400
                        text-gray-800 font-medium
                    `}
                />
                {icon && (
                    <div className="absolute inset-y-0 right-4 flex items-center text-gray-400 group-focus-within:text-red-500 transition-colors duration-300">
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Input;