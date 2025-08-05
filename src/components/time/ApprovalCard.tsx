import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Avatar,
  Checkbox,
  Button,
  useTheme,
} from '@mui/material';
import { useApproveTimeEntryMutation } from '../../store/api/timeApi';
import type { TimeEntry } from '../../store/api/timeApi';

interface ApprovalCardProps {
  timeEntry: TimeEntry;
  selected: boolean;
  onSelectionChange: (checked: boolean) => void;
}

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};

export const ApprovalCard: React.FC<ApprovalCardProps> = ({
  timeEntry,
  selected,
  onSelectionChange,
}) => {
  const theme = useTheme();
  const [approveTimeEntry, { isLoading }] = useApproveTimeEntryMutation();

  const handleApprove = async () => {
    try {
      await approveTimeEntry(timeEntry.id).unwrap();
    } catch (error) {
      console.error('Failed to approve time entry:', error);
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        border: `1px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`,
        bgcolor: selected ? 'primary.50' : 'background.paper',
        position: 'relative',
        '&:hover': {
          boxShadow: theme.shadows[4],
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease-in-out',
        },
      }}
    >
      {/* Selection Checkbox */}
      <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
        <Checkbox
          checked={selected}
          onChange={(e) => onSelectionChange(e.target.checked)}
          color="primary"
        />
      </Box>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ pr: 4 }}>
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
          label="Pending"
          color="warning"
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

      {/* Category */}
      <Box sx={{ mb: 2 }}>
        <Chip
          label={timeEntry.category}
          size="small"
          variant="outlined"
        />
      </Box>

      {/* Description */}
      <Box sx={{ mb: 3 }}>
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

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="contained"
          color="success"
          size="small"
          onClick={handleApprove}
          disabled={isLoading}
          sx={{ textTransform: 'none', flex: 1 }}
        >
          {isLoading ? 'Approving...' : 'Approve'}
        </Button>
        <Button
          variant="outlined"
          color="error"
          size="small"
          sx={{ textTransform: 'none', flex: 1 }}
        >
          Reject
        </Button>
      </Box>

      {/* Created Date */}
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Submitted {new Date(timeEntry.createdAt).toLocaleDateString()}
        </Typography>
      </Box>
    </Box>
  );
};

export default ApprovalCard; 