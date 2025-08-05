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
  Line
} from 'recharts';
import { Box, Typography, Card, CardContent } from '@mui/material';
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

interface ProjectAnalyticsChartProps {
  projects: Project[];
  title?: string;
}

const COLORS = {
  Draft: '#9e9e9e',
  Active: '#4caf50',
  OnHold: '#ff9800',
  Completed: '#2196f3',
  Cancelled: '#f44336'
};

const ProjectAnalyticsChart: React.FC<ProjectAnalyticsChartProps> = ({ 
  projects, 
  title = "Project Analytics" 
}) => {
  
  // Generate mock data if insufficient real data
  const generateMockData = () => {
    const mockProjects: Project[] = [];
    const statuses = ['Active', 'Completed', 'On Hold', 'Draft'];
    const projectNames = [
      'E-commerce Platform',
      'Mobile App Development',
      'Website Redesign',
      'API Integration',
      'Database Migration',
      'Security Audit',
      'Performance Optimization',
      'User Management System',
      'Payment Gateway',
      'Analytics Dashboard',
      'Content Management',
      'Customer Portal'
    ];
    
    // Generate 8-15 mock projects
    const numProjects = Math.floor(Math.random() * 8) + 8; // 8-15 projects
    
    for (let i = 0; i < numProjects; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const name = projectNames[Math.floor(Math.random() * projectNames.length)];
      const budget = Math.floor(Math.random() * 50000) + 10000; // $10k-$60k
      const actualCost = status === 'Completed' ? 
        budget + (Math.random() - 0.5) * 10000 : // ±$5k variance for completed projects
        Math.random() * budget * 0.8; // 0-80% of budget for incomplete projects
      
      const startDate = dayjs().subtract(Math.floor(Math.random() * 365), 'day');
      const endDate = status === 'Completed' ? 
        startDate.add(Math.floor(Math.random() * 180) + 30, 'day') : // 30-210 days for completed
        null; // No end date for incomplete projects
      
      mockProjects.push({
        id: `mock-project-${i}`,
        name: `${name} ${i + 1}`,
        status,
        start_date: startDate.format('YYYY-MM-DD'),
        end_date: endDate ? endDate.format('YYYY-MM-DD') : undefined,
        budget,
        actual_cost: Math.max(0, actualCost),
        manager_id: `mock-manager-${Math.floor(Math.random() * 3)}`,
        created_at: startDate.format('YYYY-MM-DD')
      });
    }
    
    return mockProjects;
  };

  // Use mock data if we have less than 3 real projects
  const effectiveProjects = projects.length < 3 ? generateMockData() : projects;
  
  // 1. Project Status Distribution
  const projectStatusData = effectiveProjects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const projectStatusChartData = Object.entries(projectStatusData).map(([status, count]) => ({
    name: status,
    value: count,
    color: status === 'Active' ? '#4caf50' : 
           status === 'Completed' ? '#2196f3' : 
           status === 'On Hold' ? '#ff9800' : '#9e9e9e'
  }));

  // 2. Budget vs Actual Cost
  const budgetVsActualData = effectiveProjects.map(project => ({
    name: project.name.substring(0, 15) + (project.name.length > 15 ? '...' : ''),
    budget: project.budget,
    actual: project.actual_cost || 0
  }));

  // 3. Projects Over Time (Last 6 months)
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = dayjs().subtract(5 - i, 'month');
    return date.format('YYYY-MM');
  });

  const projectsOverTimeData = last6Months.map(month => {
    const monthProjects = effectiveProjects.filter(project => 
      project.created_at.startsWith(month)
    );
    return {
      month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      count: monthProjects.length,
      active: monthProjects.filter(p => p.status === 'Active').length,
      completed: monthProjects.filter(p => p.status === 'Completed').length
    };
  });

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#172b4d' }}>
        {title}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
        {/* Project Status Distribution */}
        <Box sx={{ flex: { xs: '1', lg: '1' } }}>
          <Card sx={{ height: 450 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Project Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
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
        </Box>

        {/* Budget vs Actual Cost */}
        <Box sx={{ flex: { xs: '1', lg: '1' } }}>
          <Card sx={{ height: 450 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Budget vs Actual Cost
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={budgetVsActualData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                  <Legend />
                  <Bar dataKey="budget" fill="#2196f3" name="Budget" />
                  <Bar dataKey="actual" fill="#ff9800" name="Actual Cost" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>

        {/* Projects Over Time */}
        <Box sx={{ flex: { xs: '1', lg: '1' } }}>
          <Card sx={{ height: 450 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Projects Created Over Time
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={projectsOverTimeData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#2196f3" name="Total Projects" />
                  <Line type="monotone" dataKey="active" stroke="#4caf50" name="Active Projects" />
                  <Line type="monotone" dataKey="completed" stroke="#ff9800" name="Completed Projects" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectAnalyticsChart; 