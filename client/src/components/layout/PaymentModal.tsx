import React, { useState, memo } from "react";
import { AiOutlineDollarCircle, AiOutlineClose } from "react-icons/ai";
import { THEME } from "../../styles/theme";
// ✅ Correction de l'import : On utilise memberService ou financeService selon ton projet
// Si le fichier s'appelle financeService, garde l'ancien. Sinon utilise memberService
import { memberService } from "../../services/memberService"; 
import { toast } from "react-hot-toast";
import Button from "../ui/Button";
import type { ContributionResponse } from "../../utils/types/models/Finance.types";

interface PaymentModalProps {
    isOpen: boolean;
    contribution: ContributionResponse | null; 
    onClose: () => void;
    onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, contribution, onClose, onSuccess }) => {
    const [amount, setAmount] = useState<number>(0);
    const [isSaving, setIsSaving] = useState(false);

    if (!isOpen || !contribution) return null;

    const handleSave = async () => {
        if (amount <= 0) {
            toast.error("Le montant doit être supérieur à 0");
            return;
        }
        setIsSaving(true);
        try {
            await memberService.addPayment(contribution.memberId, {
                amount: amount,
                contributionId: contribution.id,
                date: new Date().toISOString(),
                method: "Liquide"
            });
            
            toast.success(`Versement de ${amount.toLocaleString()} Ar enregistré`);
            setAmount(0);
            onSuccess();
            onClose();
        } catch (err: any) {
            toast.error("Erreur lors de l'enregistrement du paiement");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-150 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full sm:max-w-md rounded-t-[40px] sm:rounded-[40px] overflow-hidden border-x-4 border-t-4 sm:border-4 border-white shadow-2xl animate-in slide-in-from-bottom sm:zoom-in duration-300">
                
                {/* Header */}
                <div className="p-6 border-b-2 border-brand-border flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                            <AiOutlineDollarCircle size={24} />
                        </div>
                        <h2 className={`text-lg ${THEME.font.black} text-brand-text uppercase`}>Nouveau Versement</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-brand-bg rounded-full transition-colors">
                        <AiOutlineClose size={20} className="text-brand-muted" />
                    </button>
                </div>

                <div className="p-6 lg:p-8 space-y-6">
                    {/* Info Membre */}
                    <div className="text-center p-4 bg-brand-bg/50 rounded-2xl border-2 border-brand-border">
                        <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Cotisation pour</p>
                        <p className="text-md font-bold text-brand-text">{contribution.memberName}</p>
                        <p className="text-sm font-black text-brand-primary mt-1">Année {contribution.year}</p>
                    </div>

                    {/* Input Montant */}
                    <div className="space-y-3">
                        <label className={`block text-center text-[11px] ${THEME.font.black} text-brand-muted uppercase`}>
                            Montant à verser (Ar)
                        </label>
                        <div className="relative group">
                            <input 
                                type="number" 
                                autoFocus
                                className="w-full bg-transparent text-5xl text-center font-black text-brand-primary outline-none placeholder:opacity-20"
                                placeholder="0"
                                value={amount || ""}
                                onChange={(e) => setAmount(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button 
                            variant="secondary" 
                            onClick={onClose} 
                            className="flex-1 py-4 order-2 sm:order-1"
                        >
                            Annuler
                        </Button>
                        <Button 
                            onClick={handleSave} 
                            disabled={isSaving || amount <= 0}
                            className="flex-2 py-4 order-1 sm:order-2"
                        >
                            {isSaving ? "Enregistrement..." : "Confirmer le paiement"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(PaymentModal);