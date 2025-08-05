import React from 'react';
import { Box, Typography, LinearProgress, Chip, Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { useGetDashboardQuery } from '../../store/api/dashboardApi';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'todo':
      return '#f44336';
    case 'in-progress':
      return '#ff9800';
    case 'review':
      return '#2196f3';
    case 'completed':
      return '#4caf50';
    default:
      return '#9e9e9e';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'todo':
      return 'To Do';
    case 'in-progress':
      return 'In Progress';
    case 'review':
      return 'Review';
    case 'completed':
      return 'Completed';
    default:
      return status;
  }
};

const getPriorityColor = (priority: string) => {
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

export const TaskOverview: React.FC = () => {
  const { data: dashboardData, isLoading, error } = useGetDashboardQuery();

  if (isLoading) {
    return (
      <Box>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ width: '40%', height: 16, bgcolor: 'grey.300', borderRadius: 1 }} />
            <Box sx={{ width: '20%', height: 16, bgcolor: 'grey.300', borderRadius: 1 }} />
          </Box>
          <LinearProgress variant="indeterminate" />
        </Box>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ width: '50%', height: 16, bgcolor: 'grey.300', borderRadius: 1 }} />
            <Box sx={{ width: '15%', height: 16, bgcolor: 'grey.300', borderRadius: 1 }} />
          </Box>
          <LinearProgress variant="indeterminate" />
        </Box>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ width: '30%', height: 16, bgcolor: 'grey.300', borderRadius: 1 }} />
            <Box sx={{ width: '25%', height: 16, bgcolor: 'grey.300', borderRadius: 1 }} />
          </Box>
          <LinearProgress variant="indeterminate" />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography color="error" variant="body2">
          Failed to load task data
        </Typography>
      </Box>
    );
  }

  const tasks = dashboardData?.tasks || [];
  const stats = dashboardData?.stats;

  // Calculate task status breakdown
  const statusCounts = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalTasks = tasks.length;
  const statuses = ['todo', 'in-progress', 'review', 'completed'];

  return (
    <Box>
      {/* Task Statistics */}
      {stats && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Total Tasks
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {stats.totalTasks}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Completed
            </Typography>
            <Typography variant="body2" fontWeight={600} color="success.main">
              {stats.completedTasks}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Overdue
            </Typography>
            <Typography variant="body2" fontWeight={600} color="error.main">
              {stats.overdueTasks}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Task Status Breakdown */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Status Breakdown
        </Typography>
        {statuses.map((status) => {
          const count = statusCounts[status] || 0;
          const percentage = totalTasks > 0 ? (count / totalTasks) * 100 : 0;
          
          return (
            <Box key={status} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {getStatusLabel(status)}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {count}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={percentage}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 3,
                    backgroundColor: getStatusColor(status),
                  },
                }}
              />
            </Box>
          );
        })}
      </Box>

      {/* Recent Tasks */}
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Recent Tasks
        </Typography>
        <List sx={{ p: 0 }}>
          {tasks.slice(0, 3).map((task) => (
            <ListItem key={task.id} sx={{ px: 0, py: 1 }}>
              <ListItemAvatar>
                <Avatar
                  src={task.assignee.avatar}
                  sx={{ width: 32, height: 32 }}
                >
                  {task.assignee.name.charAt(0)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="body2" noWrap>
                    {task.title}
                  </Typography>
                }
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Chip
                      label={getPriorityColor(task.priority)}
                      size="small"
                      color={getPriorityColor(task.priority) as any}
                      sx={{ height: 20, fontSize: '0.75rem' }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {task.project.name}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default TaskOverview; 