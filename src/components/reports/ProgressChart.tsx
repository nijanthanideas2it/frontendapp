import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

interface ProgressDataPoint {
  date: string;
  completed_tasks: number;
  total_tasks: number;
  hours_logged: number;
  progress_percentage: number;
}

interface ProgressChartProps {
  data: ProgressDataPoint[];
  title?: string;
  height?: number;
  showHours?: boolean;
  showProgress?: boolean;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({
  data,
  title = 'Project Progress',
  height = 300,
  showHours = true,
  showProgress = true,
}) => {
  const theme = useTheme();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTooltip = (value: number, name: string) => {
    if (name === 'completed_tasks' || name === 'total_tasks') {
      return [value, name.replace('_', ' ').toUpperCase()];
    } else if (name === 'hours_logged') {
      return [`${value.toFixed(1)}h`, 'Hours Logged'];
    } else if (name === 'progress_percentage') {
      return [`${value.toFixed(1)}%`, 'Progress'];
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
            {label ? formatDate(label) : ''}
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

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        
        <Box sx={{ height, mt: 2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
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
                tickFormatter={(value) => `${value}${showProgress ? '%' : ''}`}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {showProgress && (
                <Area
                  type="monotone"
                  dataKey="progress_percentage"
                  stroke={theme.palette.primary.main}
                  fill={theme.palette.primary.main + '20'}
                  strokeWidth={2}
                  name="progress_percentage"
                />
              )}
              
              {showHours && (
                <Line
                  type="monotone"
                  dataKey="hours_logged"
                  stroke={theme.palette.secondary.main}
                  strokeWidth={2}
                  dot={{ fill: theme.palette.secondary.main }}
                  name="hours_logged"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </Box>

        {/* Legend */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
          {showProgress && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  backgroundColor: theme.palette.primary.main + '20',
                  border: `2px solid ${theme.palette.primary.main}`,
                  borderRadius: '50%',
                }}
              />
              <Typography variant="caption">Progress %</Typography>
            </Box>
          )}
          
          {showHours && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  backgroundColor: theme.palette.secondary.main,
                  borderRadius: '50%',
                }}
              />
              <Typography variant="caption">Hours Logged</Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}; 