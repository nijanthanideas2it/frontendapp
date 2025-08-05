import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Alert,
  CircularProgress,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Sort as SortIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useGlobalSearchQuery, useClearSearchHistoryMutation } from '../../store/api/searchApi';
import { SearchInterface } from '../../components/search/SearchInterface';
import { SearchResults } from '../../components/search/SearchResults';
import { SearchFilters } from '../../components/search/SearchFilters';
import type { SearchEntityType } from '../../types/api/search';

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<SearchEntityType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'name'>('relevance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);

  const { data: searchData, isLoading, error } = useGlobalSearchQuery(
    {
      q: query,
      type: selectedType === 'all' ? undefined : selectedType,
      sort_by: sortBy,
      sort_order: sortOrder,
      limit: 50,
    },
    { skip: !query || query.length < 2 }
  );

  const [clearHistory] = useClearSearchHistoryMutation();

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
  };

  const handleTypeChange = (type: SearchEntityType | 'all') => {
    setSelectedType(type);
  };

  const handleClearFilters = () => {
    setSelectedType('all');
    setSortBy('relevance');
    setSortOrder('desc');
  };

  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleSortChange = (newSortBy: 'relevance' | 'date' | 'name') => {
    setSortBy(newSortBy);
    setSortOrder(newSortBy === 'relevance' ? 'desc' : 'asc');
    handleSortClose();
  };

  const handleClearHistory = async () => {
    try {
      await clearHistory().unwrap();
    } catch (error) {
      console.error('Failed to clear search history:', error);
    }
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'relevance':
        return 'Relevance';
      case 'date':
        return 'Date';
      case 'name':
        return 'Name';
      default:
        return 'Sort';
    }
  };

  return (
    <Container maxWidth="xl">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Global Search
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Search across projects, tasks, users, and milestones
        </Typography>
      </Box>

      {/* Search Interface */}
      <Box sx={{ mb: 4 }}>
        <SearchInterface
          query={query}
          onQueryChange={setQuery}
          onSearch={handleSearch}
          placeholder="Search projects, tasks, users, milestones..."
        />
      </Box>

      {/* Search Results and Filters */}
      {query && (
        <Grid container spacing={3}>
          {/* Filters Sidebar */}
          <Grid item xs={12} md={3}>
            <SearchFilters
              selectedType={selectedType}
              onTypeChange={handleTypeChange}
              onClearFilters={handleClearFilters}
              totalResults={searchData?.total_results || 0}
              searchTime={searchData?.search_time_ms}
            />
          </Grid>

          {/* Results */}
          <Grid item xs={12} md={9}>
            {/* Results Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">
                {searchData ? `${searchData.total_results} results` : 'Searching...'}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  startIcon={<SortIcon />}
                  onClick={handleSortClick}
                  variant="outlined"
                >
                  {getSortLabel()}
                </Button>
                
                <Button
                  size="small"
                  startIcon={<ClearIcon />}
                  onClick={handleClearHistory}
                  variant="outlined"
                >
                  Clear History
                </Button>
              </Box>

              <Menu
                anchorEl={sortAnchorEl}
                open={Boolean(sortAnchorEl)}
                onClose={handleSortClose}
              >
                <MenuItem onClick={() => handleSortChange('relevance')}>
                  Sort by Relevance
                </MenuItem>
                <MenuItem onClick={() => handleSortChange('date')}>
                  Sort by Date
                </MenuItem>
                <MenuItem onClick={() => handleSortChange('name')}>
                  Sort by Name
                </MenuItem>
              </Menu>
            </Box>

            {/* Search Results */}
            <SearchResults
              results={searchData?.data || []}
              isLoading={isLoading}
              error={error ? 'Failed to load search results' : undefined}
            />
          </Grid>
        </Grid>
      )}

      {/* Empty State */}
      {!query && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Start searching to find what you're looking for
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Search across projects, tasks, users, and milestones to quickly find what you need.
          </Typography>
        </Box>
      )}

      {/* Loading State */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Failed to load search results. Please try again.
        </Alert>
      )}
    </Container>
  );
}; 