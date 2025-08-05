// Time Entry API Types

import type { PaginationInfo } from './common';

export type TimeEntryCategory = 'Development' | 'Testing' | 'Documentation' | 'Meeting' | 'Other';

export interface TimeEntryTask {
  id: string;
  title: string;
}

export interface TimeEntryProject {
  id: string;
  name: string;
}

export interface TimeEntryApprover {
  id: string;
  first_name: string;
  last_name: string;
}

export interface TimeEntry {
  id: string;
  hours: number;
  date: string;
  category: TimeEntryCategory;
  notes: string;
  is_approved: boolean;
  task?: TimeEntryTask;
  project: TimeEntryProject;
  created_at: string;
}

export interface TimeEntryListItem {
  id: string;
  hours: number;
  date: string;
  category: TimeEntryCategory;
  notes: string;
  is_approved: boolean;
  task?: TimeEntryTask;
  project: TimeEntryProject;
  created_at: string;
}

export interface TimeEntriesListResponse {
  data: TimeEntryListItem[];
  pagination: PaginationInfo;
}

export interface CreateTimeEntryRequest {
  task_id?: string;
  project_id: string;
  hours: number;
  date: string;
  category: TimeEntryCategory;
  notes?: string;
}

export interface UpdateTimeEntryRequest {
  hours?: number;
  category?: TimeEntryCategory;
  notes?: string;
}

export interface TimeEntryApprovalResponse {
  id: string;
  is_approved: boolean;
  approved_at: string;
  approved_by: TimeEntryApprover;
}

// Query parameters for time entry listing
export interface TimeEntriesQueryParams {
  page?: number;
  limit?: number;
  project_id?: string;
  task_id?: string;
  start_date?: string;
  end_date?: string;
  category?: TimeEntryCategory;
}

 