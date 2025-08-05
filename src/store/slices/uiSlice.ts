import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ModalState, ToastState, SidebarState, ThemeState } from '../../types/ui/common';

interface UIState {
  modal: ModalState;
  toasts: ToastState[];
  sidebar: SidebarState;
  theme: ThemeState;
  isLoading: boolean;
}

const initialState: UIState = {
  modal: {
    isOpen: false,
    type: '',
    data: undefined,
  },
  toasts: [],
  sidebar: {
    isOpen: true,
    activeItem: 'dashboard',
  },
  theme: {
    mode: 'light',
    primaryColor: '#1976d2',
    secondaryColor: '#dc004e',
  },
  isLoading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<{ type: string; data?: unknown }>) => {
      state.modal = {
        isOpen: true,
        type: action.payload.type,
        data: action.payload.data,
      };
    },
    closeModal: (state) => {
      state.modal = {
        isOpen: false,
        type: '',
        data: undefined,
      };
    },
    addToast: (state, action: PayloadAction<Omit<ToastState, 'id'>>) => {
      const id = Date.now().toString();
      state.toasts.push({
        ...action.payload,
        id,
      });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toasts = [];
    },
    toggleSidebar: (state) => {
      state.sidebar.isOpen = !state.sidebar.isOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebar.isOpen = action.payload;
    },
    setActiveSidebarItem: (state, action: PayloadAction<string>) => {
      state.sidebar.activeItem = action.payload;
    },
    setThemeMode: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme.mode = action.payload;
    },
    setPrimaryColor: (state, action: PayloadAction<string>) => {
      state.theme.primaryColor = action.payload;
    },
    setSecondaryColor: (state, action: PayloadAction<string>) => {
      state.theme.secondaryColor = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  openModal,
  closeModal,
  addToast,
  removeToast,
  clearToasts,
  toggleSidebar,
  setSidebarOpen,
  setActiveSidebarItem,
  setThemeMode,
  setPrimaryColor,
  setSecondaryColor,
  setLoading,
} = uiSlice.actions;

export default uiSlice.reducer; 