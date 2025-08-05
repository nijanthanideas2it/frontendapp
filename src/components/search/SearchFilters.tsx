import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  Divider,
} from '@mui/material';
import {
  FilterList as FilterListIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import type { SearchEntityType } from '../../types/api/search';

interface SearchFiltersProps {
  selectedType: SearchEntityType | 'all';
  onTypeChange: (type: SearchEntityType | 'all') => void;
  onClearFilters: () => void;
  totalResults: number;
  searchTime?: number;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  selectedType,
  onTypeChange,
  onClearFilters,
  totalResults,
  searchTime,
}) => {
  const getTypeLabel = (type: SearchEntityType | 'all') => {
    switch (type) {
      case 'all':
        return 'All Types';
      case 'Project':
        return 'Projects';
      case 'Task':
        return 'Tasks';
      case 'User':
        return 'Users';
      case 'Milestone':
        return 'Milestones';
      default:
        return type;
    }
  };

  const getTypeColor = (type: SearchEntityType | 'all') => {
    switch (type) {
      case 'Project':
        return 'primary';
      case 'Task':
        return 'secondary';
      case 'User':
        return 'success';
      case 'Milestone':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <FilterListIcon color="action" />
          <Typography variant="h6">Filters</Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Entity Type</InputLabel>
            <Select
              value={selectedType}
              label="Entity Type"
              onChange={(e) => onTypeChange(e.target.value as SearchEntityType | 'all')}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="Project">Projects</MenuItem>
              <MenuItem value="Task">Tasks</MenuItem>
              <MenuItem value="User">Users</MenuItem>
              <MenuItem value="Milestone">Milestones</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Active Filters */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Active Filters
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label={getTypeLabel(selectedType)}
              color={getTypeColor(selectedType) as 'primary' | 'secondary' | 'success' | 'warning' | 'default'}
              variant="outlined"
              size="small"
            />
          </Box>
        </Box>

        {/* Results Summary */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Results
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {totalResults.toLocaleString()} results
          </Typography>
          {searchTime && (
            <Typography variant="caption" color="text.secondary">
              Found in {searchTime}ms
            </Typography>
          )}
        </Box>

        <Button
          variant="outlined"
          size="small"
          startIcon={<ClearIcon />}
          onClick={onClearFilters}
          fullWidth
        >
          Clear Filters
        </Button>
      </CardContent>
    </Card>
  );
}; 