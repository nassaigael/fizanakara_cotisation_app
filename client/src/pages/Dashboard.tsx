import React from 'react';
import { AiOutlineTeam, AiOutlineDollarCircle, AiOutlineCheckCircle, AiOutlineWarning } from 'react-icons/ai';

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactElement;
    color: string;
}
const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
    <div className={`bg-white p-6 rounded-xl shadow-lg border-l-4 border-${color}-500 transition-shadow hover:shadow-xl`}>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{value}</h3>
            </div>
            <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
                {icon}
            </div>
        </div>
    </div>
);

const RecentActivityTable: React.FC = () => (
    <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Dernières Cotisations</h2>
        <p className="text-gray-500 italic">Affichage des 5 dernières transactions. Intégration API à venir...</p>
        <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                <span>10000 Ar (J. Rabe)</span>
                <span className="text-xs text-gray-500">il y a 2h</span>
            </div>
            <div className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                <span>5000 Ar (P. Seta)</span>
                <span className="text-xs text-gray-500">il y a 1j</span>
            </div>
        </div>
    </div>
);

const dashboardStats = [
    { 
        title: "Total Cotisé (Année)", 
        value: "25 500 000 Ar", 
        icon: <AiOutlineDollarCircle size={28} />, 
        color: "green" 
    },
    { 
        title: "Membres Actifs", 
        value: "154", 
        icon: <AiOutlineTeam size={28} />, 
        color: "blue" 
    },
    { 
        title: "Cotisations Complètes", 
        value: "85%", 
        icon: <AiOutlineCheckCircle size={28} />, 
        color: "indigo" 
    },
    { 
        title: "Paiements en Retard", 
        value: "12", 
        icon: <AiOutlineWarning size={28} />, 
        color: "red" 
    },
];

const Dashboard: React.FC = () => {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardStats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Évolution des Cotisations (Annuelle)</h2>
                    
                    <div className="h-64 flex items-center justify-center border border-dashed rounded mt-4">
                        <p className="text-gray-400">Placeholder : Graphique des revenus par mois</p>
                    </div>
                </div>

                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Statut des Membres</h2>
                    
                    <ul className="space-y-3">
                        <li className="flex justify-between text-sm"><span>Payé intégralement:</span> <span className="font-semibold text-green-600">75</span></li>
                        <li className="flex justify-between text-sm"><span>Paiement partiel:</span> <span className="font-semibold text-blue-600">30</span></li>
                        <li className="flex justify-between text-sm"><span>En retard:</span> <span className="font-semibold text-red-600">12</span></li>
                        <li className="flex justify-between text-sm pt-2 border-t mt-2"><span>Total Membres:</span> <span className="font-bold">154</span></li>
                    </ul>
                </div>
            </div>

            <RecentActivityTable />

        </div>
    );
};

export default Dashboard;