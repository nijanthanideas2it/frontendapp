import React from 'react';
import { Box, Typography, Avatar, LinearProgress, Chip } from '@mui/material';
import type { TeamWorkloadData } from '../../store/api/projectApi';

interface TeamWorkloadChartProps {
  data: TeamWorkloadData[];
}

const getAvailabilityColor = (availability: string) => {
  switch (availability) {
    case 'available':
      return 'success';
    case 'busy':
      return 'warning';
    case 'overloaded':
      return 'error';
    default:
      return 'default';
  }
};

const getAvailabilityLabel = (availability: string) => {
  switch (availability) {
    case 'available':
      return 'Available';
    case 'busy':
      return 'Busy';
    case 'overloaded':
      return 'Overloaded';
    default:
      return availability;
  }
};

export const TeamWorkloadChart: React.FC<TeamWorkloadChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary" variant="body2">
          No team workload data available
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {data.map((member, index) => (
        <Box
          key={member.member.id}
          sx={{
            mb: 3,
            p: 2,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            backgroundColor: 'background.paper',
          }}
        >
          {/* Member Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              src={member.member.avatar}
              sx={{ width: 40, height: 40, mr: 2 }}
            >
              {member.member.name.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                {member.member.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {member.member.role}
              </Typography>
            </Box>
            <Chip
              label={getAvailabilityLabel(member.availability)}
              color={getAvailabilityColor(member.availability) as any}
              size="small"
              sx={{ height: 24, fontSize: '0.75rem' }}
            />
          </Box>

          {/* Workload Progress */}
          <Box sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                Workload
              </Typography>
              <Typography variant="caption" fontWeight={600}>
                {member.workloadPercentage}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={member.workloadPercentage}
              color={getAvailabilityColor(member.availability) as any}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                },
              }}
            />
          </Box>

          {/* Task Statistics */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" fontWeight={600} color="primary.main">
                {member.assignedTasks}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Assigned
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" fontWeight={600} color="success.main">
                {member.completedTasks}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Completed
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" fontWeight={600} color="warning.main">
                {member.assignedTasks - member.completedTasks}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Pending
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}

      {/* Summary */}
      <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Team Summary
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Total Members:
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {data.length}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Average Workload:
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {Math.round(data.reduce((sum, member) => sum + member.workloadPercentage, 0) / data.length)}%
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Total Tasks:
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {data.reduce((sum, member) => sum + member.assignedTasks, 0)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TeamWorkloadChart; 