import React, { useEffect } from "react";
import type { AlertProps } from "../../utils/types/types"; // Import regroupé
import Button from "./Button";
import { variantStyles } from "../../utils/constants/constants";

const Alert: React.FC<AlertProps> = ({
    isOpen,
    title,
    message,
    onClose,
    onConfirm,
    confirmText = "Confirmer",
    variant = "warning",
}) => {
    // Empêcher le scroll quand l'alerte est ouverte
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const styles = variantStyles[variant];

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className={`bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transform animate-in zoom-in-95 duration-300 border-t-8 ${styles.borderColor}`}>
                <div className="p-8 text-center">
                    <h2 className={`text-2xl font-black mb-2 ${styles.titleColor}`}>{title}</h2>
                    <p className="text-gray-600 font-medium leading-relaxed">{message}</p>
                </div>
                
                <div className="bg-gray-50 p-6 flex flex-col sm:flex-row justify-center gap-3">
                    <Button onClick={onClose} variant="ghost" className="sm:w-32 justify-center">
                        Annuler
                    </Button>
                    <Button onClick={handleConfirm} className={`${styles.buttonBg} sm:w-32 justify-center`}>
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Alert;