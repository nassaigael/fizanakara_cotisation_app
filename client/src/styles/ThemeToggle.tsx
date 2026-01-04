import { useState, useEffect } from "react";
import { AiOutlineMoon, AiOutlineSun } from "react-icons/ai";

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <button 
      onClick={() => setIsDark(!isDark)}
      className="p-3 rounded-2xl bg-brand-bgPage dark:bg-brand-darkBg border-2 border-b-4 border-brand-border dark:border-brand-darkBorder text-brand-primary transition-all active:border-b-0 active:translate-y-1"
    >
      {isDark ? <AiOutlineSun size={20} /> : <AiOutlineMoon size={20} />}
    </button>
  );
};