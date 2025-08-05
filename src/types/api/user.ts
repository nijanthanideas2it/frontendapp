// User API Types

import type { User as BaseUser } from './auth';
import type { PaginationInfo } from './common';

export interface UserSkill {
  skill_name: string;
  proficiency_level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface UserSkillResponse {
  id: string;
  skill_name: string;
  proficiency_level: string;
  created_at: string;
}

export interface UserProfile extends BaseUser {
  hourly_rate: number;
  is_active: boolean;
  last_login_at: string;
  created_at: string;
  skills: UserSkill[];
}

export interface UpdateUserProfileRequest {
  first_name?: string;
  last_name?: string;
  hourly_rate?: number;
}

export interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  role?: string;
  hourly_rate?: number;
  is_active?: boolean;
}

export interface UserListItem {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  hourly_rate: number;
  is_active: boolean;
  created_at: string;
}

export interface UsersListResponse {
  data: UserListItem[];
  pagination: PaginationInfo;
}

export interface AddUserSkillRequest {
  skill_name: string;
  proficiency_level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

// Query parameters for user listing
export interface UsersQueryParams {
  page?: number;
  limit?: number;
  role?: string;
  is_active?: boolean;
  search?: string;
} 