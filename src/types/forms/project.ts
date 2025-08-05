// Project Form Types

export interface CreateProjectFormData {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  budget?: number;
  managerId: string;
  teamMembers: {
    userId: string;
    role: string;
  }[];
}

export interface UpdateProjectFormData {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  status?: string;
}

export interface ProjectFiltersFormData {
  search: string;
  status: string;
  managerId: string;
  myProjects: boolean;
}

// Form validation schemas
export interface CreateProjectFormValidation {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  budget?: number;
  managerId: string;
  teamMembers: {
    userId: string;
    role: string;
  }[];
}

export interface UpdateProjectFormValidation {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  status?: string;
} 