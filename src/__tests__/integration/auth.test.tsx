import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../utils/test-utils';
import { LoginForm } from '../../components/auth/LoginForm';
import { RegisterForm } from '../../components/auth/RegisterForm';
import { AuthGuard } from '../../components/auth/AuthGuard';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';

// Mock the auth API
const mockLogin = jest.fn();
const mockRegister = jest.fn();

jest.mock('../../store/api/authApi', () => ({
  useLoginMutation: () => [mockLogin, { isLoading: false, error: null }],
  useRegisterMutation: () => [mockRegister, { isLoading: false, error: null }],
  useGetCurrentUserQuery: () => ({ data: null, isLoading: false, error: null }),
}));

// Mock react-router-dom
const mockNavigate = jest.fn();
const mockUseLocation = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => mockUseLocation(),
}));

describe('Authentication Integration Tests', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocation.mockReturnValue({ pathname: '/auth/login' });
    mockLogin.mockResolvedValue({ data: { access_token: 'test-token', user: { id: 1, email: 'test@example.com' } } });
    mockRegister.mockResolvedValue({ data: { access_token: 'test-token', user: { id: 1, email: 'test@example.com' } } });
  });

  describe('Login Flow', () => {
    it('completes full login flow successfully', async () => {
      render(<LoginForm />);

      // Fill in login form
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');

      // Submit form
      await user.click(submitButton);

      // Verify API call
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      // Verify navigation to dashboard
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('handles login failure and shows error message', async () => {
      const loginError = {
        status: 401,
        data: { message: 'Invalid credentials' }
      };
      mockLogin.mockRejectedValue(loginError);

      render(<LoginForm />);

      // Fill in login form
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'wrongpassword');

      // Submit form
      await user.click(submitButton);

      // Verify error message is displayed
      await waitFor(() => {
        expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
      });

      // Verify no navigation occurred
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('validates form fields before submission', async () => {
      render(<LoginForm />);

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      // Verify validation errors
      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });

      // Verify no API call was made
      expect(mockLogin).not.toHaveBeenCalled();
    });
  });

  describe('Registration Flow', () => {
    it('completes full registration flow successfully', async () => {
      render(<RegisterForm />);

      // Fill in registration form
      const firstNameInput = screen.getByLabelText(/first name/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      await user.type(firstNameInput, 'John');
      await user.type(lastNameInput, 'Doe');
      await user.type(emailInput, 'john.doe@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');

      // Submit form
      await user.click(submitButton);

      // Verify API call
      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith({
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          password: 'password123',
          confirm_password: 'password123',
        });
      });

      // Verify navigation to dashboard
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('validates password confirmation match', async () => {
      render(<RegisterForm />);

      const passwordInput = screen.getByLabelText(/password/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'differentpassword');

      await user.click(submitButton);

      // Verify validation error
      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });

      // Verify no API call was made
      expect(mockRegister).not.toHaveBeenCalled();
    });
  });

  describe('Protected Route Flow', () => {
    it('redirects unauthenticated users to login', async () => {
      mockUseLocation.mockReturnValue({ pathname: '/dashboard' });

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      // Verify redirect to login
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/auth/login', { 
          state: { from: '/dashboard' } 
        });
      });
    });

    it('allows authenticated users to access protected routes', async () => {
      // Mock authenticated user
      jest.doMock('../../store/api/authApi', () => ({
        useGetCurrentUserQuery: () => ({ 
          data: { id: 1, email: 'test@example.com' }, 
          isLoading: false, 
          error: null 
        }),
      }));

      mockUseLocation.mockReturnValue({ pathname: '/dashboard' });

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      // Verify protected content is rendered
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });

  describe('Auth Guard Flow', () => {
    it('redirects authenticated users away from auth pages', async () => {
      // Mock authenticated user
      jest.doMock('../../store/api/authApi', () => ({
        useGetCurrentUserQuery: () => ({ 
          data: { id: 1, email: 'test@example.com' }, 
          isLoading: false, 
          error: null 
        }),
      }));

      mockUseLocation.mockReturnValue({ pathname: '/auth/login' });

      render(
        <AuthGuard>
          <LoginForm />
        </AuthGuard>
      );

      // Verify redirect to dashboard
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('allows unauthenticated users to access auth pages', async () => {
      mockUseLocation.mockReturnValue({ pathname: '/auth/login' });

      render(
        <AuthGuard>
          <LoginForm />
        </AuthGuard>
      );

      // Verify login form is rendered
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles network errors during login', async () => {
      const networkError = new Error('Network error');
      mockLogin.mockRejectedValue(networkError);

      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      // Verify generic error message
      await waitFor(() => {
        expect(screen.getByText(/an unexpected error occurred/i)).toBeInTheDocument();
      });
    });

    it('handles server validation errors during registration', async () => {
      const validationError = {
        status: 422,
        data: { 
          message: 'Validation failed',
          errors: {
            email: ['Email already exists'],
            password: ['Password is too weak']
          }
        }
      };
      mockRegister.mockRejectedValue(validationError);

      render(<RegisterForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      await user.type(emailInput, 'existing@example.com');
      await user.type(passwordInput, 'weak');
      await user.click(submitButton);

      // Verify validation errors are displayed
      await waitFor(() => {
        expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
        expect(screen.getByText(/password is too weak/i)).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('shows loading state during login', async () => {
      mockLogin.mockImplementation(() => new Promise(() => {})); // Never resolves

      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      // Verify loading state
      await waitFor(() => {
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
      });
    });

    it('shows loading state during registration', async () => {
      mockRegister.mockImplementation(() => new Promise(() => {})); // Never resolves

      render(<RegisterForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      // Verify loading state
      await waitFor(() => {
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
      });
    });
  });
}); 