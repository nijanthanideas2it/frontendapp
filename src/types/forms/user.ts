// User Form Types

export interface UpdateProfileFormData {
  firstName: string;
  lastName: string;
  hourlyRate: number;
}

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AddSkillFormData {
  skillName: string;
  proficiencyLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface UserFiltersFormData {
  search: string;
  role: string;
  isActive: boolean;
}

// Form validation schemas
export interface UpdateProfileFormValidation {
  firstName: string;
  lastName: string;
  hourlyRate: number;
}

export interface ChangePasswordFormValidation {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AddSkillFormValidation {
  skillName: string;
  proficiencyLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
} 