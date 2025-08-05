// Common UI Types

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface LoadingStateData<T> {
  data: T | null;
  loading: LoadingState;
  error: string | null;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface SortState {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterState {
  [key: string]: string | number | boolean | string[];
}

export interface TableState {
  pagination: PaginationState;
  sort: SortState;
  filters: FilterState;
  selectedRows: string[];
}

export interface ModalState {
  isOpen: boolean;
  type: string;
  data?: unknown;
}

export interface ToastState {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface SidebarState {
  isOpen: boolean;
  activeItem: string;
}

export interface ThemeState {
  mode: 'light' | 'dark';
  primaryColor: string;
  secondaryColor: string;
} 