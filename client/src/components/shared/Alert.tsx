import React, { useEffect, memo } from "react";
import { createPortal } from "react-dom";
import Button from "./Button";
import { AiOutlineWarning, AiOutlineCheckCircle, AiOutlineInfoCircle } from "react-icons/ai";

interface AlertProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: "success" | "danger" | "warning" | "info";
}

const Alert: React.FC<AlertProps> = ({
  isOpen, title, message, onClose, onConfirm,
  confirmText = "Confirmer", cancelText = "Annuler", variant = "warning",
}) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const config = {
    success: { icon: <AiOutlineCheckCircle />, color: "text-green-500", bg: "bg-green-50", border: "border-green-200" },
    danger: { icon: <AiOutlineWarning />, color: "text-brand-primary", bg: "bg-brand-primary/5", border: "border-brand-primary/20" },
    warning: { icon: <AiOutlineWarning />, color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-200" },
    info: { icon: <AiOutlineInfoCircle />, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-200" }
  };

  const current = config[variant];

  return createPortal(
    <div className="fixed inset-0 z-999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-brand-border-dark rounded-[2.5rem] w-full max-w-sm overflow-hidden border-4 border-white shadow-2xl animate-in zoom-in-95 duration-200">
        
        <div className="p-8 text-center">
          <div className={`mx-auto w-16 h-16 rounded-3xl border-2 border-b-4 flex items-center justify-center mb-6 ${current.bg} ${current.border} ${current.color}`}>
            {React.cloneElement(current.icon as React.ReactElement)}
          </div>

          <h2 className="text-xl font-black text-brand-text mb-2 uppercase tracking-tight">
            {title}
          </h2>
          <p className="text-brand-muted text-sm font-bold leading-relaxed px-2">
            {message}
          </p>
        </div>
        
        <div className="bg-brand-bg dark:bg-brand-bg/10 p-6 flex gap-3 border-t-2 border-brand-border">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            {cancelText}
          </Button>
          <Button 
            variant={variant === "danger" ? "danger" : "primary"} 
            onClick={() => { onConfirm?.(); onClose(); }} 
            className="flex-1"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default memo(Alert);