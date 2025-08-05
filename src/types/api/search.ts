// Search API Types

import type { PaginationInfo } from './common';

export type SearchEntityType = 'Project' | 'Task' | 'User' | 'Milestone';

export interface SearchResult {
  id: string;
  type: SearchEntityType;
  title: string;
  description: string;
  entity_type: string;
  entity_id: string;
  relevance_score: number;
  created_at: string;
}

export interface SearchResponse {
  data: SearchResult[];
  pagination: PaginationInfo;
  total_results: number;
  search_time_ms: number;
}

// Query parameters for search
export interface SearchQueryParams {
  q: string;
  type?: SearchEntityType;
  page?: number;
  limit?: number;
  sort_by?: 'relevance' | 'date' | 'name';
  sort_order?: 'asc' | 'desc';
}

 