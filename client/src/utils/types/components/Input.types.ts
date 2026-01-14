import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string; // Obligatoire pour Zod/React Hook Form
  error?: string;
  icon?: React.ReactNode;
  success?: boolean;
  containerClassName?: string;
}