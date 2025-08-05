// Redux Slices Index

export { default as authSlice } from './authSlice';
export { default as uiSlice } from './uiSlice';

// Export actions
export {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUser,
  clearError,
  setLoading as setAuthLoading,
} from './authSlice';

export {
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
  setLoading as setUILoading,
} from './uiSlice'; 