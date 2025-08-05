import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Chip, Avatar, LinearProgress } from '@mui/material';
import { useGetDashboardQuery } from '../../store/api/dashboardApi';

interface ProjectSummary {
  id: number;
  name: string;
  status: 'active' | 'completed' | 'on-hold' | 'cancelled';
  progress: number;
  teamSize: number;
  dueDate: string;
  manager: {
    name: string;
    avatar?: string;
  };
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'success';
    case 'completed':
      return 'primary';
    case 'on-hold':
      return 'warning';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'active':
      return 'Active';
    case 'completed':
      return 'Completed';
    case 'on-hold':
      return 'On Hold';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
};

export const ProjectSummaryCard: React.FC = () => {
  const { data: dashboardData, isLoading, error } = useGetDashboardQuery();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {[1, 2, 3].map((i) => (
          <Card key={i} sx={{ minHeight: 120 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'grey.300', mr: 2 }} />
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ width: '60%', height: 20, bgcolor: 'grey.300', borderRadius: 1, mb: 1 }} />
                  <Box sx={{ width: '40%', height: 16, bgcolor: 'grey.200', borderRadius: 1 }} />
                </Box>
              </Box>
              <LinearProgress variant="indeterminate" />
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="error" variant="body2">
          Failed to load project data
        </Typography>
      </Box>
    );
  }

  const projects = dashboardData?.projects || [];

  if (projects.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary" variant="body2">
          No projects found
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {projects.map((project: ProjectSummary) => (
        <Grid item xs={12} sm={6} md={4} key={project.id}>
          <Card
            sx={{
              height: '100%',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4,
              },
            }}
          >
            <CardContent>
              {/* Project Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  src={project.manager.avatar}
                  sx={{ width: 40, height: 40, mr: 2 }}
                >
                  {project.manager.name.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" component="h3" noWrap>
                    {project.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {project.manager.name}
                  </Typography>
                </Box>
              </Box>

              {/* Project Status */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Chip
                  label={getStatusLabel(project.status)}
                  color={getStatusColor(project.status) as any}
                  size="small"
                />
                <Typography variant="body2" color="text.secondary">
                  {project.teamSize} members
                </Typography>
              </Box>

              {/* Progress Bar */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Progress
                  </Typography>
                  <Typography variant="body2" color="text.primary" fontWeight={600}>
                    {project.progress}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={project.progress}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 3,
                    },
                  }}
                />
              </Box>

              {/* Due Date */}
              <Typography variant="body2" color="text.secondary">
                Due: {new Date(project.dueDate).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProjectSummaryCard; 