import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Avatar,
  Button,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { ProjectInfo } from '../../store/api/projectApi';

interface ProjectHeaderProps {
  project: ProjectInfo;
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

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleEditProject = () => {
    navigate(`/projects/${project.id}/edit`);
  };

  const handleViewTasks = () => {
    navigate(`/projects/${project.id}/tasks`);
  };

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
        mb: 3,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
              {project.name}
            </Typography>
            <Chip
              label={getStatusLabel(project.status)}
              color={getStatusColor(project.status) as 'success' | 'primary' | 'warning' | 'error' | 'default'}
              size="medium"
            />
          </Box>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {project.description}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                src={project.manager.avatar}
                sx={{ width: 24, height: 24 }}
              >
                {project.manager.name.charAt(0)}
              </Avatar>
              <Typography variant="body2" color="text.secondary">
                Manager: {project.manager.name}
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary">
              Due: {new Date(project.dueDate).toLocaleDateString()}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Budget: {project.budget.currency} {project.budget.allocated.toLocaleString()}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Button
            variant="outlined"
            onClick={handleViewTasks}
            sx={{ textTransform: 'none' }}
          >
            View Tasks
          </Button>
          <Button
            variant="contained"
            onClick={handleEditProject}
            sx={{ textTransform: 'none' }}
          >
            Edit Project
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectHeader; 