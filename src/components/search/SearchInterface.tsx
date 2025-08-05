import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Typography,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  History as HistoryIcon,
  Clear as ClearIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import { useSearchSuggestionsQuery, useGetSearchHistoryQuery, useSaveSearchQueryMutation } from '../../store/api/searchApi';

interface SearchInterfaceProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const SearchInterface: React.FC<SearchInterfaceProps> = ({
  query,
  onQueryChange,
  onSearch,
  placeholder = 'Search projects, tasks, users...',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: suggestions } = useSearchSuggestionsQuery(
    { q: inputValue, limit: 5 },
    { skip: !inputValue || inputValue.length < 2 }
  );

  const { data: searchHistory } = useGetSearchHistoryQuery();
  const [saveSearchQuery] = useSaveSearchQueryMutation();

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    onQueryChange(value);
    
    if (value.length >= 2) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      saveSearchQuery({ query: searchQuery.trim() });
      setIsOpen(false);
      setInputValue(searchQuery.trim());
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch(inputValue);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSearch(suggestion);
  };

  const handleHistoryClick = (historyQuery: string) => {
    handleSearch(historyQuery);
  };

  const clearInput = () => {
    setInputValue('');
    onQueryChange('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const getRecentSearches = () => {
    return searchHistory?.queries?.slice(0, 5) || [];
  };

  const getSuggestions = () => {
    return suggestions?.suggestions || [];
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <TextField
        ref={inputRef}
        fullWidth
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={disabled}
        InputProps={{
          startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
          endAdornment: inputValue && (
            <IconButton size="small" onClick={clearInput}>
              <ClearIcon />
            </IconButton>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          },
        }}
      />

      {/* Suggestions and History Dropdown */}
      {isOpen && (
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            mt: 1,
            maxHeight: 400,
            overflow: 'auto',
            boxShadow: 3,
          }}
        >
          <List>
            {/* Recent Searches */}
            {getRecentSearches().length > 0 && (
              <>
                <ListItem>
                  <Typography variant="subtitle2" color="text.secondary">
                    Recent Searches
                  </Typography>
                </ListItem>
                {getRecentSearches().map((historyQuery, index) => (
                  <ListItem
                    key={index}
                    button
                    onClick={() => handleHistoryClick(historyQuery)}
                    sx={{ py: 1 }}
                  >
                    <ListItemIcon>
                      <HistoryIcon fontSize="small" color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary={historyQuery}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
                <Divider />
              </>
            )}

            {/* Search Suggestions */}
            {getSuggestions().length > 0 && (
              <>
                <ListItem>
                  <Typography variant="subtitle2" color="text.secondary">
                    Suggestions
                  </Typography>
                </ListItem>
                {getSuggestions().map((suggestion, index) => (
                  <ListItem
                    key={index}
                    button
                    onClick={() => handleSuggestionClick(suggestion)}
                    sx={{ py: 1 }}
                  >
                    <ListItemIcon>
                      <TrendingIcon fontSize="small" color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary={suggestion}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
                <Divider />
              </>
            )}

            {/* Quick Search Options */}
            <ListItem>
              <Typography variant="subtitle2" color="text.secondary">
                Quick Search
              </Typography>
            </ListItem>
            <ListItem sx={{ py: 1 }}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label="Projects"
                  size="small"
                  onClick={() => handleSearch('type:project')}
                  clickable
                />
                <Chip
                  label="Tasks"
                  size="small"
                  onClick={() => handleSearch('type:task')}
                  clickable
                />
                <Chip
                  label="Users"
                  size="small"
                  onClick={() => handleSearch('type:user')}
                  clickable
                />
                <Chip
                  label="Milestones"
                  size="small"
                  onClick={() => handleSearch('type:milestone')}
                  clickable
                />
              </Box>
            </ListItem>
          </List>
        </Paper>
      )}
    </Box>
  );
}; 