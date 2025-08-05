import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

// Base API configuration
const baseQuery = fetchBaseQuery({
  baseUrl: 'https://projexiq.onrender.com',
  prepareHeaders: (headers, { getState }) => {
    // Get token from auth state
    const token = (getState() as RootState).auth?.token;
    
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// Custom base query with error handling
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  const result = await baseQuery(args, api, extraOptions);
  
  if (result.error && (result.error as { status?: number }).status === 401) {
    // Handle 401 Unauthorized - could trigger token refresh here
    // For now, we'll just return the error
    return result;
  }
  
  return result;
};

// Create the base API slice
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'User',
    'Project',
    'Task',
    'TimeEntry',
    'Comment',
    'Notification',
    'Milestone',
    'File',
    'Dashboard',
    'Search',
    'Report'
  ],
  endpoints: () => ({}),
});

// Export hooks for use in components
export const { 
  middleware: apiMiddleware,
  reducer: apiReducer,
  reducerPath: apiReducerPath,
  util: { resetApiState }
} = apiSlice; 