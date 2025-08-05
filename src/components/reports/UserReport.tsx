import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  Avatar,
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import type { UserTimeReport } from '../../types/api/reports';

interface UserReportProps {
  report: UserTimeReport;
}

export const UserReport: React.FC<UserReportProps> = ({ report }) => {
  const formatHours = (hours: number) => {
    return `${hours.toFixed(1)}h`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const formatDuration = (hours: number) => {
    const days = Math.floor(hours / 8);
    const remainingHours = hours % 8;
    if (days > 0) {
      return `${days}d ${remainingHours.toFixed(1)}h`;
    }
    return `${remainingHours.toFixed(1)}h`;
  };

  const getProductivityColor = (rate: number) => {
    if (rate >= 90) return 'success';
    if (rate >= 75) return 'primary';
    if (rate >= 60) return 'warning';
    return 'error';
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Box>
      {/* User Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: 'primary.main',
                fontSize: '1.5rem',
              }}
            >
              {getInitials(report.user.first_name, report.user.last_name)}
            </Avatar>
            
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                {report.user.first_name} {report.user.last_name}
              </Typography>
              <Chip
                label={report.user.role}
                color="primary"
                variant="outlined"
                size="small"
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Time Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <ScheduleIcon color="primary" />
                <Box>
                  <Typography variant="h4" component="div">
                    {formatHours(report.time_summary.total_hours)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Hours
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AssignmentIcon color="secondary" />
                <Box>
                  <Typography variant="h4" component="div">
                    {report.productivity_metrics.tasks_completed}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tasks Completed
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TrendingUpIcon color="success" />
                <Box>
                  <Typography variant="h4" component="div">
                    {formatHours(report.time_summary.average_hours_per_day)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Hours/Day
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <PersonIcon color="warning" />
                <Box>
                  <Typography variant="h4" component="div">
                    {formatPercentage(report.productivity_metrics.on_time_completion_rate)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    On-Time Rate
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Billable vs Non-Billable Hours */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Billable vs Non-Billable Hours
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Billable Hours
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {formatHours(report.time_summary.billable_hours)}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(report.time_summary.billable_hours / report.time_summary.total_hours) * 100}
                  color="success"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Non-Billable Hours
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {formatHours(report.time_summary.non_billable_hours)}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(report.time_summary.non_billable_hours / report.time_summary.total_hours) * 100}
                  color="warning"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Productivity Metrics */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Productivity Metrics
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Average Task Duration
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {formatDuration(report.productivity_metrics.average_task_duration)}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  On-Time Completion Rate
                </Typography>
                <Typography variant="h6" fontWeight="bold" color={`${getProductivityColor(report.productivity_metrics.on_time_completion_rate)}.main`}>
                  {formatPercentage(report.productivity_metrics.on_time_completion_rate)}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total Days Worked
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {report.time_summary.total_days}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Time by Project */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Time by Project
          </Typography>
          {report.time_by_project.map((project) => (
            <Box key={project.project_id} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" fontWeight="bold">
                  {project.project_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatHours(project.hours)} ({formatPercentage(project.percentage)})
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={project.percentage}
                color="primary"
                sx={{ height: 6, borderRadius: 3 }}
              />
            </Box>
          ))}
        </CardContent>
      </Card>

      {/* Time by Category */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Time by Category
          </Typography>
          {report.time_by_category.map((category) => (
            <Box key={category.category} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" fontWeight="bold">
                  {category.category}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatHours(category.hours)} ({formatPercentage(category.percentage)})
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={category.percentage}
                color="secondary"
                sx={{ height: 6, borderRadius: 3 }}
              />
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
}; 