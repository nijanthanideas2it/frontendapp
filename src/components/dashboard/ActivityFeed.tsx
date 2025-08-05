import React from 'react';
import { Box, List, ListItem, ListItemAvatar, ListItemText, Avatar, Typography, Chip } from '@mui/material';
import { useGetDashboardQuery } from '../../store/api/dashboardApi';

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'task_created':
      return '📝';
    case 'task_completed':
      return '✅';
    case 'project_updated':
      return '🔄';
    case 'comment_added':
      return '💬';
    case 'file_uploaded':
      return '📎';
    default:
      return '📋';
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case 'task_created':
      return 'primary';
    case 'task_completed':
      return 'success';
    case 'project_updated':
      return 'info';
    case 'comment_added':
      return 'warning';
    case 'file_uploaded':
      return 'secondary';
    default:
      return 'default';
  }
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return `${days}d ago`;
  }
};

export const ActivityFeed: React.FC = () => {
  const { data: dashboardData, isLoading, error } = useGetDashboardQuery();

  if (isLoading) {
    return (
      <Box>
        {[1, 2, 3, 4, 5].map((i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'grey.300', mr: 2 }} />
            <Box sx={{ flex: 1 }}>
              <Box sx={{ width: '80%', height: 16, bgcolor: 'grey.300', borderRadius: 1, mb: 1 }} />
              <Box sx={{ width: '60%', height: 14, bgcolor: 'grey.200', borderRadius: 1 }} />
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="error" variant="body2">
          Failed to load activity data
        </Typography>
      </Box>
    );
  }

  const activities = dashboardData?.activities || [];

  if (activities.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary" variant="body2">
          No recent activities
        </Typography>
      </Box>
    );
  }

  return (
    <List sx={{ p: 0 }}>
      {activities.map((activity) => (
        <ListItem key={activity.id} sx={{ px: 0, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <ListItemAvatar>
            <Avatar
              src={activity.user.avatar}
              sx={{ width: 40, height: 40 }}
            >
              {activity.user.name.charAt(0)}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant="body2" component="span" fontWeight={600}>
                  {activity.user.name}
                </Typography>
                <Typography variant="body2" component="span" color="text.secondary">
                  {activity.message}
                </Typography>
              </Box>
            }
            secondary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  icon={<span>{getActivityIcon(activity.type)}</span>}
                  label={activity.type.replace('_', ' ')}
                  size="small"
                  color={getActivityColor(activity.type) as any}
                  sx={{ height: 20, fontSize: '0.75rem' }}
                />
                {activity.project && (
                  <Typography variant="caption" color="text.secondary">
                    in {activity.project.name}
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                  {formatTimestamp(activity.timestamp)}
                </Typography>
              </Box>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default ActivityFeed; 