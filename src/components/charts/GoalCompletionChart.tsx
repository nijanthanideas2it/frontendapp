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
import { Box, Typography, Card, CardContent, Chip, Grid } from '@mui/material';

interface GoalData {
  name: string;
  completed: number;
  target: number;
  percentage: number;
  color: string;
}

interface GoalCompletionChartProps {
  goals: GoalData[];
  title?: string;
}

const GoalCompletionChart: React.FC<GoalCompletionChartProps> = ({ 
  goals, 
  title = "Goal Completion Overview" 
}) => {
  // Prepare data for the bar chart
  const barChartData = goals.map(goal => ({
    name: goal.name,
    completed: goal.completed,
    target: goal.target,
    remaining: goal.target - goal.completed,
    percentage: goal.percentage
  }));

  // Prepare data for the pie chart (overall completion)
  const totalCompleted = goals.reduce((sum, goal) => sum + goal.completed, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);
  const overallPercentage = totalTarget > 0 ? Math.round((totalCompleted / totalTarget) * 100) : 0;

  const pieChartData = [
    { name: 'Completed', value: totalCompleted, color: '#4caf50' },
    { name: 'Remaining', value: totalTarget - totalCompleted, color: '#e0e0e0' }
  ];

  // Calculate statistics
  const completedGoals = goals.filter(goal => goal.percentage >= 100);
  const inProgressGoals = goals.filter(goal => goal.percentage > 0 && goal.percentage < 100);
  const notStartedGoals = goals.filter(goal => goal.percentage === 0);

  return (
    <Card sx={{ height: 500 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#172b4d' }}>
          {title}
        </Typography>

        {/* Statistics Summary */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Chip 
            label={`${completedGoals.length} Completed`} 
            color="success" 
            size="small" 
          />
          <Chip 
            label={`${inProgressGoals.length} In Progress`} 
            color="warning" 
            size="small" 
          />
          <Chip 
            label={`${notStartedGoals.length} Not Started`} 
            color="default" 
            size="small" 
          />
          <Chip 
            label={`${overallPercentage}% Overall`} 
            color={overallPercentage >= 80 ? "success" : overallPercentage >= 50 ? "warning" : "error"}
            variant="outlined"
            size="small" 
          />
        </Box>

        <Grid container spacing={2}>
          {/* Bar Chart */}
          <Grid item xs={12} md={8}>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    content={({ active, payload, label }) => {
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
                              {label}
                            </Typography>
                            <Typography variant="caption">
                              Completed: {data.completed}/{data.target}
                            </Typography>
                            <br />
                            <Typography variant="caption">
                              Progress: {data.percentage}%
                            </Typography>
                          </Box>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="completed" fill="#4caf50" name="Completed" />
                  <Bar dataKey="remaining" fill="#e0e0e0" name="Remaining" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Grid>

          {/* Pie Chart */}
          <Grid item xs={12} md={4}>
            <Box sx={{ height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 600, color: '#172b4d' }}>
                {overallPercentage}%
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                Overall Completion
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
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
                              {data.value} units
                            </Typography>
                          </Box>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
        </Grid>

        {/* Goal Details */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#172b4d' }}>
            Goal Details
          </Typography>
          <Grid container spacing={2}>
            {goals.map((goal, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box sx={{ 
                  p: 2, 
                  border: 1, 
                  borderColor: 'divider', 
                  borderRadius: 1,
                  bgcolor: goal.percentage >= 100 ? '#f1f8e9' : goal.percentage > 0 ? '#fff3e0' : '#fafafa'
                }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    {goal.name}
                  </Typography>
                  <Typography variant="h6" sx={{ color: goal.color, mb: 1 }}>
                    {goal.percentage}%
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {goal.completed}/{goal.target} completed
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default GoalCompletionChart; 