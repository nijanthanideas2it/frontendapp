import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

interface PasswordStrengthIndicatorProps {
  password: string;
}

interface StrengthCriteria {
  label: string;
  test: (password: string) => boolean;
  color: string;
}

const strengthCriteria: StrengthCriteria[] = [
  {
    label: 'At least 8 characters',
    test: (password: string) => password.length >= 8,
    color: '#f44336',
  },
  {
    label: 'Contains uppercase letter',
    test: (password: string) => /[A-Z]/.test(password),
    color: '#ff9800',
  },
  {
    label: 'Contains lowercase letter',
    test: (password: string) => /[a-z]/.test(password),
    color: '#ffc107',
  },
  {
    label: 'Contains number',
    test: (password: string) => /\d/.test(password),
    color: '#4caf50',
  },
  {
    label: 'Contains special character',
    test: (password: string) => /[@$!%*?&]/.test(password),
    color: '#2196f3',
  },
];

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const getStrengthScore = (password: string): number => {
    if (!password) return 0;
    
    const passedCriteria = strengthCriteria.filter(criteria => criteria.test(password));
    return (passedCriteria.length / strengthCriteria.length) * 100;
  };

  const getStrengthColor = (score: number): string => {
    if (score < 20) return '#f44336';
    if (score < 40) return '#ff9800';
    if (score < 60) return '#ffc107';
    if (score < 80) return '#4caf50';
    return '#2e7d32';
  };

  const getStrengthLabel = (score: number): string => {
    if (score < 20) return 'Very Weak';
    if (score < 40) return 'Weak';
    if (score < 60) return 'Fair';
    if (score < 80) return 'Good';
    return 'Strong';
  };

  const strengthScore = getStrengthScore(password);
  const strengthColor = getStrengthColor(strengthScore);
  const strengthLabel = getStrengthLabel(strengthScore);

  if (!password) return null;

  return (
    <Box sx={{ mt: 1, mb: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Password Strength
        </Typography>
        <Typography variant="caption" sx={{ color: strengthColor, fontWeight: 600 }}>
          {strengthLabel}
        </Typography>
      </Box>
      
      <LinearProgress
        variant="determinate"
        value={strengthScore}
        sx={{
          height: 4,
          borderRadius: 2,
          backgroundColor: '#e0e0e0',
          '& .MuiLinearProgress-bar': {
            backgroundColor: strengthColor,
            borderRadius: 2,
          },
        }}
      />
      
      <Box sx={{ mt: 1 }}>
        {strengthCriteria.map((criteria, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 0.5,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: criteria.test(password) ? criteria.color : '#e0e0e0',
                mr: 1,
              }}
            />
            <Typography variant="caption" color="text.secondary">
              {criteria.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PasswordStrengthIndicator; 