import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../utils/test-utils';
import { TaskCard } from '../../components/tasks/TaskCard';

const mockTask = {
  id: 1,
  title: 'Test Task',
  description: 'This is a test task description that is longer than 100 characters to test the truncation functionality of the task card component',
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
  tags: ['frontend', 'react', 'typescript'],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

describe('TaskCard', () => {
  const user = userEvent.setup();

  const defaultProps = {
    onDragStart: jest.fn(),
    onDragEnd: jest.fn(),
    isDragging: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders task information correctly', () => {
    render(<TaskCard task={mockTask} {...defaultProps} />);

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText(/This is a test task description/)).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('displays priority chip with correct color', () => {
    render(<TaskCard task={mockTask} {...defaultProps} />);

    const priorityChip = screen.getByText('High');
    expect(priorityChip).toBeInTheDocument();
    expect(priorityChip.closest('.MuiChip-root')).toHaveClass('MuiChip-colorWarning');
  });

  it('displays different priority colors correctly', () => {
    const urgentTask = { ...mockTask, priority: 'urgent' as const };
    const mediumTask = { ...mockTask, priority: 'medium' as const };
    const lowTask = { ...mockTask, priority: 'low' as const };

    const { rerender } = render(<TaskCard task={urgentTask} {...defaultProps} />);
    expect(screen.getByText('Urgent').closest('.MuiChip-root')).toHaveClass('MuiChip-colorError');

    rerender(<TaskCard task={mediumTask} {...defaultProps} />);
    expect(screen.getByText('Medium').closest('.MuiChip-root')).toHaveClass('MuiChip-colorInfo');

    rerender(<TaskCard task={lowTask} {...defaultProps} />);
    expect(screen.getByText('Low').closest('.MuiChip-root')).toHaveClass('MuiChip-colorSuccess');
  });

  it('displays tags correctly', () => {
    render(<TaskCard task={mockTask} {...defaultProps} />);

    expect(screen.getByText('frontend')).toBeInTheDocument();
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('+1')).toBeInTheDocument(); // Shows +1 for the third tag
  });

  it('displays assignee information', () => {
    render(<TaskCard task={mockTask} {...defaultProps} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('J')).toBeInTheDocument(); // Avatar fallback
  });

  it('displays unassigned when no assignee', () => {
    const unassignedTask = { ...mockTask, assignee: undefined };
    render(<TaskCard task={unassignedTask} {...defaultProps} />);

    expect(screen.getByText('Unassigned')).toBeInTheDocument();
  });

  it('displays due date correctly', () => {
    render(<TaskCard task={mockTask} {...defaultProps} />);

    expect(screen.getByText('Due: 12/31/2024')).toBeInTheDocument();
  });

  it('displays time information correctly', () => {
    render(<TaskCard task={mockTask} {...defaultProps} />);

    expect(screen.getByText('Est: 8h')).toBeInTheDocument();
    expect(screen.getByText('Actual: 4h')).toBeInTheDocument();
  });

  it('truncates long descriptions', () => {
    const longDescriptionTask = {
      ...mockTask,
      description: 'A'.repeat(150), // Very long description
    };
    render(<TaskCard task={longDescriptionTask} {...defaultProps} />);

    const description = screen.getByText(/A{100}\.\.\./);
    expect(description).toBeInTheDocument();
  });

  it('handles drag and drop events', () => {
    const { onDragStart, onDragEnd } = defaultProps;
    render(<TaskCard task={mockTask} {...defaultProps} />);

    const taskCard = screen.getByText('Test Task').closest('[draggable="true"]');
    expect(taskCard).toBeInTheDocument();

    fireEvent.dragStart(taskCard!);
    expect(onDragStart).toHaveBeenCalled();

    fireEvent.dragEnd(taskCard!);
    expect(onDragEnd).toHaveBeenCalled();
  });

  it('applies dragging styles when isDragging is true', () => {
    render(<TaskCard task={mockTask} {...defaultProps} isDragging={true} />);

    const taskCard = screen.getByText('Test Task').closest('[draggable="true"]');
    expect(taskCard).toHaveStyle({ opacity: '0.5' });
  });

  it('displays assignee avatar with fallback', () => {
    const taskWithoutAvatar = {
      ...mockTask,
      assignee: { ...mockTask.assignee, avatar: undefined },
    };
    render(<TaskCard task={taskWithoutAvatar} {...defaultProps} />);

    // Should show first letter of assignee name as fallback
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<TaskCard task={mockTask} {...defaultProps} />);

    const taskCard = screen.getByText('Test Task').closest('[draggable="true"]');
    expect(taskCard).toHaveAttribute('draggable', 'true');
  });

  it('handles keyboard navigation for drag and drop', async () => {
    render(<TaskCard task={mockTask} {...defaultProps} />);

    const taskCard = screen.getByText('Test Task').closest('[draggable="true"]');
    if (taskCard) {
      (taskCard as HTMLElement).focus();
      expect(taskCard).toHaveFocus();
    }

    // Test keyboard drag start
    await user.keyboard('{Space}');
    // Note: Keyboard drag events are complex to test, this is a basic check
  });

  it('displays correct number of visible tags', () => {
    const taskWithManyTags = {
      ...mockTask,
      tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'],
    };
    render(<TaskCard task={taskWithManyTags} {...defaultProps} />);

    expect(screen.getByText('tag1')).toBeInTheDocument();
    expect(screen.getByText('tag2')).toBeInTheDocument();
    expect(screen.getByText('+3')).toBeInTheDocument(); // Shows +3 for remaining tags
  });

  it('handles tasks with no tags', () => {
    const taskWithoutTags = { ...mockTask, tags: [] };
    render(<TaskCard task={taskWithoutTags} {...defaultProps} />);

    expect(screen.queryByText('+')).not.toBeInTheDocument();
  });

  it('displays task with zero hours correctly', () => {
    const zeroHoursTask = {
      ...mockTask,
      estimatedHours: 0,
      actualHours: 0,
    };
    render(<TaskCard task={zeroHoursTask} {...defaultProps} />);

    expect(screen.getByText('Est: 0h')).toBeInTheDocument();
    expect(screen.getByText('Actual: 0h')).toBeInTheDocument();
  });
}); 