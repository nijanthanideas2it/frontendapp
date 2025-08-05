import React from 'react';
import { Box, Typography, Paper, Chip, LinearProgress } from '@mui/material';
import type { Milestone } from '../../store/api/projectApi';

interface MilestoneTimelineProps {
  milestones: Milestone[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'in-progress':
      return 'primary';
    case 'upcoming':
      return 'info';
    case 'overdue':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return '✅';
    case 'in-progress':
      return '🔄';
    case 'upcoming':
      return '⏳';
    case 'overdue':
      return '⚠️';
    default:
      return '📋';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return `${Math.abs(diffDays)} days overdue`;
  } else if (diffDays === 0) {
    return 'Due today';
  } else if (diffDays === 1) {
    return 'Due tomorrow';
  } else {
    return `Due in ${diffDays} days`;
  }
};

export const MilestoneTimeline: React.FC<MilestoneTimelineProps> = ({ milestones }) => {
  if (!milestones || milestones.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary" variant="body2">
          No milestones defined for this project
        </Typography>
      </Box>
    );
  }

  // Sort milestones by due date
  const sortedMilestones = [...milestones].sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  return (
    <Box>
      {sortedMilestones.map((milestone, index) => (
        <Box
          key={milestone.id}
          sx={{
            position: 'relative',
            mb: 3,
            '&:not(:last-child)::after': {
              content: '""',
              position: 'absolute',
              left: 20,
              top: 60,
              bottom: -20,
              width: 2,
              bgcolor: 'divider',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            {/* Status Icon */}
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.paper',
                border: '2px solid',
                borderColor: 'divider',
                mr: 3,
                zIndex: 1,
                position: 'relative',
              }}
            >
              <Typography variant="h6">
                {getStatusIcon(milestone.status)}
              </Typography>
            </Box>

            {/* Milestone Content */}
            <Box sx={{ flex: 1 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {milestone.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {milestone.description}
                    </Typography>
                  </Box>
                  <Chip
                    label={milestone.status.replace('-', ' ')}
                    color={getStatusColor(milestone.status) as any}
                    size="small"
                    sx={{ ml: 2 }}
                  />
                </Box>

                {/* Progress Bar */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Progress
                    </Typography>
                    <Typography variant="caption" fontWeight={600}>
                      {milestone.progress}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={milestone.progress}
                    color={getStatusColor(milestone.status) as any}
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

                {/* Task Count and Due Date */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {milestone.tasks.completed}/{milestone.tasks.total} tasks completed
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(milestone.dueDate)}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Box>
        </Box>
      ))}

      {/* Timeline Summary */}
      <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Milestone Summary
        </Typography>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Total Milestones:
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              {milestones.length}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Completed:
            </Typography>
            <Typography variant="h6" fontWeight={600} color="success.main">
              {milestones.filter(m => m.status === 'completed').length}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              In Progress:
            </Typography>
            <Typography variant="h6" fontWeight={600} color="primary.main">
              {milestones.filter(m => m.status === 'in-progress').length}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Overdue:
            </Typography>
            <Typography variant="h6" fontWeight={600} color="error.main">
              {milestones.filter(m => m.status === 'overdue').length}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MilestoneTimeline; 