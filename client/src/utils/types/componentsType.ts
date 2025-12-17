

export interface Input{
    label? : string;
    placeholder? : string;
    value : string;
    type? : string;
    onChange : (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    icon? : React.ReactElement;
}

export interface InputPropsAdvanced extends Input{
    children? : React.ReactNode;
}

export interface Button {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  to?: string;
  variant?: "primary" | "ghost" | "danger";
  isActive?: boolean;
}

export interface ButtonPropsAdvanced extends Input{
    childre? : React.ReactNode;
}