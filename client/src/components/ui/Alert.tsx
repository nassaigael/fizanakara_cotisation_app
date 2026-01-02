import React, { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import type { AlertProps } from "../../utils/types/types";
import { THEME } from "../../styles/theme";

const Alert: React.FC<AlertProps> = ({
    isOpen,
    title,
    message,
    onClose,
    onConfirm,
    confirmText = "Confirmer",
    variant = "warning",
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    const handleConfirm = useCallback(() => {
        onConfirm();
        onClose();
    }, [onConfirm, onClose]);

    if (!isOpen) return null;

    const variantStyles = {
        danger: "text-brand-primary border-brand-primary-dark bg-brand-primary/10",
        success: "text-green-500 border-green-600 bg-green-50",
        warning: "text-orange-500 border-orange-600 bg-orange-50",
        info: "text-blue-500 border-blue-600 bg-blue-50",
    };

    const content = (
        <div 
            className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={onClose} // Fermer si on clique sur l'overlay
        >
            <div 
                className={`${THEME.card} w-full max-w-md overflow-hidden transform animate-in zoom-in-95 duration-300 bg-white`}
                onClick={(e) => e.stopPropagation()} // Empêcher la fermeture en cliquant sur la carte
            >
                <div className="p-8 text-center">
                    <div className={`mx-auto w-16 h-16 rounded-2xl border-2 border-b-4 flex items-center justify-center mb-4 ${variantStyles[variant]}`}>
                        <span className="text-2xl font-black">!</span>
                    </div>

                    <h2 className={`text-2xl ${THEME.font.black} mb-2 text-brand-text`}>
                        {title}
                    </h2>
                    <p className="text-brand-muted font-bold leading-relaxed px-4">
                        {message}
                    </p>
                </div>
                
                <div className="bg-brand-bg p-6 flex flex-col sm:flex-row justify-center gap-4 border-t-2 border-brand-border">
                    <button 
                        onClick={onClose} 
                        className={`${THEME.buttonSecondary} px-8 py-3 rounded-2xl flex-1 text-sm ${THEME.font.black}`}
                    >
                        Annuler
                    </button>
                    <button 
                        onClick={handleConfirm} 
                        className={`${THEME.buttonPrimary} px-8 py-3 rounded-2xl flex-1 text-sm ${THEME.font.black}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );

    // Injection à la racine du document
    return createPortal(content, document.body);
};

export default React.memo(Alert); // Optimisation : n'est re-rendu que si les props changent