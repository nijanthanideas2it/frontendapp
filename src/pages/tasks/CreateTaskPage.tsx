import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  useTheme,
  Breadcrumbs,
  Link,
} from '@mui/material';
import { TaskForm } from '../../components/tasks/TaskForm';

export const CreateTaskPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleTaskCreated = (taskId: number) => {
    navigate(`/tasks/${taskId}`);
  };

  const handleCancel = () => {
    navigate(`/projects/${projectId}/tasks`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
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
            navigate(`/projects/${projectId}`);
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
            navigate(`/projects/${projectId}/tasks`);
          }}
          sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        >
          Tasks
        </Link>
        <Typography color="text.primary">Create Task</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
          Create New Task
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Add a new task to the project with all the necessary details
        </Typography>
      </Box>

      {/* Task Form */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <TaskForm
          mode="create"
          projectId={Number(projectId)}
          onSuccess={handleTaskCreated}
          onCancel={handleCancel}
        />
      </Paper>
    </Container>
  );
};

 