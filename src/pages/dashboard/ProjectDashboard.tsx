import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, Grid, Typography, Paper, useTheme, Breadcrumbs, Link } from '@mui/material';
import { ProgressChart } from '../../components/dashboard/ProgressChart';
import { TeamWorkloadChart } from '../../components/dashboard/TeamWorkloadChart';
import { MilestoneTimeline } from '../../components/dashboard/MilestoneTimeline';
import { useGetProjectDashboardQuery } from '../../store/api/projectApi';

export const ProjectDashboard: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const theme = useTheme();
  
  const { data: projectData, isLoading, error } = useGetProjectDashboardQuery(
    projectId ? parseInt(projectId) : 0,
    { skip: !projectId }
  );

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[1, 2, 3, 4].map((i) => (
            <Paper key={i} sx={{ p: 3, minHeight: 200 }}>
              <Box sx={{ width: '60%', height: 24, bgcolor: 'grey.300', borderRadius: 1, mb: 2 }} />
              <Box sx={{ width: '100%', height: 150, bgcolor: 'grey.200', borderRadius: 1 }} />
            </Paper>
          ))}
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="error" variant="h6" gutterBottom>
            Failed to load project dashboard
          </Typography>
          <Typography color="text.secondary" variant="body2">
            Please check your connection and try again.
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!projectData) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary" variant="body2">
            Project not found
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link color="inherit" href="/dashboard">
          Dashboard
        </Link>
        <Link color="inherit" href="/projects">
          Projects
        </Link>
        <Typography color="text.primary">{projectData.project.name}</Typography>
      </Breadcrumbs>

      {/* Project Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          {projectData.project.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {projectData.project.description}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary">
            Status: <strong>{projectData.project.status}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manager: <strong>{projectData.project.manager.name}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Due Date: <strong>{new Date(projectData.project.dueDate).toLocaleDateString()}</strong>
          </Typography>
        </Box>
      </Box>

      {/* Main Dashboard Grid */}
      <Grid container spacing={3}>
        {/* Project Progress */}
        <Grid item xs={12} lg={8}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Project Progress
            </Typography>
            <ProgressChart data={projectData.progress} />
          </Paper>
        </Grid>

        {/* Team Workload */}
        <Grid item xs={12} lg={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              height: 'fit-content',
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Team Workload
            </Typography>
            <TeamWorkloadChart data={projectData.teamWorkload} />
          </Paper>
        </Grid>

        {/* Milestone Timeline */}
        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Milestone Timeline
            </Typography>
            <MilestoneTimeline milestones={projectData.milestones} />
          </Paper>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} lg={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Recent Activities
            </Typography>
            <Box>
              {projectData.recentActivities?.map((activity, index) => (
                <Box
                  key={activity.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    py: 1.5,
                    borderBottom: index < projectData.recentActivities.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider',
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      mr: 2,
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={500}>
                      {activity.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Project Statistics */}
        <Grid item xs={12} lg={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Project Statistics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="primary.main" fontWeight={600}>
                    {projectData.stats.totalTasks}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Tasks
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="success.main" fontWeight={600}>
                    {projectData.stats.completedTasks}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="warning.main" fontWeight={600}>
                    {projectData.stats.teamMembers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Team Members
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="info.main" fontWeight={600}>
                    {projectData.stats.daysRemaining}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Days Remaining
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

export default ProjectDashboard; 