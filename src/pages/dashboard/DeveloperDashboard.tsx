import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  useTheme,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from '@mui/material';
import {
  Assignment,
  Project,
  Schedule,
  CheckCircle,
  Pending,
  Warning,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../../utils/apiCall';

interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  progress: number;
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
  estimated_hours: number;
  project_id: number;
  project_name: string;
}

export const DeveloperDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchDeveloperData();
  }, []);

  const fetchDeveloperData = async () => {
    try {
      setLoading(true);
      
      // Fetch projects assigned to the developer
      const projectsResponse = await apiCall('/projects/assigned', {
        method: 'GET',
      });

      // Fetch tasks assigned to the developer
      const tasksResponse = await apiCall('/tasks/assigned', {
        method: 'GET',
      });

      if (projectsResponse.success) {
        setProjects(projectsResponse.data);
      }

      if (tasksResponse.success) {
        setTasks(tasksResponse.data);
      }
    } catch (err) {
      setError('Failed to load your projects and tasks');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'in progress':
        return 'primary';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'error';
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
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle color="success" />;
      case 'in progress':
        return <Schedule color="primary" />;
      case 'pending':
        return <Pending color="warning" />;
      case 'overdue':
        return <Warning color="error" />;
      default:
        return <Assignment />;
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
          Welcome, {user.first_name}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here are your assigned projects and tasks
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Projects Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Project sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  My Projects ({projects.length})
                </Typography>
              </Box>

              {projects.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No projects assigned yet
                </Typography>
              ) : (
                <List>
                  {projects.map((project, index) => (
                    <React.Fragment key={project.id}>
                      <ListItem
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: theme.palette.action.hover,
                          },
                        }}
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                {project.name}
                              </Typography>
                              <Chip
                                label={project.status}
                                size="small"
                                color={getStatusColor(project.status) as any}
                              />
                            </Box>
                          }
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                {project.description}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Progress: {project.progress}%
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Due: {new Date(project.end_date).toLocaleDateString()}
                                </Typography>
                              </Box>
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => navigate(`/projects/${project.id}/tasks`)}
                          >
                            View Tasks
                          </Button>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < projects.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Tasks Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Assignment sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  My Tasks ({tasks.length})
                </Typography>
              </Box>

              {tasks.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No tasks assigned yet
                </Typography>
              ) : (
                <List>
                  {tasks.map((task, index) => (
                    <React.Fragment key={task.id}>
                      <ListItem
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: theme.palette.action.hover,
                          },
                        }}
                        onClick={() => navigate(`/tasks/${task.id}`)}
                      >
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {getStatusIcon(task.status)}
                              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                {task.title}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                {task.description}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                                <Chip
                                  label={task.status}
                                  size="small"
                                  color={getStatusColor(task.status) as any}
                                />
                                <Chip
                                  label={task.priority}
                                  size="small"
                                  color={getPriorityColor(task.priority) as any}
                                />
                                <Typography variant="caption" color="text.secondary">
                                  Project: {task.project_name}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Due: {new Date(task.due_date).toLocaleDateString()}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Est: {task.estimated_hours}h
                                </Typography>
                              </Box>
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => navigate(`/tasks/${task.id}`)}
                          >
                            View
                          </Button>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < tasks.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Quick Overview
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
                    {projects.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Projects
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main" sx={{ fontWeight: 600 }}>
                    {tasks.filter(t => t.status.toLowerCase() === 'completed').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed Tasks
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main" sx={{ fontWeight: 600 }}>
                    {tasks.filter(t => t.status.toLowerCase() === 'in progress').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    In Progress
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="error.main" sx={{ fontWeight: 600 }}>
                    {tasks.filter(t => new Date(t.due_date) < new Date() && t.status.toLowerCase() !== 'completed').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Overdue Tasks
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}; 