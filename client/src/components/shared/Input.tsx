import React, { useState, forwardRef, memo } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: React.ReactNode;
    error?: string;
    containerClassName?: string;
}

// forwardRef est indispensable pour l'intégration avec React Hook Form
const Input = forwardRef<HTMLInputElement, InputProps>(({ 
    label, 
    type = "text", 
    icon, 
    name,
    error,
    containerClassName = "",
    ...props
}, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    
    const isPassword = type === "password";
    const currentType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
        <div className={`w-full flex flex-col gap-2 ${containerClassName}`}>
            {/* Label style Poppins/Montserrat Black */}
            {label && (
                <label 
                    htmlFor={name} 
                    className="block font-black text-brand-muted ml-1 text-[11px] uppercase tracking-[0.15em]"
                >
                    {label}
                </label>
            )}
            
            <div className="relative group">
                {/* Icône de gauche */}
                {icon && (
                    <div className="absolute inset-y-0 left-4 flex items-center text-brand-muted group-focus-within:text-brand-primary transition-colors duration-200">
                        {icon}
                    </div>
                )}
                
                <input
                    id={name}
                    name={name}
                    ref={ref} // Transmission de la ref
                    type={currentType}
                    className={`
                        w-full p-4 ${icon ? "pl-12" : "px-5"} 
                        bg-white dark:bg-brand-border-dark
                        border-2 ${error ? "border-brand-primary" : "border-brand-border"} 
                        border-b-4 rounded-2xl font-bold text-brand-text text-sm
                        outline-none focus:border-brand-primary transition-all
                        placeholder:text-brand-muted/40
                    `}
                    {...props}
                />

                {/* Toggle Password Visibility */}
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-4 text-brand-muted hover:text-brand-primary transition-colors"
                    >
                        {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                    </button>
                )}
            </div>

            {/* Message d'erreur dynamique */}
            {error && (
                <span className="text-[10px] text-brand-primary font-black ml-2 uppercase tracking-wide animate-in fade-in slide-in-from-top-1">
                    {error}
                </span>
            )}
        </div>
    );
});

Input.displayName = "Input";

export default memo(Input);