import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Avatar,
  useTheme,
} from '@mui/material';
import type { TimeEntry } from '../../store/api/timeApi';

interface TimeEntryCardProps {
  timeEntry: TimeEntry;
}

const getStatusColor = (status: TimeEntry['status']) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'approved':
      return 'success';
    case 'rejected':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusLabel = (status: TimeEntry['status']) => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'approved':
      return 'Approved';
    case 'rejected':
      return 'Rejected';
    default:
      return status;
  }
};

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};

export const TimeEntryCard: React.FC<TimeEntryCardProps> = ({ timeEntry }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
        '&:hover': {
          boxShadow: theme.shadows[4],
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease-in-out',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            {timeEntry.project.name}
          </Typography>
          {timeEntry.task && (
            <Typography variant="body2" color="text.secondary">
              {timeEntry.task.title}
            </Typography>
          )}
        </Box>
        <Chip
          label={getStatusLabel(timeEntry.status)}
          color={getStatusColor(timeEntry.status) as any}
          size="small"
        />
      </Box>

      {/* User Info */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Avatar
          src={timeEntry.user.avatar}
          sx={{ width: 24, height: 24 }}
        >
          {timeEntry.user.name.charAt(0)}
        </Avatar>
        <Typography variant="body2" color="text.secondary">
          {timeEntry.user.name}
        </Typography>
      </Box>

      {/* Time Information */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Duration: <strong>{formatDuration(timeEntry.duration)}</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Start: {formatDateTime(timeEntry.startTime)}
        </Typography>
        {timeEntry.endTime && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            End: {formatDateTime(timeEntry.endTime)}
          </Typography>
        )}
      </Box>

      {/* Description */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Description:
        </Typography>
        <Typography variant="body2" sx={{ 
          bgcolor: 'grey.50', 
          p: 1, 
          borderRadius: 1,
          fontStyle: 'italic',
        }}>
          {timeEntry.description || 'No description provided'}
        </Typography>
      </Box>

      {/* Category */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Chip
          label={timeEntry.category}
          size="small"
          variant="outlined"
        />
        <Typography variant="caption" color="text.secondary">
          {new Date(timeEntry.createdAt).toLocaleDateString()}
        </Typography>
      </Box>
    </Box>
  );
};

export default TimeEntryCard; 