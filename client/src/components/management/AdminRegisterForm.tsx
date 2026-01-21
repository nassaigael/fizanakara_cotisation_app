import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineUser, AiOutlineMail, AiOutlineLock, AiOutlinePhone, AiOutlineCalendar, AiOutlineUserAdd } from 'react-icons/ai';
import { AuthService } from '../../services/auth.service';
import { RegisterRequestDTO } from '../../lib/types/models/admin.type';
import Input from '../shared/Input';
import Button from '../shared/Button';
import toast from 'react-hot-toast';

const AdminRegisterForm: React.FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<RegisterRequestDTO>({
        defaultValues: { gender: 'MALE' }
    });

    const onSubmit = async (data: RegisterRequestDTO) => {
        setIsSubmitting(true);
        try {
            await AuthService.register({
                ...data,
                imageUrl: `https://ui-avatars.com/api/?name=${data.firstName}+${data.lastName}&background=random`,
            });
            toast.success("ADMINISTRATEUR CRÉÉ !");
            reset();
        } catch (error: any) {
            toast.error(error.response?.data?.error || "ERREUR DE CRÉATION");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white border-2 border-brand-border border-b-8 p-8 md:p-12 rounded-[2.5rem] shadow-xl">
            <div className="flex items-center gap-4 mb-10">
                <div className="p-4 bg-brand-primary rounded-3xl text-white shadow-lg">
                    <AiOutlineUserAdd size={32} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-brand-text uppercase leading-none tracking-tight">Nouvel Admin</h2>
                    <p className="text-[10px] font-bold text-brand-muted uppercase mt-2 tracking-widest">Enregistrement des accès</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Prénom" icon={<AiOutlineUser />} error={errors.firstName?.message} {...register("firstName", { required: "Requis" })} />
                    <Input label="Nom" icon={<AiOutlineUser />} error={errors.lastName?.message} {...register("lastName", { required: "Requis" })} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Email" type="email" icon={<AiOutlineMail />} error={errors.email?.message} {...register("email", { required: "Requis" })} />
                    <Input label="Téléphone" icon={<AiOutlinePhone />} error={errors.phoneNumber?.message} {...register("phoneNumber", { required: "Requis" })} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Naissance" type="date" icon={<AiOutlineCalendar />} error={errors.birthDate?.message} {...register("birthDate", { required: "Requis" })} />
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-black text-brand-muted uppercase ml-1">Genre</label>
                        <select {...register("gender")} className="w-full h-[52px] px-4 bg-brand-bg border-2 border-brand-border rounded-2xl font-bold text-brand-text outline-none focus:border-brand-primary appearance-none">
                            <option value="MALE">HOMME</option>
                            <option value="FEMALE">FEMME</option>
                        </select>
                    </div>
                </div>

                <Input label="Mot de passe temporaire" type="password" icon={<AiOutlineLock />} error={errors.password?.message} {...register("password", { required: "Requis", minLength: 6 })} />

                <Button type="submit" className="w-full py-5 text-sm font-black" isLoading={isSubmitting}>
                    CRÉER LE COMPTE
                </Button>
            </form>
        </div>
    );
};

export default AdminRegisterForm;