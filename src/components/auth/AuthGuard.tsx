import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert, Button } from '@mui/material';
import { RootState } from '../../store';
import { logout, refreshToken } from '../../store/slices/authSlice';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  roles?: string[];
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  roles = [],
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user, loading, token, tokenExpiry } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // Check if token is expired
    if (token && tokenExpiry) {
      const now = new Date().getTime();
      const expiryTime = new Date(tokenExpiry).getTime();
      
      if (now >= expiryTime) {
        // Token is expired, try to refresh
        dispatch(refreshToken());
      }
    }
  }, [dispatch, token, tokenExpiry]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        gap={2}
      >
        <CircularProgress size={40} />
        <Typography variant="body2" color="text.secondary">
          Checking authentication...
        </Typography>
      </Box>
    );
  }

  // If authentication is not required, render children
  if (!requireAuth) {
    return <>{children}</>;
  }

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        gap={3}
        p={3}
      >
        <Alert severity="info" sx={{ maxWidth: 400 }}>
          <Typography variant="h6" gutterBottom>
            Authentication Required
          </Typography>
          <Typography variant="body2" paragraph>
            Please log in to access this page.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/auth/login')}
            sx={{ mt: 1 }}
          >
            Go to Login
          </Button>
        </Alert>
      </Box>
    );
  }

  // If roles are specified, check if user has required role
  if (roles.length > 0 && user) {
    const hasRequiredRole = roles.includes(user.role);
    if (!hasRequiredRole) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          gap={3}
          p={3}
        >
          <Alert severity="error" sx={{ maxWidth: 400 }}>
            <Typography variant="h6" gutterBottom>
              Access Denied
            </Typography>
            <Typography variant="body2" paragraph>
              You don't have permission to access this page.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/dashboard')}
              sx={{ mt: 1 }}
            >
              Go to Dashboard
            </Button>
          </Alert>
        </Box>
      );
    }
  }

  // User is authenticated and has required role (if specified)
  return <>{children}</>;
};

export default AuthGuard; 