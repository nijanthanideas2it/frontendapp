// Project API Types

// Project API Types

import type { PaginationInfo } from './common';

export interface TeamMember {
  user_id: string;
  role: string;
  user: {
    first_name: string;
    last_name: string;
    email?: string;
  };
}

export interface TeamMemberWithJoinDate extends TeamMember {
  joined_at: string;
}

export interface ProjectManager {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  budget: number;
  actual_cost: number;
  status: string;
  manager: ProjectManager;
  team_members: TeamMemberWithJoinDate[];
  tasks_summary?: {
    total: number;
    completed: number;
    in_progress: number;
    todo: number;
  };
  milestones?: MilestoneSummary[];
  created_at: string;
  updated_at?: string;
}

export interface ProjectListItem {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  budget: number;
  actual_cost: number;
  status: string;
  manager: ProjectManager;
  team_size: number;
  progress_percentage: number;
  created_at: string;
}

export interface ProjectsListResponse {
  data: ProjectListItem[];
  pagination: PaginationInfo;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  start_date: string;
  end_date?: string;
  budget?: number;
  manager_id: string;
  team_members: {
    user_id: string;
    role: string;
  }[];
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  status?: string;
}

export interface AddTeamMemberRequest {
  user_id: string;
  role: string;
}

export interface AddTeamMemberResponse {
  id: string;
  user_id: string;
  role: string;
  joined_at: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

// Milestone types (used in project responses)
export interface MilestoneSummary {
  id: string;
  name: string;
  due_date: string;
  is_completed: boolean;
}

// Query parameters for project listing
export interface ProjectsQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  manager_id?: string;
  search?: string;
  my_projects?: boolean;
}

 