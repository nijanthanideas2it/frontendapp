import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  Chat as ChatIcon,
  Person as PersonIcon,
  Folder as ProjectIcon,
  CheckCircle as CheckCircleIcon,
  Circle as CircleIcon,
} from '@mui/icons-material';
import type { Notification } from '../../types/api/notification';

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead?: (notificationId: string) => void;
  onNavigate?: (entityType: string, entityId: string) => void;
  showActions?: boolean;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkAsRead,
  onNavigate,
  showActions = true,
}) => {
  const theme = useTheme();

  const getNotificationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'task_assigned':
      case 'task_completed':
      case 'task_updated':
        return <AssignmentIcon />;
      case 'project_created':
      case 'project_updated':
        return <ProjectIcon />;
      case 'comment_added':
      case 'mention':
        return <ChatIcon />;
      case 'deadline_approaching':
      case 'time_entry':
        return <ScheduleIcon />;
      case 'user_joined':
      case 'user_left':
        return <PersonIcon />;
      default:
        return <NotificationsIcon />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'task_assigned':
      case 'project_created':
        return 'primary';
      case 'task_completed':
      case 'deadline_approaching':
        return 'success';
      case 'comment_added':
      case 'mention':
        return 'info';
      case 'task_updated':
      case 'project_updated':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const handleMarkAsRead = () => {
    if (onMarkAsRead && !notification.is_read) {
      onMarkAsRead(notification.id);
    }
  };

  const handleNavigate = () => {
    if (onNavigate && notification.entity_type && notification.entity_id) {
      onNavigate(notification.entity_type, notification.entity_id);
    }
  };

  const isClickable = notification.entity_type && notification.entity_id;

  return (
    <Card
      sx={{
        mb: 2,
        cursor: isClickable ? 'pointer' : 'default',
        border: notification.is_read ? '1px solid' : '2px solid',
        borderColor: notification.is_read ? 'divider' : theme.palette.primary.main,
        backgroundColor: notification.is_read ? 'background.paper' : 'primary.light + 0.05',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: theme.shadows[4],
          transform: 'translateY(-1px)',
        },
      }}
      onClick={handleNavigate}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          {/* Notification Icon */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: `${getNotificationColor(notification.type)}.light`,
              color: `${getNotificationColor(notification.type)}.main`,
            }}
          >
            {getNotificationIcon(notification.type)}
          </Box>

          {/* Notification Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="subtitle2" noWrap>
                {notification.title}
              </Typography>
              {!notification.is_read && (
                <CircleIcon
                  sx={{
                    fontSize: 12,
                    color: 'primary.main',
                  }}
                />
              )}
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {notification.message}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={notification.type.replace(/_/g, ' ').toUpperCase()}
                size="small"
                color={getNotificationColor(notification.type) as 'primary' | 'success' | 'info' | 'warning' | 'default'}
                variant="outlined"
              />
              <Typography variant="caption" color="text.secondary">
                {formatRelativeTime(notification.created_at)}
              </Typography>
            </Box>
          </Box>

          {/* Actions */}
          {showActions && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {!notification.is_read && onMarkAsRead && (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkAsRead();
                  }}
                  title="Mark as read"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  <CheckCircleIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}; 