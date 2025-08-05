import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  useTheme,
  Breadcrumbs,
  Link,
} from '@mui/material';
import { ProjectForm } from '../../components/projects/ProjectForm';

export const CreateProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleProjectCreated = (projectId: number) => {
    navigate(`/projects/${projectId}`);
  };

  const handleCancel = () => {
    navigate('/projects');
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
        <Typography color="text.primary">Create Project</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
          Create New Project
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Set up a new project with all the essential details and team members
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
          mode="create"
          onSuccess={handleProjectCreated}
          onCancel={handleCancel}
        />
      </Paper>
    </Container>
  );
};

export default CreateProjectPage; 