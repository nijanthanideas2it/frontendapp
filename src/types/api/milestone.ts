// Milestone API Types

export interface Milestone {
  id: string;
  name: string;
  description: string;
  due_date: string;
  is_completed: boolean;
  project_id: string;
  dependencies: MilestoneDependency[];
  created_at: string;
  updated_at: string;
}

export interface MilestoneListItem {
  id: string;
  name: string;
  description: string;
  due_date: string;
  is_completed: boolean;
  project_id: string;
  created_at: string;
}

export interface MilestonesListResponse {
  data: MilestoneListItem[];
}

export interface CreateMilestoneRequest {
  name: string;
  description?: string;
  due_date: string;
  dependencies?: string[];
}

export interface UpdateMilestoneRequest {
  name?: string;
  description?: string;
  due_date?: string;
  is_completed?: boolean;
}

export interface MilestoneDependency {
  id: string;
  dependent_milestone_id: string;
  prerequisite_milestone_id: string;
  dependency_type: string;
  created_at: string;
}

export interface AddMilestoneDependencyRequest {
  prerequisite_milestone_id: string;
  dependency_type?: string;
}

export interface AddMilestoneDependencyResponse {
  id: string;
  dependent_milestone_id: string;
  prerequisite_milestone_id: string;
  dependency_type: string;
  created_at: string;
} 