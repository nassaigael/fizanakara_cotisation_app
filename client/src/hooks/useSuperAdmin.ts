import { useState, useCallback } from 'react';
import { superAdminService } from '../services/superAdminService';
import { toast } from 'react-hot-toast';

export const useSuperAdmin = () => {
  const [loading, setLoading] = useState(false);

  const executeAction = useCallback(async (action: () => Promise<any>, successMsg: string) => {
    setLoading(true);
    try {
      await action(); 
      toast.success(successMsg);
      return true;
    } catch (err: any)
    {
        const msg = err.response?.data?.message || "Privilèges insuffisants (Vérifiez ROLE_SUPERADMIN)";
        toast.error(msg);
        return false;
    }
    finally {
      setLoading(false);
    }
  }, []);

  const handleRegisterAdmin = (data: any) => {
    return executeAction(() => superAdminService.registerAdmin(data), "Nouvel administrateur créé !");
  };

  const handleAddDistrict = (name: string) => {
    return executeAction(() => superAdminService.createDistrict(name), "District ajouté !");
  };

  const handleRemoveDistrict = (id: number) => {
    return executeAction(() => superAdminService.deleteDistrict(id), "District supprimé");
  };

  const handleAddTribute = (name: string) => {
    return executeAction(() => superAdminService.createTribute(name), "Tribu ajoutée !");
  };

  const handleRemoveTribute = (id: number) => {
    return executeAction(() => superAdminService.deleteTribute(id), "Tribu supprimée");
  };

  return { loading, handleRegisterAdmin, handleAddDistrict, handleRemoveDistrict, handleAddTribute, handleRemoveTribute };
};