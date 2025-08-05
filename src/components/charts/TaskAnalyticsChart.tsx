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
  Cell
} from 'recharts';
import { Box, Typography, Card, CardContent } from '@mui/material';
import dayjs from 'dayjs';

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

interface TaskAnalyticsChartProps {
  tasks: Task[];
  title?: string;
}

const COLORS = {
  ToDo: '#9e9e9e',
  InProgress: '#2196f3',
  Review: '#ff9800',
  Done: '#4caf50',
  Low: '#4caf50',
  Medium: '#ff9800',
  High: '#f44336',
  Critical: '#9c27b0'
};

const TaskAnalyticsChart: React.FC<TaskAnalyticsChartProps> = ({ 
  tasks, 
  title = "Task Analytics" 
}) => {
  
  // Generate mock data if insufficient real data
  const generateMockData = () => {
    const mockTasks: Task[] = [];
    const statuses = ['ToDo', 'InProgress', 'Review', 'Done'];
    const priorities = ['Low', 'Medium', 'High', 'Critical'];
    const taskTitles = [
      'Implement user authentication',
      'Design database schema',
      'Create API endpoints',
      'Write unit tests',
      'Update documentation',
      'Fix bug in login flow',
      'Optimize database queries',
      'Add error handling',
      'Implement search functionality',
      'Create admin dashboard',
      'Set up CI/CD pipeline',
      'Performance testing',
      'Security audit',
      'Mobile responsive design',
      'Integration testing'
    ];
    
    // Generate 20-30 mock tasks
    const numTasks = Math.floor(Math.random() * 11) + 20; // 20-30 tasks
    
    for (let i = 0; i < numTasks; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      const title = taskTitles[Math.floor(Math.random() * taskTitles.length)];
      const estimatedHours = Math.floor(Math.random() * 16) + 2; // 2-17 hours
      const actualHours = status === 'Done' ? 
        estimatedHours + (Math.random() - 0.5) * 4 : // ±2 hours variance for completed tasks
        Math.random() * estimatedHours; // 0 to estimated for incomplete tasks
      
      mockTasks.push({
        id: `mock-task-${i}`,
        title: `${title} ${i + 1}`,
        status,
        priority,
        estimated_hours: estimatedHours,
        actual_hours: Math.max(0, actualHours),
        due_date: dayjs().add(Math.floor(Math.random() * 30), 'day').format('YYYY-MM-DD'),
        assignee_id: `mock-user-${Math.floor(Math.random() * 5)}`,
        project_id: 'mock-project'
      });
    }
    
    return mockTasks;
  };

  // Use mock data if we have less than 5 real tasks
  const effectiveTasks = tasks.length < 5 ? generateMockData() : tasks;
  
  // 1. Task Status Distribution
  const taskStatusData = effectiveTasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const taskStatusChartData = Object.entries(taskStatusData).map(([status, count]) => ({
    name: status,
    value: count,
    color: COLORS[status as keyof typeof COLORS] || '#9e9e9e'
  }));

  // 2. Task Priority Distribution
  const taskPriorityData = effectiveTasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const taskPriorityChartData = Object.entries(taskPriorityData).map(([priority, count]) => ({
    name: priority,
    value: count,
    color: COLORS[priority as keyof typeof COLORS] || '#9e9e9e'
  }));

  // 3. Task Priority vs Completion Rate
  const priorityCompletionData = effectiveTasks.reduce((acc, task) => {
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

  // 4. Tasks by Status and Priority
  const statusPriorityData = effectiveTasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = {};
    }
    if (!acc[task.status][task.priority]) {
      acc[task.status][task.priority] = 0;
    }
    acc[task.status][task.priority] += 1;
    return acc;
  }, {} as Record<string, Record<string, number>>);

  const statusPriorityChartData = Object.entries(statusPriorityData).map(([status, priorities]) => ({
    status,
    ...priorities
  }));

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#172b4d' }}>
        {title}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
        {/* Task Status Distribution */}
        <Box sx={{ flex: { xs: '1', lg: '1' } }}>
          <Card sx={{ height: 450 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Task Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
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
        </Box>

        {/* Task Priority Distribution */}
        <Box sx={{ flex: { xs: '1', lg: '1' } }}>
          <Card sx={{ height: 450 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Task Priority Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={taskPriorityChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {taskPriorityChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>

        {/* Priority vs Completion Rate */}
        <Box sx={{ flex: { xs: '1', lg: '1' } }}>
          <Card sx={{ height: 450 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Priority vs Completion Rate
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={priorityCompletionChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="priority" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, 'Completion Rate']} />
                  <Legend />
                  <Bar dataKey="completionRate" fill="#4caf50" name="Completion Rate (%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default TaskAnalyticsChart; 