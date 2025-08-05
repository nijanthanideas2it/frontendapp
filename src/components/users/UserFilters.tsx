import React from 'react';
import {
  Paper,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Typography,
  Grid,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import type { UsersQueryParams } from '../../types/api/user';

interface UserFiltersProps {
  filters: UsersQueryParams;
  onFiltersChange: (filters: UsersQueryParams) => void;
  onClearFilters: () => void;
  totalResults?: number;
}

const ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'developer', label: 'Developer' },
  { value: 'business', label: 'Business' },
];

const STATUS_OPTIONS = [
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
];

export const UserFilters: React.FC<UserFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  totalResults,
}) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      search: event.target.value,
      page: 1, // Reset to first page when searching
    });
  };

  const handleRoleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    onFiltersChange({
      ...filters,
      role: event.target.value as string,
      page: 1,
    });
  };

  const handleStatusChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    onFiltersChange({
      ...filters,
      is_active: event.target.value === 'true' ? true : event.target.value === 'false' ? false : undefined,
      page: 1,
    });
  };

  const handleClearFilters = () => {
    onClearFilters();
  };

  const hasActiveFilters = filters.search || filters.role || filters.is_active !== undefined;

  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 2,
        border: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <FilterIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" component="h2">
          Filter Users
        </Typography>
        {totalResults !== undefined && (
          <Chip
            label={`${totalResults} users found`}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ ml: 'auto' }}
          />
        )}
      </Box>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Search users"
            placeholder="Search by name or email..."
            value={filters.search || ''}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            size="small"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Role</InputLabel>
            <Select
              value={filters.role || ''}
              label="Role"
              onChange={handleRoleChange}
            >
              <MenuItem value="">All Roles</MenuItem>
              {ROLES.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.is_active === true ? 'true' : filters.is_active === false ? 'false' : ''}
              label="Status"
              onChange={handleStatusChange}
            >
              <MenuItem value="">All Status</MenuItem>
              {STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {hasActiveFilters && (
              <Tooltip title="Clear all filters">
                <IconButton
                  onClick={handleClearFilters}
                  color="error"
                  size="small"
                  sx={{ border: 1, borderColor: 'error.main' }}
                >
                  <ClearIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Grid>
      </Grid>

      {hasActiveFilters && (
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            Active filters:
          </Typography>
          {filters.search && (
            <Chip
              label={`Search: "${filters.search}"`}
              size="small"
              onDelete={() => onFiltersChange({ ...filters, search: undefined, page: 1 })}
            />
          )}
          {filters.role && (
            <Chip
              label={`Role: ${ROLES.find(r => r.value === filters.role)?.label || filters.role}`}
              size="small"
              onDelete={() => onFiltersChange({ ...filters, role: undefined, page: 1 })}
            />
          )}
          {filters.is_active !== undefined && (
            <Chip
              label={`Status: ${filters.is_active ? 'Active' : 'Inactive'}`}
              size="small"
              onDelete={() => onFiltersChange({ ...filters, is_active: undefined, page: 1 })}
            />
          )}
        </Box>
      )}
    </Paper>
  );
}; 