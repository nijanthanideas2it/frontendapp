// Task API Types

export type TaskStatus = 'ToDo' | 'InProgress' | 'Review' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type DependencyType = 'Blocks' | 'DependsOn' | 'RelatedTo';

export interface TaskAssignee {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
}

export interface TaskDependency {
  id: string;
  title: string;
  status: string;
}

export interface TaskProject {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  estimated_hours: number;
  actual_hours: number;
  due_date: string;
  started_at?: string;
  completed_at?: string;
  project: TaskProject;
  assignee?: TaskAssignee;
  dependencies: TaskDependency[];
  dependents: TaskDependency[];
  time_entries: TimeEntrySummary[];
  comments: CommentSummary[];
  created_at: string;
  updated_at: string;
}

export interface TaskListItem {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  estimated_hours: number;
  actual_hours: number;
  due_date: string;
  assignee?: TaskAssignee;
  dependencies_count: number;
  created_at: string;
}

export interface TasksListResponse {
  data: TaskListItem[];
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  assignee_id?: string;
  priority?: TaskPriority;
  estimated_hours?: number;
  due_date?: string;
  dependencies?: string[];
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  assignee_id?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  estimated_hours?: number;
  due_date?: string;
}

export interface AddTaskDependencyRequest {
  prerequisite_task_id: string;
  dependency_type?: DependencyType;
}

export interface TaskDependencyResponse {
  id: string;
  dependent_task_id: string;
  prerequisite_task_id: string;
  dependency_type: string;
  created_at: string;
}

// Query parameters for task listing
export interface TasksQueryParams {
  status?: TaskStatus;
  assignee_id?: string;
  priority?: TaskPriority;
  search?: string;
}

// Time entry summary (used in task responses)
export interface TimeEntrySummary {
  id: string;
  hours: number;
  date: string;
  category: string;
  notes: string;
}

// Comment summary (used in task responses)
export interface CommentSummary {
  id: string;
  content: string;
  author: {
    first_name: string;
    last_name: string;
  };
  created_at: string;
} 