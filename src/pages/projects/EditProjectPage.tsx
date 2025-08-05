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
  Alert,
} from '@mui/material';
import { ProjectForm } from '../../components/projects/ProjectForm';
import { useGetProjectQuery } from '../../store/api/projectApi';

export const EditProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();

  const { data: project, isLoading, error } = useGetProjectQuery(Number(projectId));

  const handleProjectUpdated = (projectId: number) => {
    navigate(`/projects/${projectId}`);
  };

  const handleCancel = () => {
    navigate(`/projects/${projectId}`);
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load project details. Please try again.
        </Alert>
      </Container>
    );
  }

  if (isLoading || !project) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            Loading project details...
          </Typography>
        </Box>
      </Container>
    );
  }

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
          {project.name}
        </Link>
        <Typography color="text.primary">Edit Project</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
          Edit Project
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Update project details and settings
        </Typography>
      </Box>

      {/* Project Form */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <ProjectForm
          mode="edit"
          project={project}
          onSuccess={handleProjectUpdated}
          onCancel={handleCancel}
        />
      </Paper>
    </Container>
  );
};

export default EditProjectPage; 