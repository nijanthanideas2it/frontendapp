import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Chip,
  Card,
  CardContent,
  CardActions,
  Button,
  useTheme,
  Alert,
} from '@mui/material';
import { useGetProjectTasksQuery } from '../../store/api/taskApi';

export const TasksList: React.FC = () => {
  const theme = useTheme();
  const [selectedProjectId] = useState('9b66f82c-3d4e-437f-8cd4-5e4ee3e6b676'); // Default project

  const { data: tasksData, isLoading, error } = useGetProjectTasksQuery({
    projectId: selectedProjectId,
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'done':
        return 'success';
      case 'inprogress':
        return 'warning';
      case 'todo':
        return 'default';
      case 'review':
        return 'info';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      case 'critical':
        return 'error';
      default:
        return 'default';
    }
  };

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load tasks. Please try again.
        </Alert>
      </Container>
    );
  }

  const tasks = tasksData?.data || [];

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
          Tasks
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage and track your project tasks
        </Typography>
      </Box>

      {/* Tasks Count */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          {tasks.length} task{tasks.length !== 1 ? 's' : ''} found
        </Typography>
      </Box>

      {/* Tasks Grid */}
      {isLoading ? (
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  minHeight: 200,
                }}
              >
                <Box sx={{ width: '60%', height: 20, bgcolor: 'grey.300', borderRadius: 1, mb: 2 }} />
                <Box sx={{ width: '40%', height: 16, bgcolor: 'grey.200', borderRadius: 1, mb: 2 }} />
                <Box sx={{ width: '100%', height: 60, bgcolor: 'grey.100', borderRadius: 1 }} />
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : tasks.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No tasks found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create your first task to get started
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {tasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} key={task.id}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4,
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Task Header */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" component="h3" sx={{ flex: 1, mr: 1 }}>
                      {task.title}
                    </Typography>
                    <Chip
                      label={task.status}
                      color={getStatusColor(task.status) as any}
                      size="small"
                    />
                  </Box>

                  {/* Task Description */}
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {task.description || 'No description'}
                  </Typography>

                  {/* Task Details */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Priority:
                      </Typography>
                      <Chip
                        label={task.priority}
                        color={getPriorityColor(task.priority) as any}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                    
                    {task.due_date && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          Due Date:
                        </Typography>
                        <Typography variant="caption" fontWeight={500}>
                          {new Date(task.due_date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Estimated Hours:
                      </Typography>
                      <Typography variant="caption" fontWeight={500}>
                        {task.estimated_hours || '0'}h
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button size="small" color="primary">
                    View Details
                  </Button>
                  <Button size="small" color="secondary">
                    Edit
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}; 