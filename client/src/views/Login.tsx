import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AiOutlineMail, AiOutlineLock, AiOutlineSafetyCertificate } from 'react-icons/ai';
import { useAuth } from '../context/AuthContext';
import { loginSchema } from '../lib/schemas/admin.schema';
import { LoginRequestDTO } from '../lib/types/models/admin.type';

import Input from '../components/shared/Input'; 
import Button from '../components/shared/Button';
import Alert from '../components/shared/Alert';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ show: false, msg: '' });

    const { register, handleSubmit, formState: { errors } } = useForm<LoginRequestDTO>({
        resolver: zodResolver(loginSchema),
    });

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const onSubmit = async (data: LoginRequestDTO) => {
        setIsLoading(true);
        try {
            await login(data);
        } catch (error: any) {
            // Meilleure gestion du message d'erreur
            const errorMsg = error.response?.data?.message || 
                             error.response?.data?.error || 
                             "Impossible de se connecter au serveur.";
            setAlertConfig({
                show: true,
                msg: errorMsg
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-brand-bg relative font-sans">
            {/* Décorations de fond subtiles */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md bg-white rounded-[2.5rem] border-2 border-brand-border border-b-8 p-8 shadow-2xl z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-primary rounded-3xl mb-6 shadow-lg">
                        <AiOutlineSafetyCertificate className="text-white text-4xl" />
                    </div>
                    <h1 className="text-3xl font-black text-brand-text uppercase tracking-tight leading-none">Connexion</h1>
                    <p className="text-[10px] font-bold text-brand-muted mt-3 uppercase tracking-widest">Fizanakara Cotisation • Admin</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input 
                        label="Email Professionnel" 
                        placeholder="nom@fizanakara.mg"
                        icon={<AiOutlineMail size={20}/>}
                        error={errors.email?.message}
                        {...register("email")}
                    />

                    <div className="space-y-2">
                        <Input 
                            label="Mot de passe" 
                            type="password" 
                            placeholder="••••••••"
                            icon={<AiOutlineLock size={20}/>}
                            error={errors.password?.message}
                            {...register("password")}
                        />
                        <div className="flex justify-end">
                            <Link to="/forgot-password" className="text-[10px] font-black text-brand-primary uppercase hover:underline tracking-tighter">
                                Mot de passe oublié ?
                            </Link>
                        </div>
                    </div>

                    <Button type="submit" className="w-full py-5 text-[12px] font-bold" isLoading={isLoading}>
                        {isLoading ? "VÉRIFICATION..." : "ACCÉDER AU PANEL"}
                    </Button>
                </form>
            </div>

            <Alert 
                isOpen={alertConfig.show}
                title="Erreur de Connexion"
                message={alertConfig.msg}
                variant="danger"
                onClose={() => setAlertConfig({ ...alertConfig, show: false })}
            />
        </div>
    );
};

export default Login;