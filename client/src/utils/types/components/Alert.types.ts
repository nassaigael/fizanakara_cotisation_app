import type { UIVariant } from "./Common.type";

export interface AlertProps
{
    isOpen: boolean;
    title: string;
    message: string;
    onClose: () => void;
    onConfirm: () => void;
    confirmText?: string;
    variant?: UIVariant;
}