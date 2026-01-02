export const THEME = {
  font: {
    black: "font-[900] uppercase tracking-widest",
    bold: "font-bold tracking-tight",
    light: "font-light tracking-wide text-brand-muted",
  },

  // EFFET 3D (Signature Duolingo)
  clickEffect: "active:translate-y-1 active:border-b-0 transition-all duration-150",

  // CARTES : Utilise les variables définies dans @theme
  card: `bg-white dark:bg-brand-border-dark 
         border-2 border-brand-border 
         border-b-8 border-b-brand-border-dark 
         rounded-[2.5rem] shadow-sm`,

  // INPUTS
  input: `bg-brand-bg border-2 border-brand-border 
          border-t-brand-border-dark rounded-2xl px-4 py-3 outline-none 
          focus:bg-white focus:border-brand-primary 
          text-brand-text font-bold transition-all`,

  // BOUTONS
  buttonPrimary: `bg-brand-primary border-brand-primary-dark border-b-4 
                  text-white font-[900] uppercase text-[11px] tracking-widest
                  hover:brightness-110 active:translate-y-1 active:border-b-0 transition-all`,

  buttonSecondary: `bg-white dark:bg-brand-border-dark border-brand-border border-2 border-b-4 
                    text-brand-muted hover:text-brand-primary transition-all active:translate-y-1 active:border-b-0`,
};