import React, { memo } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";


const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-brand-bg dark:bg-brand-bg transition-colors duration-300 overflow-hidden font-sans">
      
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 h-full">
        
        <Navbar />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-bg/50 custom-scrollbar">

          <div className="p-6 lg:p-10 max-w-[1600px] mx-auto w-full min-h-full flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Outlet /> 
          </div>
        </main>
      </div>
    </div>
  );
};

export default memo(MainLayout);