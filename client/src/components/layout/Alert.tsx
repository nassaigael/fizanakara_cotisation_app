import React from "react";
import type { AlertProps } from "../../utils/types/ComponentUI.props";

const Alert: React.FC<AlertProps> =
({
    isOpen,
    title,
    message,
    onClose,
    onConfirm,
    confirmText = "Confirmer",
    variant = "warning"
}) =>
{
    
}