import React from 'react';
import { Box, Typography, LinearProgress, Grid, Paper } from '@mui/material';
import type { ProgressData } from '../../store/api/projectApi';

interface ProgressChartProps {
  data: ProgressData;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
  const getPhaseColor = (progress: number) => {
    if (progress >= 80) return 'success';
    if (progress >= 60) return 'info';
    if (progress >= 40) return 'warning';
    return 'error';
  };

  return (
    <Box>
      {/* Overall Progress */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            Overall Progress
          </Typography>
          <Typography variant="h4" color="primary.main" fontWeight={700}>
            {data.overall}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={data.overall}
          sx={{
            height: 12,
            borderRadius: 6,
            backgroundColor: 'grey.200',
            '& .MuiLinearProgress-bar': {
              borderRadius: 6,
            },
          }}
        />
      </Box>

      {/* Progress by Phase */}
      <Box>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Progress by Phase
        </Typography>
        <Grid container spacing={2}>
          {data.byPhase.map((phase, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {phase.phase}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {phase.completed}/{phase.tasks} tasks
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={phase.progress}
                  color={getPhaseColor(phase.progress) as any}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                    },
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {phase.progress}% complete
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Timeline Progress */}
      {data.timeline && data.timeline.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Progress Timeline
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 120 }}>
            {data.timeline.map((point, index) => (
              <Box
                key={index}
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: `${point.progress}%`,
                    maxHeight: 80,
                    minHeight: 4,
                    bgcolor: 'primary.main',
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.3s ease',
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                  {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ProgressChart; 