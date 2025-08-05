import { apiSlice } from './apiSlice';
import type {
  ProjectProgressReport,
  UserTimeReport,
  ProjectReportQueryParams,
  UserReportQueryParams,
} from '../../types/api/reports';

export const reportsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get project progress report
    getProjectProgressReport: builder.query<ProjectProgressReport, { projectId: string; params?: ProjectReportQueryParams }>({
      query: ({ projectId, params }) => ({
        url: `/reports/projects/${projectId}/progress`,
        params,
      }),
      providesTags: (result, error, { projectId }) => [
        { type: 'Report', id: projectId },
      ],
    }),

    // Get user time report
    getUserTimeReport: builder.query<UserTimeReport, { userId: string; params?: UserReportQueryParams }>({
      query: ({ userId, params }) => ({
        url: `/reports/users/${userId}/time`,
        params,
      }),
      providesTags: (result, error, { userId }) => [
        { type: 'Report', id: userId },
      ],
    }),

    // Export project report
    exportProjectReport: builder.mutation<{ download_url: string }, { projectId: string; format: 'pdf' | 'excel'; params?: ProjectReportQueryParams }>({
      query: ({ projectId, format, params }) => ({
        url: `/reports/projects/${projectId}/export`,
        method: 'POST',
        body: {
          format,
          ...params,
        },
      }),
    }),

    // Export user report
    exportUserReport: builder.mutation<{ download_url: string }, { userId: string; format: 'pdf' | 'excel'; params?: UserReportQueryParams }>({
      query: ({ userId, format, params }) => ({
        url: `/reports/users/${userId}/export`,
        method: 'POST',
        body: {
          format,
          ...params,
        },
      }),
    }),

    // Get project summary
    getProjectSummary: builder.query<{
      project: { id: string; name: string; status: string; progress_percentage: number };
      tasks_summary: { total: number; completed: number; in_progress: number; todo: number; overdue: number };
      time_summary: { total_estimated: number; total_actual: number; variance: number };
    }, string>({
      query: (projectId) => `/reports/projects/${projectId}/summary`,
      providesTags: (result, error, projectId) => [
        { type: 'Report', id: projectId },
      ],
    }),

    // Get project financial report
    getProjectFinancial: builder.query<{
      budget: number;
      actual_cost: number;
      cost_variance: number;
      cost_percentage: number;
      cost_breakdown: Array<{ category: string; amount: number; percentage: number }>;
    }, string>({
      query: (projectId) => `/reports/projects/${projectId}/financial`,
      providesTags: (result, error, projectId) => [
        { type: 'Report', id: projectId },
      ],
    }),

    // Get project team performance
    getProjectTeamPerformance: builder.query<{
      team_performance: Array<{
        user_id: string;
        name: string;
        tasks_completed: number;
        hours_logged: number;
        productivity_score: number;
      }>;
    }, string>({
      query: (projectId) => `/reports/projects/${projectId}/team-performance`,
      providesTags: (result, error, projectId) => [
        { type: 'Report', id: projectId },
      ],
    }),
  }),
});

export const {
  useGetProjectProgressReportQuery,
  useGetUserTimeReportQuery,
  useExportProjectReportMutation,
  useExportUserReportMutation,
  useGetProjectSummaryQuery,
  useGetProjectFinancialQuery,
  useGetProjectTeamPerformanceQuery,
} = reportsApi; 