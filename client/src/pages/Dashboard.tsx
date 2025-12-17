import React from 'react';
import { AiOutlineTeam, AiOutlineDollarCircle, AiOutlineCheckCircle, AiOutlineWarning } from 'react-icons/ai';

// Utilisation d'un mapping pour éviter les classes dynamiques fractionnées
const colorClasses: Record<string, string> = {
    green: "border-emerald-500 bg-emerald-50 text-emerald-600",
    blue: "border-blue-500 bg-blue-50 text-blue-600",
    indigo: "border-indigo-500 bg-indigo-50 text-indigo-600",
    red: "border-red-500 bg-red-50 text-red-600",
};

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactElement;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
    // On extrait les classes complètes
    const classes = colorClasses[color] || colorClasses.blue;
    const borderColor = classes.split(' ')[0];
    const iconBgAndText = classes.split(' ').slice(1).join(' ');

    return (
        <div className={`bg-white p-6 rounded-2xl shadow-sm border-l-4 ${borderColor} transition-all hover:shadow-md hover:-translate-y-1`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{title}</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2 tracking-tight">{value}</h3>
                </div>
                <div className={`p-4 rounded-xl ${iconBgAndText}`}>
                    {React.cloneElement(icon as React.ReactElement)}
                </div>
            </div>
        </div>
    );
};

const RecentActivityTable: React.FC = () => (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Dernières Cotisations</h2>
            <span className="text-[10px] font-black bg-red-50 text-red-600 px-3 py-1 rounded-full uppercase tracking-tighter">Direct de l'API</span>
        </div>
        <div className="space-y-3">
            {[
                { label: "10 000 Ar", member: "J. Rabe", time: "il y a 2h" },
                { label: "5 000 Ar", member: "P. Seta", time: "il y a 1j" },
                { label: "25 000 Ar", member: "M. Vololona", time: "il y a 2j" },
            ].map((item, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-gray-50/50 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-800 text-sm">{item.label}</span>
                        <span className="text-xs text-gray-500">{item.member}</span>
                    </div>
                    <span className="text-[10px] font-medium text-gray-400 uppercase">{item.time}</span>
                </div>
            ))}
        </div>
    </div>
);

const Dashboard: React.FC = () => {
    const dashboardStats = [
        { title: "Total Cotisé (Année)", value: "25 500 000 Ar", icon: <AiOutlineDollarCircle />, color: "green" },
        { title: "Membres Actifs", value: "154", icon: <AiOutlineTeam />, color: "blue" },
        { title: "Cotisations Complètes", value: "85%", icon: <AiOutlineCheckCircle />, color: "indigo" },
        { title: "Paiements en Retard", value: "12", icon: <AiOutlineWarning />, color: "red" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Tableau de Bord</h1>
                <p className="text-gray-500 text-sm mt-1">Bienvenue dans l'interface de gestion de Fizanakara.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardStats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Évolution des Cotisations</h2>
                    <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/30">
                        <AiOutlineDollarCircle size={48} className="text-gray-200 mb-2" />
                        <p className="text-gray-400 font-medium text-sm">Graphique analytique en attente de données</p>
                    </div>
                </div>

                <div className="lg:col-span-1 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Statut des Membres</h2>
                    <div className="space-y-4">
                        {[
                            { label: "Payé intégralement", val: 75, color: "text-emerald-600" },
                            { label: "Paiement partiel", val: 30, color: "text-blue-600" },
                            { label: "En retard", val: 12, color: "text-red-600" },
                        ].map((s, i) => (
                            <div key={i} className="flex justify-between items-center py-2">
                                <span className="text-sm font-medium text-gray-500">{s.label}</span>
                                <span className={`font-black text-lg ${s.color}`}>{s.val}</span>
                            </div>
                        ))}
                        <div className="pt-6 border-t border-gray-100 mt-4 flex justify-between items-center">
                            <span className="font-bold text-gray-900">Total Membres</span>
                            <span className="bg-gray-900 text-white px-4 py-1 rounded-lg font-black text-sm">154</span>
                        </div>
                    </div>
                </div>
            </div>

            <RecentActivityTable />
        </div>
    );
};

export default Dashboard;