export interface InputProps {
  label?: string;
  name: string;
  placeholder?: string;
  value: string | number;
  type?: "text" | "password" | "email" | "date" | "tel" | "number";
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  error?: string;
  success?: boolean;
  disabled?: boolean;
}