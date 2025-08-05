import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link,
  Alert,
  CircularProgress,
  Button,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetProjectProgressReportQuery, useExportProjectReportMutation } from '../../store/api/reportsApi';
import { ProgressChart } from '../../components/reports/ProgressChart';
import { TeamPerformanceChart } from '../../components/reports/TeamPerformanceChart';

export const ProjectReportsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMetric, setSelectedMetric] = useState<'tasks_completed' | 'hours_logged' | 'productivity_score'>('tasks_completed');

  const { data: report, isLoading, error } = useGetProjectProgressReportQuery({
    projectId: projectId!,
  });

  const [exportReport] = useExportProjectReportMutation();

  const handleExportClick = (event: React.MouseEvent<HTMLElement>) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportAnchorEl(null);
  };

  const handleExport = async (format: 'pdf' | 'excel') => {
    if (!projectId) return;

    try {
      const result = await exportReport({
        projectId,
        format,
      }).unwrap();
      
      // Trigger download
      if (result.download_url) {
        window.open(result.download_url, '_blank');
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
    
    handleExportClose();
  };

  if (!projectId) {
    return (
      <Alert severity="error">
        Project ID is required
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load project report. Please try again.
      </Alert>
    );
  }

  if (!report) {
    return (
      <Alert severity="info">
        No report data available for this project.
      </Alert>
    );
  }

  return (
    <Container maxWidth="xl">
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ mb: 2 }}
        >
          <Link
            color="inherit"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/projects');
            }}
          >
            Projects
          </Link>
          <Link
            color="inherit"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate(`/projects/${projectId}`);
            }}
          >
            {report.project.name}
          </Link>
          <Typography color="text.primary">Reports</Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h4" component="h1">
            Project Reports
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Team Metric</InputLabel>
              <Select
                value={selectedMetric}
                label="Team Metric"
                onChange={(e) => setSelectedMetric(e.target.value as 'tasks_completed' | 'hours_logged' | 'productivity_score')}
              >
                <MenuItem value="tasks_completed">Tasks Completed</MenuItem>
                <MenuItem value="hours_logged">Hours Logged</MenuItem>
                <MenuItem value="productivity_score">Productivity Score</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExportClick}
            >
              Export
            </Button>
            
            <Menu
              anchorEl={exportAnchorEl}
              open={Boolean(exportAnchorEl)}
              onClose={handleExportClose}
            >
              <MenuItem onClick={() => handleExport('pdf')}>
                Export as PDF
              </MenuItem>
              <MenuItem onClick={() => handleExport('excel')}>
                Export as Excel
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Box>

      {/* Progress Chart */}
      <Box sx={{ mb: 4 }}>
        <ProgressChart
          data={report.progress_data.map(item => ({
            ...item,
            progress_percentage: (item.completed_tasks / item.total_tasks) * 100,
          }))}
          title="Project Progress Over Time"
          height={400}
        />
      </Box>

      {/* Team Performance Chart */}
      <Box sx={{ mb: 4 }}>
        <TeamPerformanceChart
          data={report.team_performance}
          title="Team Performance"
          height={400}
          metric={selectedMetric}
        />
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3, mb: 4 }}>
        <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Project Status
          </Typography>
          <Typography variant="h4" color="primary" gutterBottom>
            {report.project.progress_percentage.toFixed(1)}%
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Overall Progress
          </Typography>
        </Box>

        <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Team Members
          </Typography>
          <Typography variant="h4" color="secondary" gutterBottom>
            {report.team_performance.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Active Team Members
          </Typography>
        </Box>

        <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Total Hours
          </Typography>
          <Typography variant="h4" color="success.main" gutterBottom>
            {report.progress_data[report.progress_data.length - 1]?.hours_logged.toFixed(1) || 0}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hours Logged
          </Typography>
        </Box>

        <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Budget Used
          </Typography>
          <Typography variant="h4" color="warning.main" gutterBottom>
            {report.cost_analysis.cost_percentage.toFixed(1)}%
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Budget Utilization
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}; 