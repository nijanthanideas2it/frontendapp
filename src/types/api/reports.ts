// Reports API Types

export interface ProjectProgressReport {
  project: {
    id: string;
    name: string;
    status: string;
    progress_percentage: number;
  };
  progress_data: {
    date: string;
    completed_tasks: number;
    total_tasks: number;
    hours_logged: number;
  }[];
  team_performance: {
    user_id: string;
    first_name: string;
    last_name: string;
    tasks_completed: number;
    hours_logged: number;
    productivity_score: number;
  }[];
  milestone_progress: {
    id: string;
    name: string;
    due_date: string;
    is_completed: boolean;
    completion_percentage: number;
  }[];
  cost_analysis: {
    budget: number;
    actual_cost: number;
    cost_variance: number;
    cost_percentage: number;
  };
}

export interface UserTimeReport {
  user: {
    id: string;
    first_name: string;
    last_name: string;
    role: string;
  };
  time_summary: {
    total_hours: number;
    billable_hours: number;
    non_billable_hours: number;
    average_hours_per_day: number;
  };
  time_by_project: {
    project_id: string;
    project_name: string;
    hours: number;
    percentage: number;
  }[];
  time_by_category: {
    category: string;
    hours: number;
    percentage: number;
  }[];
  time_by_date: {
    date: string;
    hours: number;
    tasks_completed: number;
  }[];
  productivity_metrics: {
    tasks_completed: number;
    average_task_duration: number;
    on_time_completion_rate: number;
  };
}

// Query parameters for reports
export interface ProjectReportQueryParams {
  start_date?: string;
  end_date?: string;
  include_team_performance?: boolean;
  include_cost_analysis?: boolean;
}

export interface UserReportQueryParams {
  start_date?: string;
  end_date?: string;
  project_id?: string;
  include_productivity_metrics?: boolean;
} 