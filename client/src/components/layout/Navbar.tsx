import React, { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  AiOutlineCalendar,
  AiOutlineUser,
  AiOutlineMenuUnfold,
} from "react-icons/ai";
import { useAuth } from "../../context/AuthContext";
import { THEME } from "../../styles/theme";

interface NavbarProps {
  onMenuClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user, isSuperAdmin } = useAuth();

  const today = useMemo(
    () =>
      new Date().toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
    []
  );

  return (
    <header className="h-20 bg-white border-b-2 border-brand-border px-4 lg:px-10 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden duo-btn-primary p-3"
        >
          <AiOutlineMenuUnfold size={20} />
        </button>

        <div className="hidden sm:block">
          <h2 className={THEME.font.black}>
            Fizanakara <span className="text-brand-primary">Manager</span>
          </h2>
          <div className="flex items-center gap-2 text-brand-muted">
            <AiOutlineCalendar size={12} />
            <span className={THEME.font.mini}>{today}</span>
          </div>
        </div>
      </div>

      <Link to="/profile" className="flex items-center gap-4 group">
        <div className="text-right hidden xs:block">
          <p className={THEME.font.mini}>{user?.firstName || "Admin"}</p>
          <span className="text-[9px] font-black uppercase text-brand-muted">
            {isSuperAdmin ? "Super Admin" : "Gestionnaire"}
          </span>
        </div>

        <div className="w-12 h-12 rounded-xl border-2 border-brand-border border-b-4 bg-brand-bg flex items-center justify-center overflow-hidden">
          {user?.imageUrl ? (
            <img
              src={user.imageUrl}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <AiOutlineUser size={22} className="text-brand-primary" />
          )}
        </div>
      </Link>
    </header>
  );
};

export default memo(Navbar);
