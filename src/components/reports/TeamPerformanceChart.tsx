import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface TeamMember {
  user_id: string;
  first_name: string;
  last_name: string;
  tasks_completed: number;
  hours_logged: number;
  productivity_score: number;
}

interface TeamPerformanceChartProps {
  data: TeamMember[];
  title?: string;
  height?: number;
  metric?: 'tasks_completed' | 'hours_logged' | 'productivity_score';
}

export const TeamPerformanceChart: React.FC<TeamPerformanceChartProps> = ({
  data,
  title = 'Team Performance',
  height = 300,
  metric = 'tasks_completed',
}) => {
  const theme = useTheme();

  const getMetricLabel = () => {
    switch (metric) {
      case 'tasks_completed':
        return 'Tasks Completed';
      case 'hours_logged':
        return 'Hours Logged';
      case 'productivity_score':
        return 'Productivity Score';
      default:
        return 'Tasks Completed';
    }
  };

  const getMetricValue = (item: TeamMember) => {
    switch (metric) {
      case 'tasks_completed':
        return item.tasks_completed;
      case 'hours_logged':
        return item.hours_logged;
      case 'productivity_score':
        return item.productivity_score;
      default:
        return item.tasks_completed;
    }
  };

  const getMetricSuffix = () => {
    switch (metric) {
      case 'tasks_completed':
        return '';
      case 'hours_logged':
        return 'h';
      case 'productivity_score':
        return '%';
      default:
        return '';
    }
  };

  const formatTooltip = (value: number) => {
    if (metric === 'productivity_score') {
      return `${value.toFixed(1)}%`;
    } else if (metric === 'hours_logged') {
      return `${value.toFixed(1)}h`;
    }
    return value.toString();
  };

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: TeamMember }>; label?: string }) => {
    if (active && payload && payload.length) {
      const member = payload[0].payload;
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
            {member.first_name} {member.last_name}
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.primary.main }}>
            {getMetricLabel()}: {formatTooltip(payload[0].value)}
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Tasks: {member.tasks_completed} | Hours: {member.hours_logged.toFixed(1)}h
          </Typography>
        </Box>
      );
    }
    return null;
  };

  const getBarColor = (value: number, index: number) => {
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

  const chartData = data.map((member) => ({
    name: `${member.first_name} ${member.last_name}`,
    value: getMetricValue(member),
    member,
  }));

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        
        <Box sx={{ height, mt: 2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis
                dataKey="name"
                stroke={theme.palette.text.secondary}
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                stroke={theme.palette.text.secondary}
                fontSize={12}
                tickFormatter={(value) => `${value}${getMetricSuffix()}`}
              />
              <Tooltip content={<CustomTooltip />} />
              
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getBarColor(entry.value, index)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>

        {/* Legend */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            {getMetricLabel()} by Team Member
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}; 