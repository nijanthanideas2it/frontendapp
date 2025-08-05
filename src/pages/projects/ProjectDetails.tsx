import React, { useState } from 'react';
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
import { ProjectHeader } from '../../components/projects/ProjectHeader';
import { TeamMembersList } from '../../components/projects/TeamMembersList';
import { ProjectSettings } from '../../components/projects/ProjectSettings';
import { useGetProjectQuery } from '../../store/api/projectApi';

export const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();


  const { data: project, isLoading, error } = useGetProjectQuery(Number(projectId));

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load project details. Please try again.
        </Alert>
      </Container>
    );
  }

  if (isLoading || !project) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            Loading project details...
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
        <Typography color="text.primary">{project.name}</Typography>
      </Breadcrumbs>

      {/* Project Header */}
      <ProjectHeader project={project} />

      {/* Main Content */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Overview Section */}
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
              Project Overview
            </Typography>
            
            <Grid container spacing={3}>
              {/* Project Description */}
              <Grid item xs={12}>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  {project.description}
                </Typography>
              </Grid>

              {/* Project Stats */}
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="h4" color="primary.main" fontWeight={600}>
                    {project.progress}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Progress
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="h4" color="primary.main" fontWeight={600}>
                    {project.budget.allocated.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Budget ({project.budget.currency})
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="h4" color="primary.main" fontWeight={600}>
                    {new Date(project.dueDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Due Date
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="h4" color="primary.main" fontWeight={600}>
                    {project.teamMembers?.length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Team Members
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Team Members Section */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Team Members
            </Typography>
            <TeamMembersList projectId={project.id} />
          </Paper>
        </Grid>

        {/* Settings Section */}
        <Grid item xs={12} lg={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Project Settings
            </Typography>
            <ProjectSettings project={project} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProjectDetails; 