import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Sidebar : Fixe à gauche */}
      <Sidebar />

      {/* Contenu principal : Navbar + Pages */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {/* Container avec un padding harmonisé et une largeur max pour les grands écrans */}
          <div className="p-6 lg:p-10 max-w-[1600px] mx-auto w-full animate-in fade-in duration-500">
            <Outlet /> 
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;