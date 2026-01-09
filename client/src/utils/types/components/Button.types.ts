import type { ButtonVariant } from "./Common.type";

export interface ButtonProps
{
    children: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    to?: string;
    variant?: ButtonVariant;
    className?: string;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
}