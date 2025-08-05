import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import type { ProjectFilters as ProjectFiltersType } from '../../store/api/projectApi';

interface ProjectFiltersProps {
  filters: ProjectFiltersType;
  onFiltersChange: (filters: ProjectFiltersType) => void;
}

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'on-hold', label: 'On Hold' },
  { value: 'cancelled', label: 'Cancelled' },
];

const dateRangeOptions = [
  { value: '', label: 'All Dates' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'This Quarter' },
  { value: 'year', label: 'This Year' },
];

export const ProjectFilters: React.FC<ProjectFiltersProps> = ({ filters, onFiltersChange }) => {
  const [localFilters, setLocalFilters] = useState<ProjectFiltersType>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...localFilters, search: event.target.value };
    setLocalFilters(newFilters);
  };

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    const newFilters = { ...localFilters, status: event.target.value };
    setLocalFilters(newFilters);
  };

  const handleManagerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...localFilters, manager: event.target.value };
    setLocalFilters(newFilters);
  };

  const handleDateRangeChange = (event: SelectChangeEvent<string>) => {
    const newFilters = { ...localFilters, dateRange: event.target.value };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      status: '',
      manager: '',
      dateRange: '',
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = filters.search || filters.status || filters.manager || filters.dateRange;

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: { xs: 'stretch', md: 'center' } }}>
      {/* Search Field */}
      <TextField
        label="Search projects"
        variant="outlined"
        size="small"
        value={localFilters.search}
        onChange={handleSearchChange}
        placeholder="Search by name, description..."
        sx={{ minWidth: { xs: '100%', md: 250 } }}
      />

      {/* Status Filter */}
      <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 150 } }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={localFilters.status || ''}
          onChange={handleStatusChange}
          label="Status"
        >
          {statusOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Manager Filter */}
      <TextField
        label="Manager"
        variant="outlined"
        size="small"
        value={localFilters.manager || ''}
        onChange={handleManagerChange}
        placeholder="Filter by manager"
        sx={{ minWidth: { xs: '100%', md: 150 } }}
      />

      {/* Date Range Filter */}
      <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 150 } }}>
        <InputLabel>Date Range</InputLabel>
        <Select
          value={localFilters.dateRange || ''}
          onChange={handleDateRangeChange}
          label="Date Range"
        >
          {dateRangeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'row', md: 'column' } }}>
        <Button
          variant="contained"
          size="small"
          onClick={handleApplyFilters}
          sx={{ minWidth: { xs: 'auto', md: 100 } }}
        >
          Apply
        </Button>
        {hasActiveFilters && (
          <Button
            variant="outlined"
            size="small"
            onClick={handleClearFilters}
            sx={{ minWidth: { xs: 'auto', md: 100 } }}
          >
            Clear
          </Button>
        )}
      </Box>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: { xs: 2, md: 0 } }}>
          {filters.search && (
            <Chip
              label={`Search: ${filters.search}`}
              size="small"
              onDelete={() => {
                const newFilters = { ...localFilters, search: '' };
                setLocalFilters(newFilters);
                onFiltersChange(newFilters);
              }}
            />
          )}
          {filters.status && (
            <Chip
              label={`Status: ${statusOptions.find(opt => opt.value === filters.status)?.label}`}
              size="small"
              onDelete={() => {
                const newFilters = { ...localFilters, status: '' };
                setLocalFilters(newFilters);
                onFiltersChange(newFilters);
              }}
            />
          )}
          {filters.manager && (
            <Chip
              label={`Manager: ${filters.manager}`}
              size="small"
              onDelete={() => {
                const newFilters = { ...localFilters, manager: '' };
                setLocalFilters(newFilters);
                onFiltersChange(newFilters);
              }}
            />
          )}
          {filters.dateRange && (
            <Chip
              label={`Date: ${dateRangeOptions.find(opt => opt.value === filters.dateRange)?.label}`}
              size="small"
              onDelete={() => {
                const newFilters = { ...localFilters, dateRange: '' };
                setLocalFilters(newFilters);
                onFiltersChange(newFilters);
              }}
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default ProjectFilters; 