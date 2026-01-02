import React, { useEffect } from "react";

export const AlertHooks=() =>
{
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

    const getVariantClasses = () => {
        switch (variant) {
            case "danger":
                return "text-brand-primary border-brand-primary-dark bg-brand-primary/10";
            case "success":
                return "text-green-500 border-green-600 bg-green-50";
            default: // warning
                return "text-orange-500 border-orange-600 bg-orange-50";
        }
    };
    return{handleConfirm, getVariantClasses}
}