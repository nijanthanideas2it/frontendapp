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
  TextField,
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  Download as DownloadIcon,
  DateRange as DateRangeIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetUserTimeReportQuery, useExportUserReportMutation } from '../../store/api/reportsApi';
import { TimeAnalysisChart } from '../../components/reports/TimeAnalysisChart';
import { UserReport } from '../../components/reports/UserReport';

export const UserReportsPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedChartType, setSelectedChartType] = useState<'daily' | 'projects' | 'categories'>('daily');
  const [dateRange, setDateRange] = useState({
    start_date: '',
    end_date: '',
  });

  const { data: report, isLoading, error } = useGetUserTimeReportQuery({
    userId: userId!,
    params: {
      start_date: dateRange.start_date || undefined,
      end_date: dateRange.end_date || undefined,
    },
  });

  const [exportReport] = useExportUserReportMutation();

  const handleExportClick = (event: React.MouseEvent<HTMLElement>) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportAnchorEl(null);
  };

  const handleExport = async (format: 'pdf' | 'excel') => {
    if (!userId) return;

    try {
      const result = await exportReport({
        userId,
        format,
        params: {
          start_date: dateRange.start_date || undefined,
          end_date: dateRange.end_date || undefined,
        },
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

  const handleDateChange = (field: 'start_date' | 'end_date') => (event: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  if (!userId) {
    return (
      <Alert severity="error">
        User ID is required
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
        Failed to load user report. Please try again.
      </Alert>
    );
  }

  if (!report) {
    return (
      <Alert severity="info">
        No report data available for this user.
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
              navigate('/users');
            }}
          >
            Users
          </Link>
          <Link
            color="inherit"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate(`/users/${userId}`);
            }}
          >
            {report.user.first_name} {report.user.last_name}
          </Link>
          <Typography color="text.primary">Reports</Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h4" component="h1">
            User Reports
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {/* Date Range Filters */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <DateRangeIcon color="action" />
              <TextField
                label="Start Date"
                type="date"
                value={dateRange.start_date}
                onChange={handleDateChange('start_date')}
                size="small"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="End Date"
                type="date"
                value={dateRange.end_date}
                onChange={handleDateChange('end_date')}
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Chart Type</InputLabel>
              <Select
                value={selectedChartType}
                label="Chart Type"
                onChange={(e) => setSelectedChartType(e.target.value as 'daily' | 'projects' | 'categories')}
              >
                <MenuItem value="daily">Daily Breakdown</MenuItem>
                <MenuItem value="projects">By Project</MenuItem>
                <MenuItem value="categories">By Category</MenuItem>
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

      {/* User Report Summary */}
      <Box sx={{ mb: 4 }}>
        <UserReport report={report} />
      </Box>

      {/* Time Analysis Charts */}
      <Box sx={{ mb: 4 }}>
        <TimeAnalysisChart
          dailyData={report.time_by_date}
          projectData={report.time_by_project}
          categoryData={report.time_by_category}
          title="Time Analysis"
          height={400}
          chartType={selectedChartType}
        />
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3, mb: 4 }}>
        <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Total Hours
          </Typography>
          <Typography variant="h4" color="primary" gutterBottom>
            {report.time_summary.total_hours.toFixed(1)}h
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Period Total
          </Typography>
        </Box>

        <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Billable Hours
          </Typography>
          <Typography variant="h4" color="success.main" gutterBottom>
            {report.time_summary.billable_hours.toFixed(1)}h
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {((report.time_summary.billable_hours / report.time_summary.total_hours) * 100).toFixed(1)}% of total
          </Typography>
        </Box>

        <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Average Daily
          </Typography>
          <Typography variant="h4" color="secondary" gutterBottom>
            {report.time_summary.average_hours_per_day.toFixed(1)}h
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hours per day
          </Typography>
        </Box>

        <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            On-Time Rate
          </Typography>
          <Typography variant="h4" color="warning.main" gutterBottom>
            {report.productivity_metrics.on_time_completion_rate.toFixed(1)}%
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Task completion rate
          </Typography>
        </Box>
      </Box>

      {/* Period Information */}
      {dateRange.start_date && dateRange.end_date && (
        <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Report Period
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date(dateRange.start_date).toLocaleDateString()} - {new Date(dateRange.end_date).toLocaleDateString()}
          </Typography>
        </Box>
      )}
    </Container>
  );
}; 