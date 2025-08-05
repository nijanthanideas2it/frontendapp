import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Typography,
} from '@mui/material';
import type { TimeEntryFilters as TimeEntryFiltersType } from '../../store/api/timeApi';

interface TimeEntryFiltersProps {
  filters: TimeEntryFiltersType;
  onFiltersChange: (filters: TimeEntryFiltersType) => void;
}

const dateRangeOptions = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'This Quarter' },
  { value: 'year', label: 'This Year' },
];

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

const projectOptions = [
  { value: '', label: 'All Projects' },
  { value: '1', label: 'Project Alpha' },
  { value: '2', label: 'Project Beta' },
  { value: '3', label: 'Project Gamma' },
];

const userOptions = [
  { value: '', label: 'All Users' },
  { value: '1', label: 'John Doe' },
  { value: '2', label: 'Jane Smith' },
  { value: '3', label: 'Bob Johnson' },
];

export const TimeEntryFilters: React.FC<TimeEntryFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {

  const handleFilterChange = (key: keyof TimeEntryFiltersType, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value && value !== '');

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Filters
        </Typography>
        {hasActiveFilters && (
          <Chip
            label="Clear All"
            onClick={() => onFiltersChange({
              dateRange: 'week',
              project: '',
              task: '',
              status: '',
              user: '',
            })}
            color="primary"
            variant="outlined"
            size="small"
          />
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Date Range</InputLabel>
          <Select
            value={filters.dateRange || 'week'}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            label="Date Range"
          >
            {dateRangeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            label="Status"
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Project</InputLabel>
          <Select
            value={filters.project || ''}
            onChange={(e) => handleFilterChange('project', e.target.value)}
            label="Project"
          >
            {projectOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>User</InputLabel>
          <Select
            value={filters.user || ''}
            onChange={(e) => handleFilterChange('user', e.target.value)}
            label="User"
          >
            {userOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Task"
          size="small"
          value={filters.task || ''}
          onChange={(e) => handleFilterChange('task', e.target.value)}
          placeholder="Search tasks..."
          sx={{ minWidth: 200 }}
        />
      </Box>

      {hasActiveFilters && (
        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {filters.status && (
            <Chip
              label={`Status: ${statusOptions.find(opt => opt.value === filters.status)?.label}`}
              onDelete={() => handleFilterChange('status', '')}
              size="small"
            />
          )}
          {filters.project && (
            <Chip
              label={`Project: ${projectOptions.find(opt => opt.value === filters.project)?.label}`}
              onDelete={() => handleFilterChange('project', '')}
              size="small"
            />
          )}
          {filters.user && (
            <Chip
              label={`User: ${userOptions.find(opt => opt.value === filters.user)?.label}`}
              onDelete={() => handleFilterChange('user', '')}
              size="small"
            />
          )}
          {filters.task && (
            <Chip
              label={`Task: ${filters.task}`}
              onDelete={() => handleFilterChange('task', '')}
              size="small"
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default TimeEntryFilters; 