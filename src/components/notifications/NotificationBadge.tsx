import React from 'react';
import {
  Badge,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useGetNotificationStatsQuery } from '../../store/api/notificationApi';

interface NotificationBadgeProps {
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
  showTooltip?: boolean;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  onClick,
  size = 'medium',
  showTooltip = true,
}) => {
  const { data: stats, isLoading } = useGetNotificationStatsQuery();

  const unreadCount = stats?.unread_count || 0;

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 20;
      case 'large':
        return 28;
      default:
        return 24;
    }
  };

  const getBadgeColor = () => {
    if (unreadCount === 0) {
      return 'default';
    } else if (unreadCount > 10) {
      return 'error';
    } else if (unreadCount > 5) {
      return 'warning';
    } else {
      return 'primary';
    }
  };

  const getTooltipContent = () => {
    if (isLoading) {
      return 'Loading notifications...';
    }
    
    if (unreadCount === 0) {
      return 'No new notifications';
    } else if (unreadCount === 1) {
      return '1 new notification';
    } else {
      return `${unreadCount} new notifications`;
    }
  };

  const badgeContent = unreadCount > 99 ? '99+' : unreadCount;

  const iconButton = (
    <IconButton
      onClick={onClick}
      size={size}
      sx={{
        color: 'text.secondary',
        '&:hover': {
          color: 'primary.main',
          backgroundColor: 'primary.light + 0.1',
        },
      }}
    >
      <NotificationsIcon sx={{ fontSize: getIconSize() }} />
    </IconButton>
  );

  const badge = (
    <Badge
      badgeContent={badgeContent}
      color={getBadgeColor() as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
      max={99}
      invisible={unreadCount === 0}
      sx={{
        '& .MuiBadge-badge': {
          fontSize: '0.75rem',
          height: 'auto',
          minWidth: 'auto',
          padding: '0 6px',
        },
      }}
    >
      {iconButton}
    </Badge>
  );

  if (showTooltip) {
    return (
      <Tooltip title={getTooltipContent()} arrow>
        {badge}
      </Tooltip>
    );
  }

  return badge;
}; 