import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import type { ProjectProgressReport } from '../../types/api/reports';

interface ProjectReportProps {
  report: ProjectProgressReport;
  showCharts?: boolean;
}

export const ProjectReport: React.FC<ProjectReportProps> = ({
  report,
  showCharts = true,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'primary';
      case 'on_hold':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'primary';
    if (percentage >= 40) return 'warning';
    return 'error';
  };

  return (
    <Box>
      {/* Project Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h5" component="h2">
              {report.project.name}
            </Typography>
            <Chip
              label={report.project.status.replace('_', ' ').toUpperCase()}
              color={getStatusColor(report.project.status) as any}
              variant="outlined"
            />
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Progress
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <LinearProgress
                variant="determinate"
                value={report.project.progress_percentage}
                color={getProgressColor(report.project.progress_percentage) as any}
                sx={{ flex: 1, height: 8, borderRadius: 4 }}
              />
              <Typography variant="body2" fontWeight="bold">
                {formatPercentage(report.project.progress_percentage)}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Tasks Summary */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AssignmentIcon color="primary" />
                <Box>
                  <Typography variant="h4" component="div">
                    {report.progress_data[report.progress_data.length - 1]?.completed_tasks || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tasks Completed
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Tasks */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <ScheduleIcon color="secondary" />
                <Box>
                  <Typography variant="h4" component="div">
                    {report.progress_data[report.progress_data.length - 1]?.total_tasks || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Tasks
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Hours Logged */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TrendingUpIcon color="success" />
                <Box>
                  <Typography variant="h4" component="div">
                    {report.progress_data[report.progress_data.length - 1]?.hours_logged.toFixed(1) || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Hours Logged
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Cost Analysis */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <MoneyIcon color="warning" />
                <Box>
                  <Typography variant="h4" component="div">
                    {formatCurrency(report.cost_analysis.actual_cost)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Actual Cost
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Team Performance Summary */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Team Performance Summary
          </Typography>
          <Grid container spacing={2}>
            {report.team_performance.map((member) => (
              <Grid item xs={12} sm={6} md={4} key={member.user_id}>
                <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    {member.first_name} {member.last_name}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Tasks:
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {member.tasks_completed}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Hours:
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {member.hours_logged.toFixed(1)}h
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Productivity:
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color="success.main">
                      {formatPercentage(member.productivity_score)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Milestones Progress */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Milestones Progress
          </Typography>
          {report.milestone_progress.map((milestone) => (
            <Box key={milestone.id} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" fontWeight="bold">
                  {milestone.name}
                </Typography>
                <Chip
                  label={milestone.is_completed ? 'Completed' : 'In Progress'}
                  color={milestone.is_completed ? 'success' : 'primary'}
                  size="small"
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={milestone.completion_percentage}
                  color={milestone.is_completed ? 'success' : 'primary'}
                  sx={{ flex: 1, height: 6, borderRadius: 3 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {formatPercentage(milestone.completion_percentage)}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Due: {new Date(milestone.due_date).toLocaleDateString()}
              </Typography>
            </Box>
          ))}
        </CardContent>
      </Card>

      {/* Cost Analysis */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Cost Analysis
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Budget vs Actual
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Budget:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {formatCurrency(report.cost_analysis.budget)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Actual:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {formatCurrency(report.cost_analysis.actual_cost)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Variance:</Typography>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    color={report.cost_analysis.cost_variance >= 0 ? 'error.main' : 'success.main'}
                  >
                    {formatCurrency(report.cost_analysis.cost_variance)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Budget Utilization
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={report.cost_analysis.cost_percentage}
                    color={report.cost_analysis.cost_percentage > 100 ? 'error' : 'primary'}
                    sx={{ flex: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="body2" fontWeight="bold">
                    {formatPercentage(report.cost_analysis.cost_percentage)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}; 