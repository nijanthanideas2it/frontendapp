import React from 'react';
import {
  Box,
  Grid,
  Typography,
} from '@mui/material';
import type { TimeEntry } from '../../store/api/timeApi';

interface TimeSummaryProps {
  timeEntries: TimeEntry[];
}

export const TimeSummary: React.FC<TimeSummaryProps> = ({ timeEntries }) => {

  const calculateStats = () => {
    const totalHours = timeEntries.reduce((sum, entry) => sum + entry.duration, 0) / 60;
    const pending = timeEntries.filter(entry => entry.status === 'pending').length;
    const approved = timeEntries.filter(entry => entry.status === 'approved').length;
    const rejected = timeEntries.filter(entry => entry.status === 'rejected').length;

    return {
      totalHours: Math.round(totalHours * 100) / 100,
      pending,
      approved,
      rejected,
      totalEntries: timeEntries.length,
    };
  };

  const stats = calculateStats();

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Time Summary
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.50', borderRadius: 2 }}>
            <Typography variant="h4" color="primary.main" fontWeight={600}>
              {stats.totalHours}h
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Hours
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.50', borderRadius: 2 }}>
            <Typography variant="h4" color="info.main" fontWeight={600}>
              {stats.totalEntries}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Entries
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.50', borderRadius: 2 }}>
            <Typography variant="h4" color="warning.main" fontWeight={600}>
              {stats.pending}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pending
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.50', borderRadius: 2 }}>
            <Typography variant="h4" color="success.main" fontWeight={600}>
              {stats.approved}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Approved
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {stats.rejected > 0 && (
        <Box sx={{ mt: 3, p: 2, bgcolor: 'error.50', borderRadius: 2 }}>
          <Typography variant="body2" color="error.main" textAlign="center">
            {stats.rejected} entries rejected
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TimeSummary; 