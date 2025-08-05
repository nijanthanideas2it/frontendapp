import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  useTheme,
  ToggleButton,
  ToggleButtonGroup,
  Pagination,
  Alert,
} from '@mui/material';
import { ProjectCard } from '../../components/projects/ProjectCard';
import { ProjectFilters } from '../../components/projects/ProjectFilters';
import { CreateProjectButton } from '../../components/projects/CreateProjectButton';
import { useGetProjectsQuery } from '../../store/api/projectApi';

type ViewMode = 'grid' | 'list';

export const ProjectsList: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    manager: '',
    dateRange: '',
  });

  const { data: projectsData, isLoading, error } = useGetProjectsQuery({
    page,
    ...filters,
  });

  const handleViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newViewMode: ViewMode | null,
  ) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load projects. Please try again.
        </Alert>
      </Container>
    );
  }

  const projects = projectsData?.data || [];
  const totalPages = projectsData?.pagination?.pages || 1;
  const totalProjects = projectsData?.pagination?.total || 0;

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Projects
          </Typography>
          <CreateProjectButton />
        </Box>
        <Typography variant="body1" color="text.secondary">
          Manage and track your projects
        </Typography>
      </Box>

      {/* Filters and View Controls */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: { xs: 'stretch', md: 'center' } }}>
          <Box sx={{ flex: 1 }}>
            <ProjectFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              View:
            </Typography>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              size="small"
            >
              <ToggleButton value="grid" aria-label="grid view">
                Grid
              </ToggleButton>
              <ToggleButton value="list" aria-label="list view">
                List
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
      </Paper>

      {/* Projects Count */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          {totalProjects} project{totalProjects !== 1 ? 's' : ''} found
        </Typography>
      </Box>

      {/* Projects Grid/List */}
      {isLoading ? (
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  minHeight: 200,
                }}
              >
                <Box sx={{ width: '60%', height: 20, bgcolor: 'grey.300', borderRadius: 1, mb: 2 }} />
                <Box sx={{ width: '40%', height: 16, bgcolor: 'grey.200', borderRadius: 1, mb: 2 }} />
                <Box sx={{ width: '100%', height: 60, bgcolor: 'grey.100', borderRadius: 1 }} />
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : projects.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No projects found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {filters.search || filters.status || filters.manager || filters.dateRange
              ? 'Try adjusting your filters or search terms.'
              : 'Get started by creating your first project.'}
          </Typography>
          {!filters.search && !filters.status && !filters.manager && !filters.dateRange && (
            <CreateProjectButton />
          )}
        </Paper>
      ) : (
        <>
          <Grid container spacing={3}>
            {projects.map((project) => (
              <Grid
                item
                xs={12}
                sm={viewMode === 'grid' ? 6 : 12}
                md={viewMode === 'grid' ? 4 : 12}
                lg={viewMode === 'grid' ? 3 : 12}
                key={project.id}
              >
                <ProjectCard
                  project={project}
                  viewMode={viewMode}
                  onClick={() => handleProjectClick(project.id)}
                />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default ProjectsList; 