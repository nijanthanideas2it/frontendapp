import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  useTheme,
  Breadcrumbs,
  Link,
  Alert,
} from '@mui/material';
import { KanbanBoard } from '../../components/tasks/KanbanBoard';
import { useGetProjectTasksQuery } from '../../store/api/taskApi';

export const ProjectTasksPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();

  const { data: tasksData, isLoading, error } = useGetProjectTasksQuery({ projectId: projectId });

  const handleCreateTask = () => {
    navigate(`/projects/${projectId}/tasks/create`);
  };

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load project tasks. Please try again.
        </Alert>
      </Container>
    );
  }

  const tasks = tasksData?.data || [];

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
            navigate(`/projects/${projectId}`);
          }}
          sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        >
          Project Details
        </Link>
        <Typography color="text.primary">Tasks</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
            Project Tasks
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track project tasks with Kanban board
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={handleCreateTask}
          sx={{ textTransform: 'none' }}
        >
          Create Task
        </Button>
      </Box>

      {/* Kanban Board */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          minHeight: '70vh',
        }}
      >
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              Loading tasks...
            </Typography>
          </Box>
        ) : (
          <KanbanBoard
            tasks={tasks}
            projectId={Number(projectId)}
          />
        )}
      </Paper>
    </Container>
  );
};

export default ProjectTasksPage; 