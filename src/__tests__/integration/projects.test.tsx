import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../utils/test-utils';
import { ProjectForm } from '../../components/projects/ProjectForm';
import { ProjectCard } from '../../components/projects/ProjectCard';
import { ProjectFilters } from '../../components/projects/ProjectFilters';
import { CreateProjectButton } from '../../components/projects/CreateProjectButton';

// Mock the project API
const mockCreateProject = jest.fn();
const mockUpdateProject = jest.fn();
const mockGetProjects = jest.fn();
const mockDeleteProject = jest.fn();

jest.mock('../../store/api/projectApi', () => ({
  useCreateProjectMutation: () => [mockCreateProject, { isLoading: false, error: null }],
  useUpdateProjectMutation: () => [mockUpdateProject, { isLoading: false, error: null }],
  useGetProjectsQuery: () => ({ data: null, isLoading: false, error: null }),
  useDeleteProjectMutation: () => [mockDeleteProject, { isLoading: false, error: null }],
}));

// Mock react-router-dom
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockProject = {
  id: 1,
  name: 'Test Project',
  description: 'This is a test project description',
  status: 'active' as const,
  progress: 75,
  startDate: '2024-01-01',
  dueDate: '2024-12-31',
  budget: {
    currency: 'USD',
    allocated: 50000,
    spent: 35000,
  },
  manager: {
    id: 1,
    name: 'John Doe',
    avatar: 'https://example.com/avatar.jpg',
  },
  teamMembers: [],
  tasksCount: 10,
  completedTasksCount: 7,
};

  describe('Projexiq Integration Tests', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateProject.mockResolvedValue({ data: mockProject });
    mockUpdateProject.mockResolvedValue({ data: mockProject });
    mockGetProjects.mockResolvedValue({ data: [mockProject] });
    mockDeleteProject.mockResolvedValue({ data: { success: true } });
  });

  describe('Project Creation Flow', () => {
    it('completes full project creation flow successfully', async () => {
      render(<ProjectForm />);

      // Fill in project form
      const nameInput = screen.getByLabelText(/project name/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const startDateInput = screen.getByLabelText(/start date/i);
      const dueDateInput = screen.getByLabelText(/due date/i);
      const budgetInput = screen.getByLabelText(/budget/i);
      const submitButton = screen.getByRole('button', { name: /create project/i });

      await user.type(nameInput, 'New Test Project');
      await user.type(descriptionInput, 'This is a new test project');
      await user.type(startDateInput, '2024-01-01');
      await user.type(dueDateInput, '2024-12-31');
      await user.type(budgetInput, '75000');

      // Submit form
      await user.click(submitButton);

      // Verify API call
      await waitFor(() => {
        expect(mockCreateProject).toHaveBeenCalledWith({
          name: 'New Test Project',
          description: 'This is a new test project',
          start_date: '2024-01-01',
          due_date: '2024-12-31',
          budget: 75000,
        });
      });

      // Verify navigation to project details
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/projects/1');
      });
    });

    it('validates required fields before submission', async () => {
      render(<ProjectForm />);

      const submitButton = screen.getByRole('button', { name: /create project/i });
      await user.click(submitButton);

      // Verify validation errors
      await waitFor(() => {
        expect(screen.getByText(/project name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/description is required/i)).toBeInTheDocument();
      });

      // Verify no API call was made
      expect(mockCreateProject).not.toHaveBeenCalled();
    });

    it('handles project creation failure', async () => {
      const createError = {
        status: 400,
        data: { message: 'Project name already exists' }
      };
      mockCreateProject.mockRejectedValue(createError);

      render(<ProjectForm />);

      const nameInput = screen.getByLabelText(/project name/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const submitButton = screen.getByRole('button', { name: /create project/i });

      await user.type(nameInput, 'Existing Project');
      await user.type(descriptionInput, 'This project already exists');
      await user.click(submitButton);

      // Verify error message is displayed
      await waitFor(() => {
        expect(screen.getByText(/project name already exists/i)).toBeInTheDocument();
      });

      // Verify no navigation occurred
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Projexiq Flow', () => {
    it('displays project list and allows project selection', async () => {
      render(<ProjectCard project={mockProject} viewMode="grid" onClick={jest.fn()} />);

      // Verify project information is displayed
      expect(screen.getByText('Test Project')).toBeInTheDocument();
      expect(screen.getByText('This is a test project description')).toBeInTheDocument();
      expect(screen.getByText('75%')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('filters projects by status', async () => {
      const mockOnFiltersChange = jest.fn();
      render(<ProjectFilters filters={{ status: '', search: '' }} onFiltersChange={mockOnFiltersChange} onClearFilters={jest.fn()} totalResults={5} />);

      const statusFilter = screen.getByLabelText(/status/i);
      await user.click(statusFilter);

      const activeOption = screen.getByText(/active/i);
      await user.click(activeOption);

      // Verify filter change callback
      expect(mockOnFiltersChange).toHaveBeenCalledWith(expect.objectContaining({
        status: 'active',
      }));
    });

    it('searches projects by name', async () => {
      const mockOnFiltersChange = jest.fn();
      render(<ProjectFilters filters={{ status: '', search: '' }} onFiltersChange={mockOnFiltersChange} onClearFilters={jest.fn()} totalResults={5} />);

      const searchInput = screen.getByPlaceholderText(/search projects/i);
      await user.type(searchInput, 'test');

      // Verify search callback
      expect(mockOnFiltersChange).toHaveBeenCalledWith(expect.objectContaining({
        search: 'test',
      }));
    });

    it('clears all filters', async () => {
      const mockOnClearFilters = jest.fn();
      render(<ProjectFilters filters={{ status: 'active', search: 'test' }} onFiltersChange={jest.fn()} onClearFilters={mockOnClearFilters} totalResults={5} />);

      const clearButton = screen.getByRole('button', { name: /clear filters/i });
      await user.click(clearButton);

      // Verify clear filters callback
      expect(mockOnClearFilters).toHaveBeenCalled();
    });
  });

  describe('Project Actions Flow', () => {
    it('opens create project dialog when button is clicked', async () => {
      render(<CreateProjectButton />);

      const createButton = screen.getByRole('button', { name: /create project/i });
      await user.click(createButton);

      // Verify dialog opens
      await waitFor(() => {
        expect(screen.getByText(/create new project/i)).toBeInTheDocument();
      });
    });

    it('handles project deletion flow', async () => {
      const mockOnDelete = jest.fn();
      render(<ProjectCard project={mockProject} viewMode="grid" onClick={jest.fn()} onDelete={mockOnDelete} />);

      // Open project actions menu
      const menuButton = screen.getByLabelText(/more options/i);
      await user.click(menuButton);

      // Click delete option
      const deleteOption = screen.getByText(/delete/i);
      await user.click(deleteOption);

      // Verify delete confirmation dialog
      await waitFor(() => {
        expect(screen.getByText(/are you sure you want to delete/i)).toBeInTheDocument();
      });

      // Confirm deletion
      const confirmButton = screen.getByRole('button', { name: /delete/i });
      await user.click(confirmButton);

      // Verify delete callback
      expect(mockOnDelete).toHaveBeenCalledWith(mockProject.id);
    });

    it('handles project editing flow', async () => {
      const mockOnEdit = jest.fn();
      render(<ProjectCard project={mockProject} viewMode="grid" onClick={jest.fn()} onEdit={mockOnEdit} />);

      // Open project actions menu
      const menuButton = screen.getByLabelText(/more options/i);
      await user.click(menuButton);

      // Click edit option
      const editOption = screen.getByText(/edit/i);
      await user.click(editOption);

      // Verify edit callback
      expect(mockOnEdit).toHaveBeenCalledWith(mockProject);
    });
  });

  describe('Project View Modes', () => {
    it('displays projects in grid mode', () => {
      render(<ProjectCard project={mockProject} viewMode="grid" onClick={jest.fn()} />);

      // Verify grid layout elements
      expect(screen.getByText('Progress')).toBeInTheDocument();
      expect(screen.getByText('Due Date')).toBeInTheDocument();
      expect(screen.getByText('Budget')).toBeInTheDocument();
    });

    it('displays projects in list mode', () => {
      render(<ProjectCard project={mockProject} viewMode="list" onClick={jest.fn()} />);

      // Verify list layout elements
      expect(screen.getByText('Manager: John Doe')).toBeInTheDocument();
      expect(screen.getByText('Due: 12/31/2024')).toBeInTheDocument();
      expect(screen.getByText('Budget: USD 50,000')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles network errors during project creation', async () => {
      const networkError = new Error('Network error');
      mockCreateProject.mockRejectedValue(networkError);

      render(<ProjectForm />);

      const nameInput = screen.getByLabelText(/project name/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const submitButton = screen.getByRole('button', { name: /create project/i });

      await user.type(nameInput, 'Test Project');
      await user.type(descriptionInput, 'Test description');
      await user.click(submitButton);

      // Verify generic error message
      await waitFor(() => {
        expect(screen.getByText(/an unexpected error occurred/i)).toBeInTheDocument();
      });
    });

    it('handles validation errors during project update', async () => {
      const validationError = {
        status: 422,
        data: { 
          message: 'Validation failed',
          errors: {
            name: ['Project name is too short'],
            due_date: ['Due date must be after start date']
          }
        }
      };
      mockUpdateProject.mockRejectedValue(validationError);

      render(<ProjectForm mode="edit" project={mockProject} />);

      const nameInput = screen.getByLabelText(/project name/i);
      const submitButton = screen.getByRole('button', { name: /update project/i });

      await user.clear(nameInput);
      await user.type(nameInput, 'A');
      await user.click(submitButton);

      // Verify validation errors are displayed
      await waitFor(() => {
        expect(screen.getByText(/project name is too short/i)).toBeInTheDocument();
        expect(screen.getByText(/due date must be after start date/i)).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('shows loading state during project creation', async () => {
      mockCreateProject.mockImplementation(() => new Promise(() => {})); // Never resolves

      render(<ProjectForm />);

      const nameInput = screen.getByLabelText(/project name/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const submitButton = screen.getByRole('button', { name: /create project/i });

      await user.type(nameInput, 'Test Project');
      await user.type(descriptionInput, 'Test description');
      await user.click(submitButton);

      // Verify loading state
      await waitFor(() => {
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
      });
    });

    it('shows loading state during project update', async () => {
      mockUpdateProject.mockImplementation(() => new Promise(() => {})); // Never resolves

      render(<ProjectForm mode="edit" project={mockProject} />);

      const nameInput = screen.getByLabelText(/project name/i);
      const submitButton = screen.getByRole('button', { name: /update project/i });

      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Project Name');
      await user.click(submitButton);

      // Verify loading state
      await waitFor(() => {
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
      });
    });
  });
}); 