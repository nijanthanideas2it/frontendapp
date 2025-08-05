import { apiSlice } from './apiSlice';

export interface DashboardData {
  projects: ProjectSummary[];
  tasks: TaskSummary[];
  activities: Activity[];
  stats: DashboardStats;
}

export interface ProjectSummary {
  id: number;
  name: string;
  status: 'active' | 'completed' | 'on-hold' | 'cancelled';
  progress: number;
  teamSize: number;
  dueDate: string;
  manager: {
    name: string;
    avatar?: string;
  };
}

export interface TaskSummary {
  id: number;
  title: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: {
    name: string;
    avatar?: string;
  };
  dueDate: string;
  project: {
    id: number;
    name: string;
  };
}

export interface Activity {
  id: number;
  type: 'task_created' | 'task_completed' | 'project_updated' | 'comment_added' | 'file_uploaded';
  message: string;
  timestamp: string;
  user: {
    name: string;
    avatar?: string;
  };
  project?: {
    id: number;
    name: string;
  };
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  teamMembers: number;
}

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query<DashboardData, void>({
      query: () => '/projects/dashboard/summary',
      providesTags: ['Dashboard'],
    }),
  }),
});

export const { useGetDashboardQuery } = dashboardApi; 