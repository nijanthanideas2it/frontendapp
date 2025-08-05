import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../utils/test-utils';
import { TaskForm } from '../../components/tasks/TaskForm';
import { TaskCard } from '../../components/tasks/TaskCard';
import { KanbanBoard } from '../../components/tasks/KanbanBoard';
import { TimeTracker } from '../../components/tasks/TimeTracker';

// Mock the task API
const mockCreateTask = jest.fn();
const mockUpdateTask = jest.fn();
const mockGetTasks = jest.fn();
const mockDeleteTask = jest.fn();
const mockUpdateTaskStatus = jest.fn();
const mockStartTimeTracking = jest.fn();
const mockStopTimeTracking = jest.fn();

jest.mock('../../store/api/taskApi', () => ({
  useCreateTaskMutation: () => [mockCreateTask, { isLoading: false, error: null }],
  useUpdateTaskMutation: () => [mockUpdateTask, { isLoading: false, error: null }],
  useGetTasksQuery: () => ({ data: null, isLoading: false, error: null }),
  useDeleteTaskMutation: () => [mockDeleteTask, { isLoading: false, error: null }],
  useUpdateTaskStatusMutation: () => [mockUpdateTaskStatus, { isLoading: false, error: null }],
  useStartTimeTrackingMutation: () => [mockStartTimeTracking, { isLoading: false, error: null }],
  useStopTimeTrackingMutation: () => [mockStopTimeTracking, { isLoading: false, error: null }],
}));

// Mock react-router-dom
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockTask = {
  id: 1,
  title: 'Test Task',
  description: 'This is a test task description',
  status: 'in-progress' as const,
  priority: 'high' as const,
  assignee: {
    id: 1,
    name: 'John Doe',
    avatar: 'https://example.com/avatar.jpg',
  },
  dueDate: '2024-12-31',
  estimatedHours: 8,
  actualHours: 4,
  projectId: 1,
  dependencies: [],
  tags: ['frontend', 'react'],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

describe('Task Management Integration Tests', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateTask.mockResolvedValue({ data: mockTask });
    mockUpdateTask.mockResolvedValue({ data: mockTask });
    mockGetTasks.mockResolvedValue({ data: [mockTask] });
    mockDeleteTask.mockResolvedValue({ data: { success: true } });
    mockUpdateTaskStatus.mockResolvedValue({ data: mockTask });
    mockStartTimeTracking.mockResolvedValue({ data: { success: true } });
    mockStopTimeTracking.mockResolvedValue({ data: { success: true } });
  });

  describe('Task Creation Flow', () => {
    it('completes full task creation flow successfully', async () => {
      render(<TaskForm />);

      // Fill in task form
      const titleInput = screen.getByLabelText(/task title/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const prioritySelect = screen.getByLabelText(/priority/i);
      const dueDateInput = screen.getByLabelText(/due date/i);
      const estimatedHoursInput = screen.getByLabelText(/estimated hours/i);
      const submitButton = screen.getByRole('button', { name: /create task/i });

      await user.type(titleInput, 'New Test Task');
      await user.type(descriptionInput, 'This is a new test task');
      await user.selectOptions(prioritySelect, 'high');
      await user.type(dueDateInput, '2024-12-31');
      await user.type(estimatedHoursInput, '10');

      // Submit form
      await user.click(submitButton);

      // Verify API call
      await waitFor(() => {
        expect(mockCreateTask).toHaveBeenCalledWith({
          title: 'New Test Task',
          description: 'This is a new test task',
          priority: 'high',
          due_date: '2024-12-31',
          estimated_hours: 10,
        });
      });

      // Verify navigation to task details
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/tasks/1');
      });
    });

    it('validates required fields before submission', async () => {
      render(<TaskForm />);

      const submitButton = screen.getByRole('button', { name: /create task/i });
      await user.click(submitButton);

      // Verify validation errors
      await waitFor(() => {
        expect(screen.getByText(/task title is required/i)).toBeInTheDocument();
        expect(screen.getByText(/description is required/i)).toBeInTheDocument();
      });

      // Verify no API call was made
      expect(mockCreateTask).not.toHaveBeenCalled();
    });

    it('handles task creation failure', async () => {
      const createError = {
        status: 400,
        data: { message: 'Task title already exists' }
      };
      mockCreateTask.mockRejectedValue(createError);

      render(<TaskForm />);

      const titleInput = screen.getByLabelText(/task title/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const submitButton = screen.getByRole('button', { name: /create task/i });

      await user.type(titleInput, 'Existing Task');
      await user.type(descriptionInput, 'This task already exists');
      await user.click(submitButton);

      // Verify error message is displayed
      await waitFor(() => {
        expect(screen.getByText(/task title already exists/i)).toBeInTheDocument();
      });

      // Verify no navigation occurred
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Task Management Flow', () => {
    it('displays task information and allows task interaction', async () => {
      const mockOnClick = jest.fn();
      render(<TaskCard task={mockTask} onDragStart={jest.fn()} onDragEnd={jest.fn()} isDragging={false} onClick={mockOnClick} />);

      // Verify task information is displayed
      expect(screen.getByText('Test Task')).toBeInTheDocument();
      expect(screen.getByText('This is a test task description')).toBeInTheDocument();
      expect(screen.getByText('High')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();

      // Click on task card
      const taskCard = screen.getByText('Test Task').closest('[draggable="true"]');
      await user.click(taskCard!);

      // Verify click callback
      expect(mockOnClick).toHaveBeenCalled();
    });

    it('handles task status updates', async () => {
      const mockOnStatusChange = jest.fn();
      render(<TaskCard task={mockTask} onDragStart={jest.fn()} onDragEnd={jest.fn()} isDragging={false} onStatusChange={mockOnStatusChange} />);

      // Open task actions menu
      const menuButton = screen.getByLabelText(/more options/i);
      await user.click(menuButton);

      // Click status change option
      const statusOption = screen.getByText(/mark as completed/i);
      await user.click(statusOption);

      // Verify status change callback
      expect(mockOnStatusChange).toHaveBeenCalledWith(mockTask.id, 'completed');
    });

    it('handles task priority updates', async () => {
      const mockOnPriorityChange = jest.fn();
      render(<TaskCard task={mockTask} onDragStart={jest.fn()} onDragEnd={jest.fn()} isDragging={false} onPriorityChange={mockOnPriorityChange} />);

      // Open task actions menu
      const menuButton = screen.getByLabelText(/more options/i);
      await user.click(menuButton);

      // Click priority change option
      const priorityOption = screen.getByText(/change priority/i);
      await user.click(priorityOption);

      // Select new priority
      const mediumPriority = screen.getByText(/medium/i);
      await user.click(mediumPriority);

      // Verify priority change callback
      expect(mockOnPriorityChange).toHaveBeenCalledWith(mockTask.id, 'medium');
    });
  });

  describe('Kanban Board Flow', () => {
    it('displays tasks in different columns based on status', () => {
      const mockTasks = [
        { ...mockTask, id: 1, status: 'todo' as const },
        { ...mockTask, id: 2, status: 'in-progress' as const },
        { ...mockTask, id: 3, status: 'completed' as const },
      ];

      render(<KanbanBoard tasks={mockTasks} onTaskMove={jest.fn()} onTaskClick={jest.fn()} />);

      // Verify columns are displayed
      expect(screen.getByText('To Do')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();

      // Verify tasks are in correct columns
      expect(screen.getAllByText('Test Task')).toHaveLength(3);
    });

    it('handles drag and drop task movement', async () => {
      const mockOnTaskMove = jest.fn();
      render(<KanbanBoard tasks={[mockTask]} onTaskMove={mockOnTaskMove} onTaskClick={jest.fn()} />);

      // Simulate drag and drop
      const taskCard = screen.getByText('Test Task').closest('[draggable="true"]');
      const completedColumn = screen.getByText('Completed').closest('[data-testid="column-completed"]');

      // This is a simplified test - in a real scenario, you'd use a drag and drop testing library
      fireEvent.dragStart(taskCard!);
      fireEvent.drop(completedColumn!);

      // Verify task move callback
      expect(mockOnTaskMove).toHaveBeenCalledWith(mockTask.id, 'completed');
    });
  });

  describe('Time Tracking Flow', () => {
    it('starts time tracking for a task', async () => {
      render(<TimeTracker taskId={mockTask.id} isTracking={false} onStart={jest.fn()} onStop={jest.fn()} />);

      const startButton = screen.getByRole('button', { name: /start timer/i });
      await user.click(startButton);

      // Verify start tracking callback
      expect(mockStartTimeTracking).toHaveBeenCalledWith(mockTask.id);
    });

    it('stops time tracking for a task', async () => {
      render(<TimeTracker taskId={mockTask.id} isTracking={true} onStart={jest.fn()} onStop={jest.fn()} />);

      const stopButton = screen.getByRole('button', { name: /stop timer/i });
      await user.click(stopButton);

      // Verify stop tracking callback
      expect(mockStopTimeTracking).toHaveBeenCalledWith(mockTask.id);
    });

    it('displays tracking status correctly', () => {
      render(<TimeTracker taskId={mockTask.id} isTracking={true} onStart={jest.fn()} onStop={jest.fn()} />);

      // Verify tracking status is displayed
      expect(screen.getByText(/tracking time/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /stop timer/i })).toBeInTheDocument();
    });
  });

  describe('Task Dependencies Flow', () => {
    it('displays task dependencies', () => {
      const taskWithDependencies = {
        ...mockTask,
        dependencies: [
          { id: 2, title: 'Dependency Task 1' },
          { id: 3, title: 'Dependency Task 2' },
        ],
      };

      render(<TaskCard task={taskWithDependencies} onDragStart={jest.fn()} onDragEnd={jest.fn()} isDragging={false} />);

      // Verify dependencies are displayed
      expect(screen.getByText('Dependency Task 1')).toBeInTheDocument();
      expect(screen.getByText('Dependency Task 2')).toBeInTheDocument();
    });

    it('prevents task completion when dependencies are not met', async () => {
      const taskWithUncompletedDependencies = {
        ...mockTask,
        dependencies: [
          { id: 2, title: 'Dependency Task', status: 'in-progress' },
        ],
      };

      const mockOnStatusChange = jest.fn();
      render(<TaskCard task={taskWithUncompletedDependencies} onDragStart={jest.fn()} onDragEnd={jest.fn()} isDragging={false} onStatusChange={mockOnStatusChange} />);

      // Try to mark as completed
      const menuButton = screen.getByLabelText(/more options/i);
      await user.click(menuButton);

      const completeOption = screen.getByText(/mark as completed/i);
      await user.click(completeOption);

      // Verify warning message
      await waitFor(() => {
        expect(screen.getByText(/cannot complete task/i)).toBeInTheDocument();
        expect(screen.getByText(/complete dependencies first/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('handles network errors during task creation', async () => {
      const networkError = new Error('Network error');
      mockCreateTask.mockRejectedValue(networkError);

      render(<TaskForm />);

      const titleInput = screen.getByLabelText(/task title/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const submitButton = screen.getByRole('button', { name: /create task/i });

      await user.type(titleInput, 'Test Task');
      await user.type(descriptionInput, 'Test description');
      await user.click(submitButton);

      // Verify generic error message
      await waitFor(() => {
        expect(screen.getByText(/an unexpected error occurred/i)).toBeInTheDocument();
      });
    });

    it('handles validation errors during task update', async () => {
      const validationError = {
        status: 422,
        data: { 
          message: 'Validation failed',
          errors: {
            title: ['Task title is too short'],
            due_date: ['Due date must be in the future']
          }
        }
      };
      mockUpdateTask.mockRejectedValue(validationError);

      render(<TaskForm mode="edit" task={mockTask} />);

      const titleInput = screen.getByLabelText(/task title/i);
      const submitButton = screen.getByRole('button', { name: /update task/i });

      await user.clear(titleInput);
      await user.type(titleInput, 'A');
      await user.click(submitButton);

      // Verify validation errors are displayed
      await waitFor(() => {
        expect(screen.getByText(/task title is too short/i)).toBeInTheDocument();
        expect(screen.getByText(/due date must be in the future/i)).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('shows loading state during task creation', async () => {
      mockCreateTask.mockImplementation(() => new Promise(() => {})); // Never resolves

      render(<TaskForm />);

      const titleInput = screen.getByLabelText(/task title/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const submitButton = screen.getByRole('button', { name: /create task/i });

      await user.type(titleInput, 'Test Task');
      await user.type(descriptionInput, 'Test description');
      await user.click(submitButton);

      // Verify loading state
      await waitFor(() => {
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
      });
    });

    it('shows loading state during task update', async () => {
      mockUpdateTask.mockImplementation(() => new Promise(() => {})); // Never resolves

      render(<TaskForm mode="edit" task={mockTask} />);

      const titleInput = screen.getByLabelText(/task title/i);
      const submitButton = screen.getByRole('button', { name: /update task/i });

      await user.clear(titleInput);
      await user.type(titleInput, 'Updated Task Title');
      await user.click(submitButton);

      // Verify loading state
      await waitFor(() => {
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
      });
    });
  });
}); 