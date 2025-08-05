// Comment API Types

import type { PaginationInfo } from './common';

export type EntityType = 'Project' | 'Task' | 'Milestone';

export interface CommentAuthor {
  id: string;
  first_name: string;
  last_name: string;
}

export interface CommentMention {
  id: string;
  first_name: string;
  last_name: string;
}

export interface Comment {
  id: string;
  content: string;
  entity_type: EntityType;
  entity_id: string;
  author: CommentAuthor;
  mentions: CommentMention[];
  created_at: string;
}

export interface CommentListItem {
  id: string;
  content: string;
  author: CommentAuthor;
  mentions: CommentMention[];
  replies_count: number;
  created_at: string;
}

export interface CommentsListResponse {
  data: CommentListItem[];
  pagination: PaginationInfo;
}

export interface CreateCommentRequest {
  content: string;
  entity_type: EntityType;
  entity_id: string;
  parent_comment_id?: string;
  mentions?: string[];
}

export interface UpdateCommentRequest {
  content: string;
}

export interface UpdateCommentResponse {
  id: string;
  content: string;
  updated_at: string;
}

// Query parameters for comment listing
export interface CommentsQueryParams {
  entity_type: EntityType;
  entity_id: string;
  page?: number;
  limit?: number;
}

 