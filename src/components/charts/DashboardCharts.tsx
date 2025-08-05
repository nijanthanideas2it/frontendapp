import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  ZAxis,
  Treemap,
  TreemapItem
} from 'recharts';
import { Box, Typography, Card, CardContent, Grid, Chip } from '@mui/material';
import dayjs from 'dayjs';

interface Project {
  id: string;
  name: string;
  status: string;
  start_date: string;
  end_date?: string;
  budget: number;
  actual_cost: number;
  manager_id: string;
  created_at: string;
}

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  estimated_hours: number;
  actual_hours: number;
  due_date?: string;
  assignee_id?: string;
  project_id: string;
}

interface TimeEntry {
  id: string;
  hours: number;
  date: string;
  category: string;
  is_approved: boolean;
  user_id: string;
  project_id: string;
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  hourly_rate: number;
}

interface DashboardChartsProps {
  projects: Project[];
  tasks: Task[];
  timeEntries: TimeEntry[];
  users: User[];
  title?: string;
}

const COLORS = {
  primary: '#2196f3',
  secondary: '#ff9800',
  success: '#4caf50',
  error: '#f44336',
  warning: '#ff9800',
  info: '#00bcd4',
  purple: '#9c27b0',
  pink: '#e91e63',
  indigo: '#3f51b5',
  teal: '#009688',
  lime: '#cddc39',
  amber: '#ffc107',
  orange: '#ff5722',
  brown: '#795548',
  grey: '#9e9e9e',
  blueGrey: '#607d8b'
};

const DashboardCharts: React.FC<DashboardChartsProps> = ({ 
  projects, 
  tasks, 
  timeEntries, 
  users, 
  title = "Dashboard Analytics" 
}) => {
  
  // 1. Project Status Distribution
  const projectStatusData = projects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const projectStatusChartData = Object.entries(projectStatusData).map(([status, count]) => ({
    name: status,
    value: count,
    color: COLORS[status.toLowerCase() as keyof typeof COLORS] || COLORS.grey
  }));

  // 2. Task Status Distribution
  const taskStatusData = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const taskStatusChartData = Object.entries(taskStatusData).map(([status, count]) => ({
    name: status,
    value: count,
    color: COLORS[status.toLowerCase() as keyof typeof COLORS] || COLORS.grey
  }));

  // 3. Time Entry by Category
  const timeCategoryData = timeEntries.reduce((acc, entry) => {
    acc[entry.category] = (acc[entry.category] || 0) + entry.hours;
    return acc;
  }, {} as Record<string, number>);

  const timeCategoryChartData = Object.entries(timeCategoryData).map(([category, hours]) => ({
    name: category,
    value: hours,
    color: COLORS[category.toLowerCase() as keyof typeof COLORS] || COLORS.grey
  }));

  // 4. Project Budget vs Actual Cost
  const budgetVsActualData = projects
    .filter(p => p.budget > 0)
    .map(project => ({
      name: project.name,
      budget: project.budget,
      actual: project.actual_cost,
      variance: ((project.actual_cost - project.budget) / project.budget) * 100,
      status: project.status
    }));

  // 5. Task Priority vs Completion Rate
  const priorityCompletionData = tasks.reduce((acc, task) => {
    if (!acc[task.priority]) {
      acc[task.priority] = { total: 0, completed: 0 };
    }
    acc[task.priority].total += 1;
    if (task.status === 'Done') {
      acc[task.priority].completed += 1;
    }
    return acc;
  }, {} as Record<string, { total: number; completed: number }>);

  const priorityCompletionChartData = Object.entries(priorityCompletionData).map(([priority, data]) => ({
    priority,
    completionRate: data.total > 0 ? (data.completed / data.total) * 100 : 0,
    total: data.total,
    completed: data.completed
  }));

  // 6. Time Tracking Over Time (Last 30 days)
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = dayjs().subtract(29 - i, 'day');
    return date.format('YYYY-MM-DD');
  });

  const timeTrackingData = last30Days.map(date => {
    const dayEntries = timeEntries.filter(entry => entry.date === date);
    const totalHours = dayEntries.reduce((sum, entry) => sum + entry.hours, 0);
    const approvedHours = dayEntries
      .filter(entry => entry.is_approved)
      .reduce((sum, entry) => sum + entry.hours, 0);
    
    return {
      date: dayjs(date).format('MMM DD'),
      totalHours,
      approvedHours,
      pendingHours: totalHours - approvedHours
    };
  });

  // 7. User Workload Comparison
  const userWorkloadData = users.map(user => {
    const userTasks = tasks.filter(task => task.assignee_id === user.id);
    const userTimeEntries = timeEntries.filter(entry => entry.user_id === user.id);
    const totalHours = userTimeEntries.reduce((sum, entry) => sum + entry.hours, 0);
    
    return {
      name: `${user.first_name} ${user.last_name}`,
      role: user.role,
      taskCount: userTasks.length,
      totalHours,
      avgHoursPerTask: userTasks.length > 0 ? totalHours / userTasks.length : 0
    };
  });

  // 8. Estimated vs Actual Hours Scatter Plot
  const estimatedVsActualData = tasks
    .filter(task => task.estimated_hours > 0 && task.actual_hours > 0)
    .map(task => ({
      name: task.title,
      estimated: task.estimated_hours,
      actual: task.actual_hours,
      variance: ((task.actual_hours - task.estimated_hours) / task.estimated_hours) * 100,
      priority: task.priority,
      status: task.status
    }));

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#172b4d' }}>
        {title}
      </Typography>

      <Grid container spacing={3}>
        {/* Project Status Distribution */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Project Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={projectStatusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {projectStatusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Task Status Distribution */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Task Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={taskStatusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {taskStatusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Time Entry by Category */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Time Entry by Category
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={timeCategoryChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {timeCategoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} hours`, 'Total Hours']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Task Priority vs Completion Rate */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Task Priority vs Completion Rate
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={priorityCompletionChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="priority" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, 'Completion Rate']} />
                  <Bar dataKey="completionRate" fill={COLORS.primary} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Time Tracking Over Time */}
        <Grid item xs={12}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Time Tracking Over Time (Last 30 Days)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timeTrackingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} hours`, 'Hours']} />
                  <Legend />
                  <Area type="monotone" dataKey="totalHours" stackId="1" stroke={COLORS.primary} fill={COLORS.primary} name="Total Hours" />
                  <Area type="monotone" dataKey="approvedHours" stackId="1" stroke={COLORS.success} fill={COLORS.success} name="Approved Hours" />
                  <Area type="monotone" dataKey="pendingHours" stackId="1" stroke={COLORS.warning} fill={COLORS.warning} name="Pending Hours" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* User Workload Comparison */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                User Workload Comparison
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={userWorkloadData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}`, 'Hours']} />
                  <Legend />
                  <Bar dataKey="totalHours" fill={COLORS.primary} name="Total Hours" />
                  <Bar dataKey="taskCount" fill={COLORS.secondary} name="Task Count" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Estimated vs Actual Hours */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Estimated vs Actual Hours
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="estimated" name="Estimated Hours" />
                  <YAxis type="number" dataKey="actual" name="Actual Hours" />
                  <ZAxis type="number" dataKey="variance" range={[60, 400]} />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'estimated' ? `${value} hours` : 
                      name === 'actual' ? `${value} hours` : 
                      `${value}% variance`, 
                      name === 'estimated' ? 'Estimated' : 
                      name === 'actual' ? 'Actual' : 'Variance'
                    ]}
                  />
                  <Legend />
                  <Scatter name="Tasks" data={estimatedVsActualData} fill={COLORS.primary} />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardCharts; 