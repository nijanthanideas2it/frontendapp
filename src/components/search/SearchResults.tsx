import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Folder as ProjectIcon,
  Assignment as TaskIcon,
  Person as UserIcon,
  Flag as MilestoneIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { SearchResult } from '../../types/api/search';

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  error?: string;
  onResultClick?: (result: SearchResult) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  isLoading,
  error,
  onResultClick,
}) => {
  const navigate = useNavigate();

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'Project':
        return <ProjectIcon />;
      case 'Task':
        return <TaskIcon />;
      case 'User':
        return <UserIcon />;
      case 'Milestone':
        return <MilestoneIcon />;
      default:
        return <ProjectIcon />;
    }
  };

  const getEntityColor = (type: string) => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleResultClick = (result: SearchResult) => {
    if (onResultClick) {
      onResultClick(result);
    } else {
      // Default navigation based on entity type
      switch (result.type) {
        case 'Project':
          navigate(`/projects/${result.entity_id}`);
          break;
        case 'Task':
          navigate(`/tasks/${result.entity_id}`);
          break;
        case 'User':
          navigate(`/users/${result.entity_id}`);
          break;
        case 'Milestone':
          // Navigate to project with milestone focus
          navigate(`/projects/${result.entity_id}`);
          break;
        default:
          break;
      }
    }
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 0.8) return 'success';
    if (score >= 0.6) return 'primary';
    if (score >= 0.4) return 'warning';
    return 'default';
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No results found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search terms or filters
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Search Results ({results.length})
        </Typography>
        
        <List>
          {results.map((result, index) => (
            <React.Fragment key={result.id}>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleResultClick(result)}>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: `${getEntityColor(result.type)}.light`,
                        color: `${getEntityColor(result.type)}.main`,
                      }}
                    >
                      {getEntityIcon(result.type)}
                    </Avatar>
                  </ListItemAvatar>
                  
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1" component="span">
                          {result.title}
                        </Typography>
                        <Chip
                          label={result.type}
                          size="small"
                          color={getEntityColor(result.type) as 'primary' | 'secondary' | 'success' | 'warning' | 'default'}
                          variant="outlined"
                        />
                        <Chip
                          label={`${Math.round(result.relevance_score * 100)}%`}
                          size="small"
                          color={getRelevanceColor(result.relevance_score) as 'success' | 'primary' | 'warning' | 'default'}
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {result.description}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <TimeIcon fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(result.created_at)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
              
              {index < results.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}; 