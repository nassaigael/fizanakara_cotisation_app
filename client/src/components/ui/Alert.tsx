import  React from "react";
import type { alertProps } from "../../utils/types/alert";
import Button from "./Button";
import { variantStyles } from "../../utils/constants/variantStyles";
const Alert: React.FC<alertProps> = ({
    isOpen,
    title,
    message,
    onClose,
    onConfirm,
    confirmText = "Confirmer",
    variant = "warning",
}) =>{
    if (!isOpen) return (null);
    const handleConfirm = () =>{
        onConfirm();
        onClose();
    }
    const styles = variantStyles[variant];

    return(
        <>

            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                <div className={`bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform animate-in zoom-in-95 duration-300 border-t-8 ${styles.borderColor}`}>
                    <div className="header p-6 flex justify-between items-center border-b border-gray-100">
                        <h2 className={`text-2xl font-black ${styles.titleColor}`}>{title}</h2>
                        <p className="mt-3 text-gray-500">{message}</p>
                    </div>
                    <div className="bg-gray-50 p-4 flex justify-end gap-3">
                        <Button onClick={onClose} variant="ghost">Annuler</Button>
                        <Button onClick={handleConfirm} className={styles.buttonBg}>
                            {confirmText}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Alert;