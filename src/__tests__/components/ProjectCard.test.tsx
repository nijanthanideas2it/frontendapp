import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../utils/test-utils';
import { ProjectCard } from '../../components/projects/ProjectCard';

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

describe('ProjectCard', () => {
  const user = userEvent.setup();

  it('renders project information correctly in grid mode', () => {
    render(<ProjectCard project={mockProject} viewMode="grid" onClick={jest.fn()} />);

    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('This is a test project description')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('renders project information correctly in list mode', () => {
    render(<ProjectCard project={mockProject} viewMode="list" onClick={jest.fn()} />);

    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('This is a test project description')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('displays manager information', () => {
    render(<ProjectCard project={mockProject} viewMode="grid" onClick={jest.fn()} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('shows progress information', () => {
    render(<ProjectCard project={mockProject} viewMode="grid" onClick={jest.fn()} />);

    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('Progress')).toBeInTheDocument();
  });

  it('displays budget information', () => {
    render(<ProjectCard project={mockProject} viewMode="grid" onClick={jest.fn()} />);

    expect(screen.getByText('USD 50,000')).toBeInTheDocument();
  });

  it('displays due date information', () => {
    render(<ProjectCard project={mockProject} viewMode="grid" onClick={jest.fn()} />);

    expect(screen.getByText('Due Date')).toBeInTheDocument();
    expect(screen.getByText('12/31/2024')).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const mockOnClick = jest.fn();
    render(<ProjectCard project={mockProject} viewMode="grid" onClick={mockOnClick} />);

    const card = screen.getByRole('button');
    await user.click(card);

    expect(mockOnClick).toHaveBeenCalled();
  });

  it('displays correct status colors', () => {
    const activeProject = { ...mockProject, status: 'active' as const };
    const completedProject = { ...mockProject, status: 'completed' as const };
    const onHoldProject = { ...mockProject, status: 'on-hold' as const };
    const cancelledProject = { ...mockProject, status: 'cancelled' as const };

    const { rerender } = render(
      <ProjectCard project={activeProject} viewMode="grid" onClick={jest.fn()} />
    );
    expect(screen.getByText('Active')).toBeInTheDocument();

    rerender(<ProjectCard project={completedProject} viewMode="grid" onClick={jest.fn()} />);
    expect(screen.getByText('Completed')).toBeInTheDocument();

    rerender(<ProjectCard project={onHoldProject} viewMode="grid" onClick={jest.fn()} />);
    expect(screen.getByText('On Hold')).toBeInTheDocument();

    rerender(<ProjectCard project={cancelledProject} viewMode="grid" onClick={jest.fn()} />);
    expect(screen.getByText('Cancelled')).toBeInTheDocument();
  });

  it('displays manager avatar with fallback', () => {
    const projectWithoutAvatar = {
      ...mockProject,
      manager: { ...mockProject.manager, avatar: undefined },
    };

    render(<ProjectCard project={projectWithoutAvatar} viewMode="grid" onClick={jest.fn()} />);

    // Should show first letter of manager name as fallback
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<ProjectCard project={mockProject} viewMode="grid" onClick={jest.fn()} />);

    const card = screen.getByRole('button');
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute('tabIndex', '0');
  });

  it('handles keyboard navigation', async () => {
    const mockOnClick = jest.fn();
    render(<ProjectCard project={mockProject} viewMode="grid" onClick={mockOnClick} />);

    const card = screen.getByRole('button');
    card.focus();
    expect(card).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(mockOnClick).toHaveBeenCalled();
  });

  it('displays progress bar correctly', () => {
    render(<ProjectCard project={mockProject} viewMode="grid" onClick={jest.fn()} />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '75');
  });

  it('handles different view modes correctly', () => {
    const { rerender } = render(
      <ProjectCard project={mockProject} viewMode="grid" onClick={jest.fn()} />
    );

    // Grid mode should show detailed layout
    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.getByText('Due Date')).toBeInTheDocument();

    rerender(<ProjectCard project={mockProject} viewMode="list" onClick={jest.fn()} />);

    // List mode should show compact layout
    expect(screen.getByText('Manager: John Doe')).toBeInTheDocument();
    expect(screen.getByText('Due: 12/31/2024')).toBeInTheDocument();
  });
}); 