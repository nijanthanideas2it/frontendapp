import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import { Box, Typography, Card, CardContent, Chip } from '@mui/material';
import dayjs from 'dayjs';

interface Project {
  id: string;
  name: string;
  due_date: string;
  completion_date?: string;
  status: string;
  progress: number;
}

interface ProjectDueDateChartProps {
  projects: Project[];
  title?: string;
}

const ProjectDueDateChart: React.FC<ProjectDueDateChartProps> = ({ 
  projects, 
  title = "Project Due Date vs Completion Date" 
}) => {
  // Filter projects that have due dates
  const projectsWithDueDates = projects.filter(project => project.due_date);
  
  // Create data for the chart
  const chartData = projectsWithDueDates.map(project => {
    const dueDate = dayjs(project.due_date);
    const completionDate = project.completion_date ? dayjs(project.completion_date) : null;
    const isCompleted = project.status === 'Completed' || project.status === 'Delivered';
    const isOverdue = !isCompleted && dueDate.isBefore(dayjs());
    
    return {
      name: project.name,
      dueDate: dueDate.toDate(),
      completionDate: completionDate?.toDate() || null,
      status: project.status,
      progress: project.progress,
      isCompleted,
      isOverdue,
      daysDifference: completionDate ? completionDate.diff(dueDate, 'day') : null,
      // For scatter plot
      x: dueDate.toDate(),
      y: completionDate?.toDate() || null,
      z: project.progress
    };
  });

  // Calculate statistics
  const completedProjects = chartData.filter(p => p.isCompleted);
  const overdueProjects = chartData.filter(p => p.isOverdue);
  const onTimeProjects = completedProjects.filter(p => p.daysDifference && p.daysDifference <= 0);
  const lateProjects = completedProjects.filter(p => p.daysDifference && p.daysDifference > 0);

  const averageDaysEarly = onTimeProjects.length > 0 
    ? Math.round(onTimeProjects.reduce((sum, p) => sum + (p.daysDifference || 0), 0) / onTimeProjects.length)
    : 0;
  
  const averageDaysLate = lateProjects.length > 0
    ? Math.round(lateProjects.reduce((sum, p) => sum + (p.daysDifference || 0), 0) / lateProjects.length)
    : 0;

  return (
    <Card sx={{ height: 500 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#172b4d' }}>
          {title}
        </Typography>

        {/* Statistics Summary */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Chip 
            label={`${completedProjects.length} Completed`} 
            color="success" 
            size="small" 
          />
          <Chip 
            label={`${overdueProjects.length} Overdue`} 
            color="error" 
            size="small" 
          />
          <Chip 
            label={`${onTimeProjects.length} On Time`} 
            color="primary" 
            size="small" 
          />
          <Chip 
            label={`${lateProjects.length} Late`} 
            color="warning" 
            size="small" 
          />
          {averageDaysEarly > 0 && (
            <Chip 
              label={`Avg ${averageDaysEarly} days early`} 
              color="success" 
              variant="outlined"
              size="small" 
            />
          )}
          {averageDaysLate > 0 && (
            <Chip 
              label={`Avg ${averageDaysLate} days late`} 
              color="error" 
              variant="outlined"
              size="small" 
            />
          )}
        </Box>

        {/* Chart */}
        <Box sx={{ height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Due Date"
                domain={['dataMin', 'dataMax']}
                tickFormatter={(value) => dayjs(value).format('MMM DD')}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Completion Date"
                domain={['dataMin', 'dataMax']}
                tickFormatter={(value) => dayjs(value).format('MMM DD')}
              />
              <ZAxis type="number" dataKey="z" range={[60, 400]} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <Box sx={{ 
                        bgcolor: 'background.paper', 
                        border: 1, 
                        borderColor: 'divider', 
                        borderRadius: 1, 
                        p: 1 
                      }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {data.name}
                        </Typography>
                        <Typography variant="caption">
                          Due: {dayjs(data.x).format('MMM DD, YYYY')}
                        </Typography>
                        <br />
                        <Typography variant="caption">
                          Completed: {data.y ? dayjs(data.y).format('MMM DD, YYYY') : 'Not completed'}
                        </Typography>
                        <br />
                        <Typography variant="caption">
                          Progress: {data.z}%
                        </Typography>
                        {data.daysDifference !== null && (
                          <>
                            <br />
                            <Typography variant="caption" color={data.daysDifference <= 0 ? 'success.main' : 'error.main'}>
                              {data.daysDifference <= 0 
                                ? `${Math.abs(data.daysDifference)} days early`
                                : `${data.daysDifference} days late`
                              }
                            </Typography>
                          </>
                        )}
                      </Box>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              
              {/* Completed projects */}
              <Scatter 
                name="Completed Projects" 
                data={chartData.filter(p => p.isCompleted)} 
                fill="#4caf50"
                shape="circle"
              />
              
              {/* Overdue projects */}
              <Scatter 
                name="Overdue Projects" 
                data={chartData.filter(p => p.isOverdue)} 
                fill="#f44336"
                shape="diamond"
              />
              
              {/* On-time projects */}
              <Scatter 
                name="On Time Projects" 
                data={chartData.filter(p => p.isCompleted && p.daysDifference && p.daysDifference <= 0)} 
                fill="#2196f3"
                shape="square"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </Box>

        {/* Chart Explanation */}
        <Box sx={{ mt: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            <strong>How to read this chart:</strong> Each point represents a project. 
            The X-axis shows the due date, and the Y-axis shows the completion date. 
            Points on the diagonal line (y=x) were completed exactly on time. 
            Points below the line were completed early, and points above were completed late. 
            The size of each point indicates the project's progress percentage.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProjectDueDateChart; 