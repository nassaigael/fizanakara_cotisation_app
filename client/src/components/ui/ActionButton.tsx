import React from "react";

export const ActionButton = ({ icon, onClick, color = "hover:text-brand-primary", title }: any) => (
    <button 
        title={title} 
        onClick={onClick} 
        className={`p-2.5 border-2 border-b-4 border-brand-border rounded-xl transition-all active:translate-y-0.5 active:border-b-2 bg-white ${color}`}
    >
        {React.cloneElement(icon, { size: 18 })}
    </button>
);