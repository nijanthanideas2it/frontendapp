// Task Form Types

import type { TaskStatus, TaskPriority } from '../api/task';

export interface CreateTaskFormData {
  title: string;
  description: string;
  assigneeId?: string;
  priority: TaskPriority;
  estimatedHours?: number;
  dueDate?: string;
  dependencies: string[];
}

export interface UpdateTaskFormData {
  title?: string;
  description?: string;
  assigneeId?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  estimatedHours?: number;
  dueDate?: string;
}

export interface TaskFiltersFormData {
  search: string;
  status: TaskStatus | '';
  assigneeId: string;
  priority: TaskPriority | '';
}

// Form validation schemas
export interface CreateTaskFormValidation {
  title: string;
  description: string;
  assigneeId?: string;
  priority: TaskPriority;
  estimatedHours?: number;
  dueDate?: string;
  dependencies: string[];
}

export interface UpdateTaskFormValidation {
  title?: string;
  description?: string;
  assigneeId?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  estimatedHours?: number;
  dueDate?: string;
} 