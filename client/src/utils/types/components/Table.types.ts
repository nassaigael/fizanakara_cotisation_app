import React from 'react';

export interface Column<T> {
  header: string;
  key: keyof T | string;
  render?: (item: T) => React.ReactNode; // Pour personnaliser l'affichage (ex: Badge de statut)
  width?: string;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalElements: number;
  isFirst: boolean;
  isLast: boolean;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  
  // Actions sur les lignes
  onRowClick?: (item: T) => void;
  actions?: (item: T) => React.ReactNode; // Boutons Modifier/Supprimer

  // Pagination
  pagination?: PaginationData;
  onPageChange?: (page: number) => void;
  
  emptyMessage?: string;
}

/**
 * Utilité :
 * - 'Column<T>' : Définit les colonnes. Si on passe un Member, 'key' sera 'firstName', 'lastName', etc.
 * - 'render' : Très puissant pour transformer une donnée brute (ex: 2024-01-01) en format lisible (ex: 01 Jan 2024).
 * - 'PaginationData' : Aligné sur la structure que renvoie généralement Spring Boot (Pageable).
 */