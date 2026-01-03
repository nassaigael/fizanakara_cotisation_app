import React, { useState } from "react";
import { AiOutlineDollarCircle, AiOutlineClose } from "react-icons/ai";
import { THEME } from "../../styles/theme";
import { memberService } from "../../services/memberService";
import { toast } from "react-hot-toast";
import type { Member as MemberType } from "../../utils/types/types";
import Button from "../ui/Button";

interface PaymentModalProps {
    member: MemberType;
    onClose: () => void;
    onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ member, onClose, onSuccess }) => {
    const [amount, setAmount] = useState<number>(0);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (amount <= 0) {
            toast.error("Veuillez entrer un montant positif");
            return;
        }

        setIsSaving(true);
        try {
            await memberService.addPayment(member.id, {
                amount: amount,
                date: new Date().toISOString(),
                year: new Date().getFullYear(),
                method: "Liquide"
            });
            
            toast.success(`Paiement de ${amount.toLocaleString()} Ar enregistré !`);
            onSuccess();
            onClose();
        } catch (err) {
            console.error("Erreur de paiement:", err);
            toast.error("Erreur lors de l'enregistrement du paiement");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-text/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-4xl border-2 border-b-8 border-brand-border p-8 shadow-2xl relative overflow-hidden">
                
                <button onClick={onClose} className="absolute top-6 right-6 text-brand-muted hover:text-brand-text">
                    <AiOutlineClose size={24} />
                </button>

                <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 bg-emerald-100 text-emerald-600 rounded-2xl border-2 border-emerald-200 shadow-inner">
                        <AiOutlineDollarCircle size={32}/>
                    </div>
                    <div>
                        <h3 className={`text-xl ${THEME.font.black} text-brand-text uppercase leading-none`}>Encaissement</h3>
                        <p className="text-[10px] font-bold text-brand-muted uppercase mt-1 tracking-widest">
                            Membre : {member.firstName} {member.lastName}
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-brand-bg/50 p-6 rounded-3xl border-2 border-dashed border-brand-border">
                        <label className="block text-[11px] font-black text-brand-text uppercase mb-4 text-center">
                            Montant à verser (en Ariary)
                        </label>
                        <input 
                            type="number" 
                            autoFocus
                            className="w-full bg-transparent text-4xl text-center font-black text-brand-primary outline-none placeholder:opacity-20"
                            placeholder="0"
                            onChange={(e) => setAmount(Number(e.target.value))}
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <Button onClick={onClose} variant="ghost" className="py-4 text-[11px]">
                            Annuler
                        </Button>
                        <Button 
                            onClick={handleSave}
                            disabled={isSaving || amount <= 0}
                            variant="primary"
                            className="py-4 text-[11px] shadow-[0_4px_0_0_#991b1b] active:shadow-none active:translate-y-1"
                        >
                            {isSaving ? "Enregistrement..." : "Confirmer"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};