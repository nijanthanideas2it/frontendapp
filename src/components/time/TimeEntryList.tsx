import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Skeleton,
} from '@mui/material';
import { TimeEntryCard } from './TimeEntryCard';
import type { TimeEntry } from '../../store/api/timeApi';

interface TimeEntryListProps {
  timeEntries: TimeEntry[];
  isLoading: boolean;
}

export const TimeEntryList: React.FC<TimeEntryListProps> = ({
  timeEntries,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Time Entries
        </Typography>
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (timeEntries.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No time entries found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Start tracking your time by creating a new time entry.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Time Entries ({timeEntries.length})
      </Typography>
      <Grid container spacing={3}>
        {timeEntries.map((timeEntry) => (
          <Grid item xs={12} sm={6} md={4} key={timeEntry.id}>
            <TimeEntryCard timeEntry={timeEntry} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TimeEntryList; 