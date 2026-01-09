import type { UIVariant } from "./Common.type";

export interface AlertProps {
    isOpen: boolean;
    title: string;
    message: string;
    variant?: UIVariant;
    onClose: () => void;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
}