import React from 'react';
import {
  Box,
  Typography,
  Card,
  Chip,
  IconButton,
  useTheme,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';
import type { BackendTask } from '../../store/api/taskApi';

interface TaskListProps {
  tasks: BackendTask[];
  onEditTask?: (task: BackendTask) => void;
  onDeleteTask?: (task: BackendTask) => void;
  title?: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Todo':
      return '#6b778c';
    case 'InProgress':
      return '#2196f3';
    case 'Review':
      return '#ff9800';
    case 'Done':
      return '#4caf50';
    default:
      return '#6b778c';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return '#f44336';
    case 'high':
      return '#ff9800';
    case 'medium':
      return '#2196f3';
    case 'low':
      return '#4caf50';
    default:
      return '#6b778c';
  }
};

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onEditTask,
  onDeleteTask,
  title = "Tasks"
}) => {
  const theme = useTheme();

  if (tasks.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        py: 8,
        color: 'text.secondary'
      }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          No tasks found
        </Typography>
        <Typography variant="body2">
          Create your first task to get started
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#172b4d' }}>
        {title}
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {tasks.map((task) => (
          <Card 
            key={task.id}
            sx={{ 
              p: 3, 
              '&:hover': { 
                boxShadow: 3,
                transform: 'translateY(-2px)',
                transition: 'all 0.2s ease-in-out'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#172b4d' }}>
                  {task.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#6b778c', mb: 2, lineHeight: 1.5 }}>
                  {task.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                  <Chip 
                    label={task.status} 
                    size="small"
                    sx={{ 
                      backgroundColor: getStatusColor(task.status),
                      color: 'white',
                      fontWeight: 500
                    }} 
                  />
                  <Chip 
                    label={task.priority} 
                    size="small"
                    sx={{ 
                      backgroundColor: getPriorityColor(task.priority),
                      color: 'white',
                      fontWeight: 500
                    }} 
                  />
                  {task.estimatedHours && (
                    <Chip 
                      label={`${task.estimatedHours}h`} 
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 500 }}
                    />
                  )}
                  {task.dueDate && (
                    <Chip 
                      label={dayjs(task.dueDate).format('MMM DD')} 
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 500 }}
                    />
                  )}
                </Box>
              </Box>
              {(onEditTask || onDeleteTask) && (
                <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                  {onEditTask && (
                    <IconButton 
                      size="small" 
                      onClick={() => onEditTask(task)}
                      sx={{ 
                        color: '#2196f3',
                        '&:hover': { backgroundColor: 'rgba(33, 150, 243, 0.1)' }
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                  {onDeleteTask && (
                    <IconButton 
                      size="small" 
                      onClick={() => onDeleteTask(task)}
                      sx={{ 
                        color: '#f44336',
                        '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              )}
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default TaskList; 