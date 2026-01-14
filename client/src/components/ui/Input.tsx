import React, { useState, memo} from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import type { InputProps } from "../../utils/types/components/Input.types";
import { THEME } from "../../styles/theme";

const Input: React.FC<InputProps> = ({ 
    label, 
    type = "text", 
    icon, 
    name,
    error,
    containerClassName = "",
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const currentType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
        <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
            {label && (
                <label htmlFor={name} className={`block ${THEME.font.black} text-brand-muted ml-1 text-[11px] uppercase tracking-wider`}>
                    {label}
                </label>
            )}
            
            <div className="relative group">
                {icon && (
                    <div className="absolute inset-y-0 left-4 flex items-center text-brand-muted group-focus-within:text-brand-primary transition-colors">
                        {icon}
                    </div>
                )}
                
                <input
                    id={name}
                    name={name}
                    type={currentType}
                    className={`
                        w-full p-4 ${icon ? "pl-12" : "px-5"} bg-brand-bg 
                        border-2 ${error ? "border-red-500" : "border-brand-border"} 
                        border-b-4 rounded-2xl font-bold text-brand-text text-sm
                        outline-none focus:border-brand-primary transition-all
                    `}
                    {...props}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-4 text-brand-muted hover:text-brand-primary"
                    >
                        {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                    </button>
                )}
            </div>

            {error && (
                <span className="text-[10px] text-red-500 font-black ml-2 animate-pulse">
                    {error}
                </span>
            )}
        </div>
    );
};

export default memo(Input);