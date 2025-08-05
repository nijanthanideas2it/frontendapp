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
import type { Task } from '../../store/api/taskApi';

interface TaskHeaderProps {
  task: Task;
}

const getStatusColor = (status: Task['status']) => {
  switch (status) {
    case 'todo':
      return 'default';
    case 'in-progress':
      return 'primary';
    case 'review':
      return 'warning';
    case 'done':
      return 'success';
    default:
      return 'default';
  }
};

const getStatusLabel = (status: Task['status']) => {
  switch (status) {
    case 'todo':
      return 'To Do';
    case 'in-progress':
      return 'In Progress';
    case 'review':
      return 'Review';
    case 'done':
      return 'Done';
    default:
      return status;
  }
};

const getPriorityColor = (priority: Task['priority']) => {
  switch (priority) {
    case 'urgent':
      return 'error';
    case 'high':
      return 'warning';
    case 'medium':
      return 'info';
    case 'low':
      return 'success';
    default:
      return 'default';
  }
};

const getPriorityLabel = (priority: Task['priority']) => {
  switch (priority) {
    case 'urgent':
      return 'Urgent';
    case 'high':
      return 'High';
    case 'medium':
      return 'Medium';
    case 'low':
      return 'Low';
    default:
      return priority;
  }
};

export const TaskHeader: React.FC<TaskHeaderProps> = ({ task }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleEditTask = () => {
    navigate(`/tasks/${task.id}/edit`);
  };

  const handleViewProject = () => {
    navigate(`/projects/${task.projectId}`);
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
              {task.title}
            </Typography>
            <Chip
              label={getStatusLabel(task.status)}
              color={getStatusColor(task.status) as 'default' | 'primary' | 'warning' | 'success'}
              size="medium"
            />
            <Chip
              label={getPriorityLabel(task.priority)}
              color={getPriorityColor(task.priority) as 'error' | 'warning' | 'info' | 'success' | 'default'}
              size="medium"
              variant="outlined"
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap', mb: 2 }}>
            {task.assignee ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar
                  src={task.assignee.avatar}
                  sx={{ width: 24, height: 24 }}
                >
                  {task.assignee.name.charAt(0)}
                </Avatar>
                <Typography variant="body2" color="text.secondary">
                  Assigned to: {task.assignee.name}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Unassigned
              </Typography>
            )}

            <Typography variant="body2" color="text.secondary">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Est: {task.estimatedHours}h | Actual: {task.actualHours}h
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {task.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Button
            variant="outlined"
            onClick={handleViewProject}
            sx={{ textTransform: 'none' }}
          >
            View Project
          </Button>
          <Button
            variant="contained"
            onClick={handleEditTask}
            sx={{ textTransform: 'none' }}
          >
            Edit Task
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default TaskHeader; 