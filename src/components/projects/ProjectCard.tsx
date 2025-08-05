import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Avatar,
  Box,
  LinearProgress,
  IconButton,
  useTheme,
} from '@mui/material';
import type { BackendProject } from '../../store/api/projectApi';

interface ProjectCardProps {
  project: BackendProject;
  viewMode: 'grid' | 'list';
  onClick: () => void;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'success';
    case 'completed':
      return 'primary';
    case 'onhold':
    case 'on-hold':
      return 'warning';
    case 'cancelled':
      return 'error';
    case 'draft':
      return 'default';
    default:
      return 'default';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'Active':
      return 'Active';
    case 'Completed':
      return 'Completed';
    case 'OnHold':
      return 'On Hold';
    case 'Cancelled':
      return 'Cancelled';
    case 'Draft':
      return 'Draft';
    default:
      return status;
  }
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, viewMode, onClick }) => {
  const theme = useTheme();

  const isListMode = viewMode === 'list';
  const managerName = project.manager 
    ? `${project.manager.first_name} ${project.manager.last_name}`
    : 'No Manager';
  const managerInitial = managerName.charAt(0);
  const progress = project.progress_percentage || 0;
  const budget = project.budget ? parseFloat(project.budget) : 0;
  const actualCost = project.actual_cost ? parseFloat(project.actual_cost) : 0;

  return (
    <Card
      elevation={0}
      sx={{
        height: isListMode ? 'auto' : '100%',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
          borderColor: theme.palette.primary.main,
        },
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: isListMode ? 2 : 3 }}>
        {isListMode ? (
          // List View Layout
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{ width: 48, height: 48 }}
            >
              {managerInitial}
            </Avatar>
            
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h6" component="h3" noWrap sx={{ flex: 1 }}>
                  {project.name}
                </Typography>
                <Chip
                  label={getStatusLabel(project.status)}
                  color={getStatusColor(project.status) as any}
                  size="small"
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 1 }}>
                {project.description || 'No description'}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Typography variant="caption" color="text.secondary">
                  Manager: {managerName}
                </Typography>
                {project.end_date && (
                  <Typography variant="caption" color="text.secondary">
                    Due: {new Date(project.end_date).toLocaleDateString()}
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary">
                  Budget: ${budget.toLocaleString()}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ textAlign: 'right', minWidth: 100 }}>
              <Typography variant="h6" color="primary.main" fontWeight={600}>
                {progress}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Complete
              </Typography>
            </Box>
          </Box>
        ) : (
          // Grid View Layout
          <>
            {/* Project Header */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="h6" component="h3" noWrap gutterBottom>
                  {project.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {project.description || 'No description'}
                </Typography>
              </Box>
              <Chip
                label={getStatusLabel(project.status)}
                color={getStatusColor(project.status) as any}
                size="small"
                sx={{ ml: 1 }}
              />
            </Box>

            {/* Manager Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                sx={{ width: 32, height: 32, mr: 1 }}
              >
                {managerInitial}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  {managerName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Project Manager
                </Typography>
              </Box>
            </Box>

            {/* Progress */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Progress
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {progress}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ height: 6, borderRadius: 3 }}
              />
            </Box>

            {/* Project Details */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Budget
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  ${budget.toLocaleString()}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Team Size
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {project.team_size}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Start Date
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {new Date(project.start_date).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectCard; 