// Time Entry Form Types

import type { TimeEntryCategory } from '../api/timeEntry';

export interface CreateTimeEntryFormData {
  taskId?: string;
  projectId: string;
  hours: number;
  date: string;
  category: TimeEntryCategory;
  notes: string;
}

export interface UpdateTimeEntryFormData {
  hours?: number;
  category?: TimeEntryCategory;
  notes?: string;
}

export interface TimeEntryFiltersFormData {
  projectId: string;
  taskId: string;
  startDate: string;
  endDate: string;
  category: TimeEntryCategory | '';
}

// Timer form data
export interface TimerFormData {
  isRunning: boolean;
  startTime: string;
  elapsedTime: number;
  projectId: string;
  taskId?: string;
  category: TimeEntryCategory;
  notes: string;
}

// Form validation schemas
export interface CreateTimeEntryFormValidation {
  taskId?: string;
  projectId: string;
  hours: number;
  date: string;
  category: TimeEntryCategory;
  notes: string;
}

export interface UpdateTimeEntryFormValidation {
  hours?: number;
  category?: TimeEntryCategory;
  notes?: string;
} 