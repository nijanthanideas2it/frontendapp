import React from 'react';
import { Box, Container, Grid, Typography, Paper, useTheme } from '@mui/material';
import { ProjectSummaryCard } from '../../components/dashboard/ProjectSummaryCard';
import { TaskOverview } from '../../components/dashboard/TaskOverview';
import { ActivityFeed } from '../../components/dashboard/ActivityFeed';
import { QuickActions } from '../../components/dashboard/QuickActions';

export const UserDashboard: React.FC = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Dashboard Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's an overview of your projects and tasks.
        </Typography>
      </Box>

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <QuickActions />
      </Box>

      {/* Main Dashboard Grid */}
      <Grid container spacing={3}>
        {/* Project Summary Cards */}
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
              Project Overview
            </Typography>
            <ProjectSummaryCard />
          </Paper>
        </Grid>

        {/* Task Overview */}
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
              Task Status
            </Typography>
            <TaskOverview />
          </Paper>
        </Grid>

        {/* Activity Feed */}
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
              Recent Activities
            </Typography>
            <ActivityFeed />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserDashboard; 