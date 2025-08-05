import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Breadcrumbs,
  Link,
  Alert,
  useTheme,
} from '@mui/material';
import { TaskHeader } from '../../components/tasks/TaskHeader';
import { TimeTracker } from '../../components/tasks/TimeTracker';
import { TaskDependencies } from '../../components/tasks/TaskDependencies';
import { CommentsSection } from '../../components/comments';
import { useGetTaskQuery } from '../../store/api/taskApi';
import { useAppSelector } from '../../store/hooks';

export const TaskDetailsPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const currentUser = useAppSelector((state) => state.auth.user);

  const { data: task, isLoading, error } = useGetTaskQuery(Number(taskId));

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load task details. Please try again.
        </Alert>
      </Container>
    );
  }

  if (isLoading || !task) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            Loading task details...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('/projects');
          }}
          sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        >
          Projects
        </Link>
        <Link
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate(`/projects/${task.projectId}`);
          }}
          sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        >
          Project Details
        </Link>
        <Link
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate(`/projects/${task.projectId}/tasks`);
          }}
          sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        >
          Tasks
        </Link>
        <Typography color="text.primary">{task.title}</Typography>
      </Breadcrumbs>

      {/* Task Header */}
      <TaskHeader task={task} />

      {/* Main Content */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Task Information */}
        <Grid item xs={12} lg={8}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              mb: 3,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Task Description
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {task.description}
            </Typography>

            {/* Task Details */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Estimated Hours
                  </Typography>
                  <Typography variant="h6" color="primary.main" fontWeight={600}>
                    {task.estimatedHours}h
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Actual Hours
                  </Typography>
                  <Typography variant="h6" color="primary.main" fontWeight={600}>
                    {task.actualHours}h
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Due Date
                  </Typography>
                  <Typography variant="h6" color="primary.main" fontWeight={600}>
                    {new Date(task.dueDate).toLocaleDateString()}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Created
                  </Typography>
                  <Typography variant="h6" color="primary.main" fontWeight={600}>
                    {new Date(task.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Dependencies */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              mb: 3,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Dependencies
            </Typography>
            <TaskDependencies taskId={task.id} />
          </Paper>

          {/* Comments Section */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <CommentsSection
              entityType="Task"
              entityId={task.id.toString()}
              title="Task Comments"
              currentUser={currentUser ? {
                id: currentUser.id.toString(),
                first_name: currentUser.first_name,
                last_name: currentUser.last_name,
              } : undefined}
              users={[]} // TODO: Get project team members
            />
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Time Tracker */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              mb: 3,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Time Tracking
            </Typography>
            <TimeTracker taskId={task.id} />
          </Paper>

          {/* Task Tags */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Tags
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {task.tags.map((tag) => (
                <Typography
                  key={tag}
                  variant="body2"
                  sx={{
                    px: 2,
                    py: 0.5,
                    bgcolor: 'primary.main',
                    color: 'white',
                    borderRadius: 1,
                  }}
                >
                  {tag}
                </Typography>
              ))}
              {task.tags.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No tags assigned
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TaskDetailsPage; 