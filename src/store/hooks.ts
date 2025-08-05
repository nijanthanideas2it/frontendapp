import { useDispatch, useSelector, useStore } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore = useStore<RootState>;

// Auth hooks
export const useAuth = () => useAppSelector((state) => state.auth);
export const useUser = () => useAppSelector((state) => state.auth.user);
export const useIsAuthenticated = () => useAppSelector((state) => state.auth.isAuthenticated);
export const useAuthToken = () => useAppSelector((state) => state.auth.token);

// UI hooks
export const useUI = () => useAppSelector((state) => state.ui);
export const useModal = () => useAppSelector((state) => state.ui.modal);
export const useToasts = () => useAppSelector((state) => state.ui.toasts);
export const useSidebar = () => useAppSelector((state) => state.ui.sidebar);
export const useTheme = () => useAppSelector((state) => state.ui.theme);
export const useIsLoading = () => useAppSelector((state) => state.ui.isLoading); 