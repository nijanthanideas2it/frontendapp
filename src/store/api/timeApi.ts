import { apiSlice } from './apiSlice';

export interface TimeEntry {
  id: number;
  userId: number;
  projectId: number;
  taskId?: number;
  startTime: string;
  endTime?: string;
  duration: number; // in minutes
  description: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: number;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  project: {
    id: number;
    name: string;
  };
  task?: {
    id: number;
    title: string;
  };
  user: {
    id: number;
    name: string;
    avatar?: string;
  };
}

export interface TimeEntriesData {
  timeEntries: TimeEntry[];
  totalEntries: number;
  totalHours: number;
  stats: {
    pending: number;
    approved: number;
    rejected: number;
  };
}

export interface TimeEntryFilters {
  dateRange?: string;
  project?: string;
  task?: string;
  status?: string;
  user?: string;
}

export const timeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTimeEntries: builder.query<TimeEntriesData, TimeEntryFilters>({
      query: (filters) => ({
        url: '/time-entries',
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.timeEntries.map(({ id }) => ({ type: 'TimeEntry' as const, id })),
              { type: 'TimeEntry', id: 'LIST' },
            ]
          : [{ type: 'TimeEntry', id: 'LIST' }],
    }),

    getPendingApprovals: builder.query<TimeEntriesData, void>({
      query: () => '/time-entries/pending',
      providesTags: (result) =>
        result
          ? [
              ...result.timeEntries.map(({ id }) => ({ type: 'TimeEntry' as const, id })),
              { type: 'TimeEntry', id: 'PENDING' },
            ]
          : [{ type: 'TimeEntry', id: 'PENDING' }],
    }),

    createTimeEntry: builder.mutation<TimeEntry, Omit<TimeEntry, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'approvedBy' | 'approvedAt'>>({
      query: (data) => ({
        url: '/time-entries',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'TimeEntry', id: 'LIST' }],
    }),

    updateTimeEntry: builder.mutation<TimeEntry, { id: number; data: Partial<TimeEntry> }>({
      query: ({ id, data }) => ({
        url: `/time-entries/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'TimeEntry', id },
        { type: 'TimeEntry', id: 'LIST' },
      ],
    }),

    approveTimeEntry: builder.mutation<TimeEntry, number>({
      query: (id) => ({
        url: `/time-entries/${id}/approve`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'TimeEntry', id },
        { type: 'TimeEntry', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetTimeEntriesQuery,
  useGetPendingApprovalsQuery,
  useCreateTimeEntryMutation,
  useUpdateTimeEntryMutation,
  useApproveTimeEntryMutation,
} = timeApi; 