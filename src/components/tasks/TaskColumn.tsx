import React from 'react';
import {
  Box,
  Typography,
  Paper,
  useTheme,
} from '@mui/material';
import { TaskCard } from './TaskCard';
import type { BackendTask } from '../../store/api/taskApi';

interface TaskColumnProps {
  title: string;
  tasks: BackendTask[];
  status: BackendTask['status'];
  color: string;
  onDragStart: (task: BackendTask) => void;
  onDragEnd: () => void;
  onDrop: (status: BackendTask['status']) => void;
  draggedTask: BackendTask | null;
}

export const TaskColumn: React.FC<TaskColumnProps> = ({
  title,
  tasks,
  status,
  onDragStart,
  onDragEnd,
  onDrop,
  draggedTask,
}) => {
  const theme = useTheme();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop(status);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        height: '70vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <Box sx={{ mb: 2, flexShrink: 0 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {tasks.length} task{tasks.length !== 1 ? 's' : ''}
        </Typography>
      </Box>

      {/* Tasks List - Scrollable Container */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          overflowY: 'auto',
          overflowX: 'hidden',
          pr: 1, // Add some padding for the scrollbar
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: theme.palette.grey[100],
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme.palette.grey[400],
            borderRadius: '3px',
            '&:hover': {
              background: theme.palette.grey[500],
            },
          },
        }}
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDragStart={() => onDragStart(task)}
            onDragEnd={onDragEnd}
            isDragging={draggedTask?.id === task.id}
          />
        ))}
        
        {tasks.length === 0 && (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `2px dashed ${theme.palette.divider}`,
              borderRadius: 1,
              p: 3,
              minHeight: '200px',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No tasks
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default TaskColumn; 