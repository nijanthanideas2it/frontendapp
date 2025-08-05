import React from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  maxWidth?: 'xs' | 'sm' | 'md';
}

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  maxWidth: 500,
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(10px)',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
    borderRadius: 12,
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  '& .logo-icon': {
    fontSize: 48,
    color: theme.palette.primary.main,
    marginRight: theme.spacing(2),
  },
  '& .logo-text': {
    fontSize: 28,
    fontWeight: 700,
    color: theme.palette.primary.main,
    [theme.breakpoints.down('sm')]: {
      fontSize: 24,
    },
  },
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  '& .auth-title': {
    fontSize: 32,
    fontWeight: 700,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(1),
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      fontSize: 28,
    },
  },
  '& .auth-subtitle': {
    fontSize: 16,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(4),
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
      marginBottom: theme.spacing(3),
    },
  },
}));

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  maxWidth = 'sm',
}) => {
  return (
    <StyledContainer maxWidth={maxWidth}>
      <StyledPaper elevation={3}>
        <LogoContainer>
          <Box
            className="logo-icon"
            component="span"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              color: 'white',
              fontSize: 24,
              fontWeight: 'bold',
            }}
          >
            PM
          </Box>
          <Typography className="logo-text">
            ProjectManager
          </Typography>
        </LogoContainer>

        <ContentContainer>
          <Typography className="auth-title" component="h1">
            {title}
          </Typography>
          {subtitle && (
            <Typography className="auth-subtitle" component="p">
              {subtitle}
            </Typography>
          )}
          {children}
        </ContentContainer>
      </StyledPaper>
    </StyledContainer>
  );
};

export default AuthLayout; 