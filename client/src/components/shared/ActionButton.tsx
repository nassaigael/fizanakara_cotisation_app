import React from "react";

interface ActionButtonProps {
    icon: React.ReactElement;
    onClick?: () => void;
    variant?: 'edit' | 'delete' | 'view';
    title?: string;
    theme?: string; // <-- ajouter cette ligne
}

export const ActionButton: React.FC<ActionButtonProps> = ({ icon, onClick, variant = 'view', title }) => {
    const colors = {
        view: "hover:text-blue-500 hover:border-blue-200",
        edit: "hover:text-brand-primary hover:border-brand-primary/30",
        delete: "hover:text-red-500 hover:border-red-200"
    };

    return (
        <button 
            title={title} 
            onClick={onClick} 
            className={`p-2.5 bg-white border-2 border-b-4 border-brand-border rounded-xl transition-all active:translate-y-0.5 active:border-b-2 ${colors[variant]}`}
        >
            {React.cloneElement(icon)}
        </button>
    );
};