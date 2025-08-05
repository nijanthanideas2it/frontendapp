import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../utils/test-utils';
import { AppLayout } from '../../components/layout/AppLayout';

// Mock useMediaQuery to control responsive behavior
const mockUseMediaQuery = jest.fn();
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useMediaQuery: (query: unknown) => mockUseMediaQuery(query),
}));

describe('AppLayout', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    mockUseMediaQuery.mockReturnValue(false); // Default to desktop
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders children content', () => {
    render(
      <AppLayout>
        <div data-testid="test-content">Test content</div>
      </AppLayout>
    );

    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders header by default', () => {
    render(
      <AppLayout>
        <div>Test content</div>
      </AppLayout>
    );

    expect(screen.getByText('Projexiq Dashboard')).toBeInTheDocument();
    expect(screen.getByLabelText('open drawer')).toBeInTheDocument();
  });

  it('hides header when showHeader is false', () => {
    render(
      <AppLayout showHeader={false}>
        <div>Test content</div>
      </AppLayout>
    );

    expect(screen.queryByText('Projexiq Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('open drawer')).not.toBeInTheDocument();
  });

  it('renders sidebar by default', () => {
    render(
      <AppLayout>
        <div>Test content</div>
      </AppLayout>
    );

    expect(screen.getByText('Navigation')).toBeInTheDocument();
  });

  it('hides sidebar when showSidebar is false', () => {
    render(
      <AppLayout showSidebar={false}>
        <div>Test content</div>
      </AppLayout>
    );

    expect(screen.queryByText('Navigation')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('open drawer')).not.toBeInTheDocument();
  });

  it('toggles sidebar when menu button is clicked', async () => {
    render(
      <AppLayout>
        <div>Test content</div>
      </AppLayout>
    );

    const menuButton = screen.getByLabelText('open drawer');
    expect(menuButton).toBeInTheDocument();

    // Sidebar should be open by default on desktop
    expect(screen.getByText('Navigation')).toBeInTheDocument();

    await user.click(menuButton);

    // Sidebar should be toggled (closed)
    await waitFor(() => {
      expect(screen.queryByText('Navigation')).not.toBeInTheDocument();
    });
  });

  it('shows mobile sidebar on mobile devices', () => {
    mockUseMediaQuery.mockReturnValue(true); // Mobile

    render(
      <AppLayout>
        <div>Test content</div>
      </AppLayout>
    );

    // On mobile, sidebar should be closed by default
    expect(screen.queryByText('Navigation')).not.toBeInTheDocument();
  });

  it('opens mobile sidebar when menu button is clicked on mobile', async () => {
    mockUseMediaQuery.mockReturnValue(true); // Mobile

    render(
      <AppLayout>
        <div>Test content</div>
      </AppLayout>
    );

    const menuButton = screen.getByLabelText('open drawer');
    await user.click(menuButton);

    // Mobile sidebar should open
    expect(screen.getByText('Navigation')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(
      <AppLayout>
        <div>Test content</div>
      </AppLayout>
    );

    const menuButton = screen.getByLabelText('open drawer');
    expect(menuButton).toHaveAttribute('aria-label', 'open drawer');
    expect(menuButton).toHaveAttribute('edge', 'start');
  });

  it('maintains proper layout structure', () => {
    render(
      <AppLayout>
        <div>Test content</div>
      </AppLayout>
    );

    // Should have proper layout structure
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
  });

  it('renders with custom props', () => {
    render(
      <AppLayout showHeader={false} showSidebar={false}>
        <div data-testid="custom-content">Custom content</div>
      </AppLayout>
    );

    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    expect(screen.queryByText('Projexiq Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Navigation')).not.toBeInTheDocument();
  });

  it('handles keyboard navigation', async () => {
    render(
      <AppLayout>
        <div>Test content</div>
      </AppLayout>
    );

    const menuButton = screen.getByLabelText('open drawer');
    
    // Focus the menu button
    menuButton.focus();
    expect(menuButton).toHaveFocus();

    // Test keyboard interaction
    await user.keyboard('{Enter}');
    
    await waitFor(() => {
      expect(screen.queryByText('Navigation')).not.toBeInTheDocument();
    });
  });
}); 