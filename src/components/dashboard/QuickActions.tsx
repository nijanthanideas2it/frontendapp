import React from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  route: string;
}

const quickActions: QuickAction[] = [
  {
    id: 'create-project',
    title: 'Create Project',
    description: 'Start a new project',
    icon: '📁',
    color: 'primary',
    route: '/projects/create',
  },
  {
    id: 'create-task',
    title: 'Create Task',
    description: 'Add a new task',
    icon: '📝',
    color: 'success',
    route: '/tasks/create',
  },
  {
    id: 'view-projects',
    title: 'View Projects',
    description: 'Browse all projects',
    icon: '👁️',
    color: 'info',
    route: '/projects',
  },
  {
    id: 'view-tasks',
    title: 'View Tasks',
    description: 'See all tasks',
    icon: '📋',
    color: 'warning',
    route: '/tasks',
  },
  {
    id: 'time-tracking',
    title: 'Time Tracking',
    description: 'Log time entries',
    icon: '⏱️',
    color: 'secondary',
    route: '/time',
  },
  {
    id: 'reports',
    title: 'Reports',
    description: 'View analytics',
    icon: '📊',
    color: 'error',
    route: '/reports',
  },
];

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const handleActionClick = (route: string) => {
    navigate(route);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={2}>
        {quickActions.map((action) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={action.id}>
            <Button
              variant="outlined"
              color={action.color}
              onClick={() => handleActionClick(action.route)}
              sx={{
                height: 120,
                width: '100%',
                flexDirection: 'column',
                gap: 1,
                borderRadius: 2,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  transform: 'translateY(-2px)',
                  boxShadow: 2,
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <Box sx={{ fontSize: 32, mb: 1 }}>
                {action.icon}
              </Box>
              <Typography variant="subtitle2" fontWeight={600}>
                {action.title}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
                {action.description}
              </Typography>
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default QuickActions; 