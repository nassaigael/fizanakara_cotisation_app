import React, { useState, memo, useCallback } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import type { InputProps } from "../../utils/types/types";
import { THEME } from "../../styles/theme";


const Input: React.FC<InputProps & { error?: string; success?: boolean }> = ({ 
    label, 
    placeholder, 
    value, 
    type = "text", 
    onChange, 
    icon, 
    name,
    error,
    success 
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const isEmail = type === "email";
    const currentType = isPassword ? (showPassword ? "text" : "password") : type;

    const togglePassword = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    const isValidEmail = (val: any) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val));
    const showValidation = (isEmail && value && String(value).length > 0) || success || !!error;
    const isActuallyValid = isEmail ? isValidEmail(value) : (success && !error);

    return (
        <div className="w-full flex flex-col gap-1.5">
            {label && (
                <label htmlFor={name} className={`block ${THEME.font.black} text-brand-muted ml-1 text-[11px] uppercase tracking-wider`}>
                    {label}
                </label>
            )}
            
            <div className="relative group">
                {icon && (
                    <div className="absolute inset-y-0 left-4 flex items-center text-brand-muted group-focus-within:text-brand-primary transition-colors duration-300 pointer-events-none">
                        {React.cloneElement(icon as React.ReactElement)}
                    </div>
                )}

                <input 
                    id={name}
                    type={currentType} 
                    name={name}
                    placeholder={placeholder} 
                    value={value}
                    onChange={onChange} 
                    className={`
                        w-full py-4 rounded-2xl bg-brand-bg dark:bg-brand-border-dark
                        border-2 border-brand-border border-t-brand-border-dark
                        focus:bg-white dark:focus:bg-brand-bg focus:border-brand-primary focus:border-t-brand-primary-dark
                        transition-all duration-200 outline-none placeholder-brand-muted/40
                        text-brand-text dark:text-white font-bold text-sm
                        ${icon ? 'pl-12' : 'px-5'} 
                        ${isPassword || showValidation ? 'pr-12' : 'pr-5'}
                        
                        /* États de validation */
                        ${error ? 'border-red-500 border-t-red-600 focus:border-red-500' : ''}
                        ${success && !error ? 'border-green-500 border-t-green-600 focus:border-green-500' : ''}
                    `}
                />

                {/* Feedback visuel (Icone droite) */}
                <div className="absolute inset-y-0 right-4 flex items-center">
                    {isPassword ? (
                        <button
                            type="button"
                            onClick={togglePassword}
                            className="text-brand-muted hover:text-brand-primary transition-colors duration-200 focus:outline-none"
                            tabIndex={-1}
                        >
                            {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                        </button>
                    ) : (
                        showValidation && (
                            <div className="pointer-events-none animate-in zoom-in duration-200">
                                {isActuallyValid && !error ? 
                                    <AiOutlineCheckCircle size={20} className="text-green-500" /> : 
                                    <AiOutlineCloseCircle size={20} className="text-red-500" />
                                }
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Message d'erreur sous l'input */}
            {error && (
                <span className="text-[10px] text-red-500 font-black ml-2 animate-in slide-in-from-top-1">
                    {error}
                </span>
            )}
        </div>
    );
};

export default memo(Input);