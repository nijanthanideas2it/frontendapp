import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts';

interface TimeByDate {
  date: string;
  hours: number;
  tasks_completed: number;
}

interface TimeByProject {
  project_id: string;
  project_name: string;
  hours: number;
  percentage: number;
}

interface TimeByCategory {
  category: string;
  hours: number;
  percentage: number;
}

interface TimeAnalysisChartProps {
  dailyData: TimeByDate[];
  projectData: TimeByProject[];
  categoryData: TimeByCategory[];
  title?: string;
  height?: number;
  chartType?: 'daily' | 'projects' | 'categories';
}

export const TimeAnalysisChart: React.FC<TimeAnalysisChartProps> = ({
  dailyData,
  projectData,
  categoryData,
  title = 'Time Analysis',
  height = 300,
  chartType = 'daily',
}) => {
  const theme = useTheme();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTooltip = (value: number, name: string) => {
    if (name === 'hours') {
      return [`${value.toFixed(1)}h`, 'Hours'];
    } else if (name === 'tasks_completed') {
      return [value.toString(), 'Tasks'];
    } else if (name === 'percentage') {
      return [`${value.toFixed(1)}%`, 'Percentage'];
    }
    return [value, name];
  };

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: 'background.paper',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            p: 1,
            boxShadow: theme.shadows[3],
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
            {label ? formatDate(label) : label}
          </Typography>
          {payload.map((entry: { value: number; name: string; color: string }, index: number) => (
            <Typography
              key={index}
              variant="body2"
              sx={{ color: entry.color }}
            >
              {formatTooltip(entry.value, entry.name)[1]}: {formatTooltip(entry.value, entry.name)[0]}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  const getBarColor = (index: number) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.error.main,
      theme.palette.info.main,
    ];
    return colors[index % colors.length];
  };

  const getPieColor = (index: number) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.error.main,
      theme.palette.info.main,
    ];
    return colors[index % colors.length];
  };

  const renderChart = () => {
    switch (chartType) {
      case 'daily':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                stroke={theme.palette.text.secondary}
                fontSize={12}
              />
              <YAxis
                stroke={theme.palette.text.secondary}
                fontSize={12}
                tickFormatter={(value) => `${value}h`}
              />
              <Tooltip content={<CustomTooltip />} />
              
              <Line
                type="monotone"
                dataKey="hours"
                stroke={theme.palette.primary.main}
                strokeWidth={2}
                dot={{ fill: theme.palette.primary.main }}
                name="hours"
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'projects':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={projectData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis
                dataKey="project_name"
                stroke={theme.palette.text.secondary}
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                stroke={theme.palette.text.secondary}
                fontSize={12}
                tickFormatter={(value) => `${value}h`}
              />
              <Tooltip content={<CustomTooltip />} />
              
              <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                {projectData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getBarColor(index)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case 'categories':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percentage }) => `${category} ${percentage.toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="hours"
                nameKey="category"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getPieColor(index)} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value.toFixed(1)}h`, 'Hours']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const getChartTitle = () => {
    switch (chartType) {
      case 'daily':
        return 'Daily Time Breakdown';
      case 'projects':
        return 'Time by Project';
      case 'categories':
        return 'Time by Category';
      default:
        return title;
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {getChartTitle()}
        </Typography>
        
        <Box sx={{ height, mt: 2 }}>
          {renderChart()}
        </Box>
      </CardContent>
    </Card>
  );
}; 