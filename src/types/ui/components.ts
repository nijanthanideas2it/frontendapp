// UI Component Types

import type { PaginationState, SortState, FilterState } from './common';

export interface ButtonProps {
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onClick?: () => void;
  children: React.ReactNode;
}

export interface CardProps {
  title?: string;
  subtitle?: string;
  content: React.ReactNode;
  actions?: React.ReactNode;
  elevation?: number;
  variant?: 'outlined' | 'elevation';
}

export interface DialogProps {
  open: boolean;
  title: string;
  content: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  onClose: () => void;
}

export interface FormFieldProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea';
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  options?: { value: string; label: string }[];
  multiline?: boolean;
  rows?: number;
  fullWidth?: boolean;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  pagination?: PaginationState;
  sort?: SortState;
  onSort?: (field: string) => void;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (limit: number) => void;
  selectable?: boolean;
  selectedRows?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
}

export interface TableColumn<T> {
  field: keyof T;
  header: string;
  sortable?: boolean;
  width?: number | string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

export interface DataGridProps<T> {
  data: T[];
  columns: DataGridColumn<T>[];
  loading?: boolean;
  pagination?: PaginationState;
  sort?: SortState;
  filters?: FilterState;
  onSort?: (field: string) => void;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (limit: number) => void;
  onFilterChange?: (filters: FilterState) => void;
  selectable?: boolean;
  selectedRows?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  searchable?: boolean;
  onSearch?: (query: string) => void;
}

export interface DataGridColumn<T> {
  field: keyof T;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: number | string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  filterType?: 'text' | 'select' | 'date' | 'number';
  filterOptions?: { value: string; label: string }[];
} 