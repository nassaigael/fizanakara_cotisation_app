// components/types/Select.types.ts
import React from "react";

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  name: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  containerClassName?: string;
  placeholder?: string;
}

/**
 * Utilité : 
 * - 'options' : Reçoit un tableau d'objets {value, label}.
 * - 'name' : Permet l'intégration directe avec React Hook Form / Zod.
 * - 'React.SelectHTMLAttributes' : Permet d'utiliser 'disabled', 'required', etc.
 */