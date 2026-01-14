import React, { useEffect, useCallback, memo } from "react";
import { createPortal } from "react-dom";
import type { AlertProps } from "../../utils/types/components/Alert.types";
import { THEME } from "../../styles/theme";
import Button from "./Button";

const Alert: React.FC<AlertProps> = ({
    isOpen, title, message, onClose, onConfirm,
    confirmText = "Confirmer", cancelText = "Annuler", variant = "warning",
}) => {
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const handleConfirm = useCallback(() => {
        if (onConfirm) onConfirm();
        onClose();
    }, [onConfirm, onClose]);

    if (!isOpen) return null;

    const variantColors = {
        success: "text-green-500 bg-green-50 border-green-200",
        danger: "text-red-500 bg-red-50 border-red-200",
        warning: "text-brand-primary bg-brand-primary/5 border-brand-primary/20",
        info: "text-blue-500 bg-blue-50 border-blue-200"
    };

    const content = (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-4xl lg:rounded-[40px] w-full max-w-sm overflow-hidden border-4 border-white shadow-2xl animate-in zoom-in duration-300">
                <div className="p-6 lg:p-8 text-center">
                    <div className={`mx-auto w-14 h-14 lg:w-16 lg:h-16 rounded-2xl lg:rounded-3xl border-2 border-b-4 flex items-center justify-center mb-4 lg:mb-6 ${variantColors[variant]}`}>
                        <span className="text-2xl font-black">!</span>
                    </div>

                    <h2 className={`text-lg lg:text-xl ${THEME.font.black} mb-2 text-brand-text uppercase leading-tight`}>
                        {title}
                    </h2>
                    <p className="text-brand-muted text-xs lg:text-sm font-bold leading-relaxed px-2">
                        {message}
                    </p>
                </div>
                
                <div className="bg-brand-bg p-4 lg:p-6 flex flex-col sm:flex-row gap-3 border-t-2 border-brand-border">
                    <Button variant="secondary" onClick={onClose} className="flex-1 py-3 lg:py-4 order-2 sm:order-1">
                        {cancelText}
                    </Button>
                    <Button 
                        variant={variant === "danger" ? "danger" : "primary"} 
                        onClick={handleConfirm} 
                        className="flex-1 py-3 lg:py-4 order-1 sm:order-2"
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );

    return createPortal(content, document.body);
};

export default memo(Alert);