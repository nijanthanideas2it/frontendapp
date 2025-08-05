import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Avatar,
  useTheme,
} from '@mui/material';
import type { BackendTask } from '../../store/api/taskApi';

interface TaskCardProps {
  task: BackendTask;
  onDragStart: () => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

const getPriorityColor = (priority: BackendTask['priority']) => {
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

const getPriorityLabel = (priority: BackendTask['priority']) => {
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

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onDragStart,
  onDragEnd,
  isDragging,
}) => {
  const theme = useTheme();

  return (
    <Box
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      sx={{
        p: 2,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
        cursor: 'grab',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 2,
          transform: 'translateY(-1px)',
        },
        ...(isDragging && {
          opacity: 0.5,
          transform: 'rotate(5deg)',
        }),
      }}
    >
      {/* Task Title */}
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        {task.title}
      </Typography>

      {/* Task Description */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {task.description.length > 100
          ? `${task.description.substring(0, 100)}...`
          : task.description}
      </Typography>

      {/* Priority and Tags */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <Chip
          label={getPriorityLabel(task.priority)}
          color={getPriorityColor(task.priority) as 'error' | 'warning' | 'info' | 'success' | 'default'}
          size="small"
        />
        {task.tags.slice(0, 2).map((tag) => (
          <Chip
            key={tag}
            label={tag}
            variant="outlined"
            size="small"
          />
        ))}
        {task.tags.length > 2 && (
          <Chip
            label={`+${task.tags.length - 2}`}
            variant="outlined"
            size="small"
          />
        )}
      </Box>

      {/* Assignee and Due Date */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {task.assignee ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              src={task.assignee.avatar}
              sx={{ width: 24, height: 24 }}
            >
              {task.assignee.name.charAt(0)}
            </Avatar>
            <Typography variant="caption" color="text.secondary">
              {task.assignee.name}
            </Typography>
          </Box>
        ) : (
          <Typography variant="caption" color="text.secondary">
            Unassigned
          </Typography>
        )}

        <Typography variant="caption" color="text.secondary">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </Typography>
      </Box>

      {/* Time Information */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Est: {task.estimatedHours}h
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Actual: {task.actualHours}h
        </Typography>
      </Box>
    </Box>
  );
};

export default TaskCard; 