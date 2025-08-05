import { apiSlice } from './apiSlice';

// Backend response types
export interface BackendTask {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  estimated_hours: string | null;
  actual_hours: string | null;
  due_date: string | null;
  assignee: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  } | null;
  dependencies_count: number;
  created_at: string;
}

export interface BackendTasksResponse {
  success: boolean;
  data: BackendTask[];
  message: string;
}

export interface TaskFilters {
  status?: string;
  priority?: string;
  assignee?: string;
  search?: string;
}

export const taskApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProjectTasks: builder.query<BackendTasksResponse, { projectId?: string; filters?: TaskFilters }>({
      query: ({ projectId, filters }) => ({
        url: projectId ? `/projects/${projectId}/tasks` : `/projects/tasks/all`,
        params: filters,
      }),
      providesTags: (result, error, { projectId }) => [
        { type: 'Task', id: 'LIST' },
        { type: 'Task', id: projectId }
      ],
    }),
    
    getTask: builder.query<BackendTask, string>({
      query: (taskId) => `/tasks/${taskId}`,
      providesTags: (result, error, taskId) => [{ type: 'Task', id: taskId }],
    }),
    
    createTask: builder.mutation<BackendTask, { projectId: string; data: Record<string, unknown> }>({
      query: ({ projectId, data }) => ({
        url: `/projects/${projectId}/tasks`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Task', id: 'LIST' }],
    }),
    
    updateTask: builder.mutation<BackendTask, { id: string; data: Record<string, unknown> }>({
      query: ({ id, data }) => ({
        url: `/tasks/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Task', id },
      ],
    }),
  }),
});

export const {
  useGetProjectTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
} = taskApi; 