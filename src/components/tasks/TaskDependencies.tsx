import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  useTheme,
} from '@mui/material';

interface TaskDependenciesProps {
  taskId: number;
}

export const TaskDependencies: React.FC<TaskDependenciesProps> = () => {
  const theme = useTheme();

  // Mock data - in a real app, this would come from an API
  const dependencies = [
    { id: 1, title: 'Design System Setup', status: 'done' },
    { id: 2, title: 'API Integration', status: 'in-progress' },
    { id: 3, title: 'Database Schema', status: 'todo' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'success.main';
      case 'in-progress':
        return 'primary.main';
      case 'todo':
        return 'grey.500';
      default:
        return 'grey.500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'done':
        return 'Done';
      case 'in-progress':
        return 'In Progress';
      case 'todo':
        return 'To Do';
      default:
        return status;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {dependencies.length} dependency{dependencies.length !== 1 ? 'ies' : ''}
        </Typography>
        <Button variant="outlined" size="small" sx={{ textTransform: 'none' }}>
          Add Dependency
        </Button>
      </Box>

      {dependencies.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="body2" color="text.secondary">
            No dependencies for this task
          </Typography>
        </Box>
      ) : (
        <List sx={{ p: 0 }}>
          {dependencies.map((dependency) => (
            <ListItem
              key={dependency.id}
              sx={{
                p: 2,
                mb: 1,
                borderRadius: 1,
                border: `1px solid ${theme.palette.divider}`,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: getStatusColor(dependency.status),
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="subtitle2" fontWeight={500}>
                    {dependency.title}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    Status: {getStatusLabel(dependency.status)}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default TaskDependencies; 