import { apiSlice } from './apiSlice';

// Backend response types
export interface BackendProject {
  id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  budget: string | null;
  actual_cost: string | null;
  status: string;
  manager: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    is_active: boolean;
    created_at: string;
  } | null;
  team_size: number;
  progress_percentage: number | null;
  created_at: string;
}

export interface BackendProjectsResponse {
  success: boolean;
  data: BackendProject[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message: string;
}

export interface ProjectFilters {
  search?: string;
  status?: string;
  manager?: string;
  dateRange?: string;
  page?: number;
  limit?: number;
  my_projects?: boolean;
}

export const projectApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<BackendProjectsResponse, ProjectFilters>({
      query: (filters) => ({
        url: '/projects',
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Project' as const, id })),
              { type: 'Project', id: 'LIST' },
            ]
          : [{ type: 'Project', id: 'LIST' }],
    }),
    
    getProject: builder.query<BackendProject, string>({
      query: (projectId) => `/projects/${projectId}`,
      providesTags: (result, error, projectId) => [{ type: 'Project', id: projectId }],
    }),
    
    createProject: builder.mutation<BackendProject, any>({
      query: (data) => ({
        url: '/projects',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Project', id: 'LIST' }],
    }),
    
    updateProject: builder.mutation<BackendProject, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/projects/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Project', id },
      ],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
} = projectApi; 