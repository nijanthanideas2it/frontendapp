import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  useTheme,
  Breadcrumbs,
  Link,
  Button,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { TimeEntryList } from '../../components/time/TimeEntryList';
import { TimeSummary } from '../../components/time/TimeSummary';
import { TimeEntryFilters } from '../../components/time/TimeEntryFilters';
import { useGetTimeEntriesQuery } from '../../store/api/timeApi';

export const TimeEntriesPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [filters, setFilters] = useState({
    dateRange: 'week',
    project: '',
    task: '',
    status: '',
    user: '',
  });

  const { data: timeEntriesData, isLoading, error } = useGetTimeEntriesQuery(filters);

  const handleCreateTimeEntry = () => {
    navigate('/time/create');
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleExport = () => {
    console.log('Exporting time entries...');
  };

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load time entries. Please try again.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('/dashboard');
          }}
          sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        >
          Dashboard
        </Link>
        <Typography color="text.primary">Time Entries</Typography>
      </Breadcrumbs>

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Time Entries
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleExport}
              sx={{ textTransform: 'none' }}
            >
              Export
            </Button>
            <Button
              variant="contained"
              onClick={handleCreateTimeEntry}
              sx={{ textTransform: 'none' }}
            >
              Create Time Entry
            </Button>
          </Box>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Track and manage your time entries
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <TimeSummary timeEntries={timeEntriesData?.timeEntries || []} />
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <TimeEntryFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <TimeEntryList
          timeEntries={timeEntriesData?.timeEntries || []}
          isLoading={isLoading}
        />
      </Paper>
    </Container>
  );
};

export default TimeEntriesPage; 