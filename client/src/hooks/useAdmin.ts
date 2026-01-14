import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { adminService } from '../services/adminService';
import { toast } from 'react-hot-toast';
import type { AdminResponse, UpdateAdminDto } from '../utils/types/models/Admin.types';

export const Admin = () => {
    const auth = useContext(AuthContext);
    const [admin, setAdmin] = useState<AdminResponse | null>(null);
    const [formData, setFormData] = useState<UpdateAdminDto>({});
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => { loadProfile(); }, []);

    const loadProfile = async () => {
        try {
            const data = await adminService.getMe();
            setAdmin(data);
            setFormData(data);
        } catch (error) {
            toast.error("Erreur de chargement");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const onSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const loadingToast = toast.loading("Mise à jour...");
        try {
            const response = await adminService.updateMe(formData);
            const updatedAdmin = { ...admin, ...response.user, ...formData };
            if (auth?.updateAdminState) auth.updateAdminState(updatedAdmin as any);
            setAdmin(updatedAdmin as any);
            toast.success("Profil mis à jour !", { id: loadingToast });
            setIsEditing(false);
        } catch (error) {
            toast.error("Erreur de sauvegarde", { id: loadingToast });
        }
    };

    // SUPPRESSION ET DÉCONNEXION AUTOMATIQUE
    const handleDelete = async () => {
        if (!admin?.id) return;
        if (window.confirm("Supprimer définitivement ce compte ? Les membres créés ne seront pas impactés.")) {
            try {
                // 1. Suppression physique sur le serveur
                await adminService.deleteAccount(admin.id.toString());
                
                // 2. NETTOYAGE COMPLET (Indispensable pour la déconnexion)
                localStorage.clear(); 
                sessionStorage.clear();
                
                // 3. Déconnexion via le contexte
                if (auth?.logout) {
                    auth.logout();
                }
                
                toast.success("Compte supprimé avec succès.");

                // 4. REDIRECTION FORCÉE (window.location garantit un reset propre de l'app)
                window.location.href = '/'; 

            } catch (error: any) {
                console.error("Erreur lors de la suppression:", error);
                const errorMsg = error.response?.data?.error || "Erreur 500 : Vérifiez les contraintes SQL";
                toast.error(`Échec de la suppression: ${errorMsg}`);
            }
        }
    };

    return {
        admin, formData, isEditing, loading,
        setIsEditing, handleInputChange, onSave, handleDelete
    };
};