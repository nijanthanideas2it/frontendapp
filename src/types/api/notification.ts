// Notification API Types

import type { PaginationInfo } from './common';

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  entity_type: string;
  entity_id: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationsListResponse {
  data: Notification[];
  pagination: PaginationInfo;
}

export interface MarkNotificationReadResponse {
  id: string;
  is_read: boolean;
  read_at: string;
}

export interface MarkAllNotificationsReadResponse {
  message: string;
}

// Query parameters for notification listing
export interface NotificationsQueryParams {
  page?: number;
  limit?: number;
  is_read?: boolean;
  type?: string;
}

 