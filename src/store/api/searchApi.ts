import { apiSlice } from './apiSlice';
import type {
  SearchResponse,
  SearchQueryParams,
} from '../../types/api/search';

export const searchApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Global search
    globalSearch: builder.query<SearchResponse, SearchQueryParams>({
      query: (params) => ({
        url: '/search',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id, type }) => ({ type: type as 'Project' | 'Task' | 'User' | 'Milestone', id })),
              { type: 'Search', id: 'LIST' },
            ]
          : [{ type: 'Search', id: 'LIST' }],
    }),

    // Search suggestions (for autocomplete)
    searchSuggestions: builder.query<{ suggestions: string[] }, { q: string; limit?: number }>({
      query: (params) => ({
        url: '/search/suggestions',
        params,
      }),
      keepUnusedDataFor: 300, // Keep suggestions for 5 minutes
    }),

    // Search history
    getSearchHistory: builder.query<{ queries: string[] }, void>({
      query: () => '/search/history',
      providesTags: [{ type: 'Search', id: 'HISTORY' }],
    }),

    // Save search query to history
    saveSearchQuery: builder.mutation<void, { query: string }>({
      query: (data) => ({
        url: '/search/history',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Search', id: 'HISTORY' }],
    }),

    // Clear search history
    clearSearchHistory: builder.mutation<void, void>({
      query: () => ({
        url: '/search/history',
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Search', id: 'HISTORY' }],
    }),
  }),
});

export const {
  useGlobalSearchQuery,
  useSearchSuggestionsQuery,
  useGetSearchHistoryQuery,
  useSaveSearchQueryMutation,
  useClearSearchHistoryMutation,
} = searchApi; 