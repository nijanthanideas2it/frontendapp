// Dashboard API Types

export interface ProjectSummary {
  id: string;
  name: string;
  status: string;
  progress_percentage: number;
  team_size: number;
  tasks_summary: {
    total: number;
    completed: number;
    in_progress: number;
    todo: number;
  };
}

export interface TaskOverview {
  total: number;
  completed: number;
  in_progress: number;
  todo: number;
  overdue: number;
}

export interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  entity_type: string;
  entity_id: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
  };
  created_at: string;
}

export interface UserDashboardResponse {
  project_summaries: ProjectSummary[];
  task_overview: TaskOverview;
  recent_activities: ActivityItem[];
  upcoming_deadlines: {
    id: string;
    title: string;
    due_date: string;
    project_name: string;
  }[];
  team_performance: {
    user_id: string;
    first_name: string;
    last_name: string;
    tasks_completed: number;
    hours_logged: number;
  }[];
}

export interface ProjectDashboardResponse {
  project: {
    id: string;
    name: string;
    description: string;
    status: string;
    progress_percentage: number;
    budget: number;
    actual_cost: number;
    start_date: string;
    end_date: string;
  };
  progress_chart: {
    date: string;
    completed_tasks: number;
    total_tasks: number;
  }[];
  team_workload: {
    user_id: string;
    first_name: string;
    last_name: string;
    assigned_tasks: number;
    completed_tasks: number;
    hours_logged: number;
  }[];
  recent_activities: ActivityItem[];
  upcoming_milestones: {
    id: string;
    name: string;
    due_date: string;
    is_completed: boolean;
  }[];
  project_statistics: {
    total_tasks: number;
    completed_tasks: number;
    total_hours: number;
    team_size: number;
  };
} 