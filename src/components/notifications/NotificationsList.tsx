import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  CircularProgress,
  Alert,
  Pagination,
  Divider,
} from '@mui/material';
import {
  DoneAll as DoneAllIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useGetNotificationsQuery, useMarkNotificationReadMutation, useMarkAllNotificationsReadMutation } from '../../store/api/notificationApi';
import { NotificationCard } from './NotificationCard';
import type { NotificationsQueryParams } from '../../types/api/notification';

interface NotificationsListProps {
  onNavigate?: (entityType: string, entityId: string) => void;
  title?: string;
  showFilters?: boolean;
  showPagination?: boolean;
  pageSize?: number;
}

export const NotificationsList: React.FC<NotificationsListProps> = ({
  onNavigate,
  title = 'Notifications',
  showFilters = true,
  showPagination = true,
  pageSize = 20,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [queryParams, setQueryParams] = useState<NotificationsQueryParams>({
    page: 1,
    limit: pageSize,
  });

  const [markAsRead] = useMarkNotificationReadMutation();
  const [markAllAsRead] = useMarkAllNotificationsReadMutation();

  const { data: notifications, isLoading, error, refetch } = useGetNotificationsQuery(queryParams);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setCurrentPage(1);
    
    const newParams: NotificationsQueryParams = {
      page: 1,
      limit: pageSize,
    };

    switch (newValue) {
      case 0: // All
        break;
      case 1: // Unread
        newParams.is_read = false;
        break;
      case 2: // Read
        newParams.is_read = true;
        break;
    }

    setQueryParams(newParams);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    setQueryParams(prev => ({ ...prev, page }));
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId).unwrap();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  const getTabLabel = (index: number) => {
    switch (index) {
      case 0:
        return `All (${notifications?.pagination.total || 0})`;
      case 1: {
        const unreadCount = notifications?.data.filter(n => !n.is_read).length || 0;
        return `Unread (${unreadCount})`;
      }
      case 2: {
        const readCount = notifications?.data.filter(n => n.is_read).length || 0;
        return `Read (${readCount})`;
      }
      default:
        return '';
    }
  };

  const hasUnreadNotifications = notifications?.data.some(n => !n.is_read) || false;

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Failed to load notifications. Please try again.
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">{title}</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={isLoading}
          >
            Refresh
          </Button>
          {hasUnreadNotifications && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<DoneAllIcon />}
              onClick={handleMarkAllAsRead}
              disabled={isLoading}
            >
              Mark All Read
            </Button>
          )}
        </Box>
      </Box>

      {/* Filters */}
      {showFilters && (
        <>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ mb: 2 }}
          >
            <Tab label={getTabLabel(0)} />
            <Tab label={getTabLabel(1)} />
            <Tab label={getTabLabel(2)} />
          </Tabs>
          <Divider sx={{ mb: 2 }} />
        </>
      )}

      {/* Loading State */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Notifications List */}
      {!isLoading && notifications && (
        <>
          {notifications.data.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                {activeTab === 1 ? 'No unread notifications' : 
                 activeTab === 2 ? 'No read notifications' : 
                 'No notifications yet'}
              </Typography>
            </Box>
          ) : (
            <Box>
              {notifications.data.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onNavigate={onNavigate}
                />
              ))}
            </Box>
          )}

          {/* Pagination */}
          {showPagination && notifications.pagination.pages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={notifications.pagination.pages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Paper>
  );
}; 