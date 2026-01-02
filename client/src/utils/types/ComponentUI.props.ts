export interface AlertProps
{
    isOpen: boolean;
    title: string;
    message: string;
    onClose: () => void;
    onConfirm: () => void;
    confirmText: string;
    cancelText: string;
    variant: "success" | "warning" | "info" | "danger"
}