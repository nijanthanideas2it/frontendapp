import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Skeleton,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { ApprovalCard } from './ApprovalCard';
import type { TimeEntry } from '../../store/api/timeApi';

interface ApprovalListProps {
  timeEntries: TimeEntry[];
  isLoading: boolean;
  selectedEntries: number[];
  onSelectionChange: (entryIds: number[]) => void;
}

export const ApprovalList: React.FC<ApprovalListProps> = ({
  timeEntries,
  isLoading,
  selectedEntries,
  onSelectionChange,
}) => {
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(timeEntries.map(entry => entry.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectEntry = (entryId: number, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedEntries, entryId]);
    } else {
      onSelectionChange(selectedEntries.filter(id => id !== entryId));
    }
  };

  const allSelected = timeEntries.length > 0 && selectedEntries.length === timeEntries.length;
  const someSelected = selectedEntries.length > 0 && selectedEntries.length < timeEntries.length;

  if (isLoading) {
    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Skeleton variant="rectangular" width={200} height={32} />
        </Box>
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
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
          No pending approvals
        </Typography>
        <Typography variant="body2" color="text.secondary">
          All time entries have been reviewed and approved.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
          }
          label={
            <Typography variant="subtitle1">
              {selectedEntries.length > 0 
                ? `${selectedEntries.length} of ${timeEntries.length} selected`
                : `Select all (${timeEntries.length})`
              }
            </Typography>
          }
        />
      </Box>

      <Grid container spacing={3}>
        {timeEntries.map((timeEntry) => (
          <Grid item xs={12} sm={6} md={4} key={timeEntry.id}>
            <ApprovalCard
              timeEntry={timeEntry}
              selected={selectedEntries.includes(timeEntry.id)}
              onSelectionChange={(checked) => handleSelectEntry(timeEntry.id, checked)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ApprovalList; 