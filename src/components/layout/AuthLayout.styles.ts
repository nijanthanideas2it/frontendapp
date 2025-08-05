import { styled } from '@mui/material/styles';
import { Box, Container, Paper } from '@mui/material';

export const AuthContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    opacity: 0.3,
  },
}));

export const AuthPaper = styled(Paper)(({ theme }) => ({
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
  border: '1px solid rgba(255, 255, 255, 0.2)',
  position: 'relative',
  zIndex: 1,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
    borderRadius: 12,
    maxWidth: '100%',
  },
}));

export const LogoSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  '& .logo-icon': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: theme.spacing(2),
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
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

export const AuthContent = styled(Box)(({ theme }) => ({
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
    lineHeight: 1.5,
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
      marginBottom: theme.spacing(3),
    },
  },
}));

export const AuthFormContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  '& .MuiTextField-root': {
    marginBottom: theme.spacing(2),
  },
  '& .MuiButton-root': {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    height: 48,
    fontSize: '1rem',
    fontWeight: 600,
    textTransform: 'none',
    borderRadius: 8,
  },
}));

export const AuthLinks = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginTop: theme.spacing(2),
  '& a': {
    textDecoration: 'none',
    color: theme.palette.primary.main,
    fontWeight: 500,
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

export const AuthDivider = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  margin: theme.spacing(3, 0),
  '&::before, &::after': {
    content: '""',
    flex: 1,
    height: 1,
    backgroundColor: theme.palette.divider,
  },
  '& .divider-text': {
    padding: theme.spacing(0, 2),
    color: theme.palette.text.secondary,
    fontSize: 14,
  },
})); 