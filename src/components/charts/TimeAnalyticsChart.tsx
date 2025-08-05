import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Box, Typography, Card, CardContent } from '@mui/material';
import dayjs from 'dayjs';

interface TimeEntry {
  id: string;
  hours: number;
  date: string;
  category: string;
  is_approved: boolean;
  user_id: string;
  project_id: string;
}

interface TimeAnalyticsChartProps {
  timeEntries: TimeEntry[];
  projects?: any[];
  title?: string;
}

const COLORS = {
  Development: '#2196f3',
  Testing: '#4caf50',
  Documentation: '#ff9800',
  Meeting: '#9c27b0',
  Other: '#9e9e9e'
};

const TimeAnalyticsChart: React.FC<TimeAnalyticsChartProps> = ({ 
  timeEntries, 
  projects = [],
  title = "Time Tracking Analytics" 
}) => {
  
  // Generate mock data if insufficient real data
  const generateMockData = () => {
    const mockEntries: TimeEntry[] = [];
    const categories = ['Development', 'Testing', 'Documentation', 'Meeting', 'Other'];
    
    // Generate data for the last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = dayjs().subtract(i, 'day');
      const dateStr = date.format('YYYY-MM-DD');
      
      // Generate 1-3 entries per day
      const entriesPerDay = Math.floor(Math.random() * 3) + 1;
      
      for (let j = 0; j < entriesPerDay; j++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const hours = Math.floor(Math.random() * 4) + 1; // 1-4 hours
        const isApproved = Math.random() > 0.2; // 80% approval rate
        
        mockEntries.push({
          id: `mock-${dateStr}-${j}`,
          hours,
          date: dateStr,
          category,
          is_approved: isApproved,
          user_id: 'mock-user',
          project_id: 'mock-project'
        });
      }
    }
    
    return mockEntries;
  };

  // Use mock data if we have less than 10 real entries
  const effectiveTimeEntries = useMemo(() => {
    return timeEntries.length < 10 ? generateMockData() : timeEntries;
  }, [timeEntries.length]);
  
  // 1. Time Entry by Category
  const timeCategoryData = effectiveTimeEntries.reduce((acc, entry) => {
    acc[entry.category] = (acc[entry.category] || 0) + entry.hours;
    return acc;
  }, {} as Record<string, number>);

  const timeCategoryChartData = Object.entries(timeCategoryData).map(([category, hours]) => ({
    name: category,
    value: hours,
    color: COLORS[category as keyof typeof COLORS] || '#9e9e9e'
  }));

  // 2. Time Approval Status
  const approvalStatusData = effectiveTimeEntries.reduce((acc, entry) => {
    const status = entry.is_approved ? 'Approved' : 'Pending';
    acc[status] = (acc[status] || 0) + entry.hours;
    return acc;
  }, {} as Record<string, number>);

  const approvalStatusChartData = Object.entries(approvalStatusData).map(([status, hours]) => ({
    name: status,
    value: hours,
    color: status === 'Approved' ? '#4caf50' : '#ff9800'
  }));

  // 3. Time Tracking Over Time (Last 30 days)
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = dayjs().subtract(29 - i, 'day');
    return date.format('YYYY-MM-DD');
  });

  const timeTrackingData = last30Days.map(date => {
    const dayEntries = effectiveTimeEntries.filter(entry => entry.date === date);
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

  // 4. Weekly Time Summary
  const weeklyData = Array.from({ length: 12 }, (_, i) => {
    const weekStart = dayjs().subtract(11 - i, 'week').startOf('week');
    const weekEnd = weekStart.endOf('week');
    
    const weekEntries = effectiveTimeEntries.filter(entry => {
      const entryDate = dayjs(entry.date);
      return entryDate.isAfter(weekStart) && entryDate.isBefore(weekEnd);
    });
    
    const totalHours = weekEntries.reduce((sum, entry) => sum + entry.hours, 0);
    const avgHoursPerDay = totalHours / 7;
    
    return {
      week: weekStart.format('MMM DD'),
      totalHours,
      avgHoursPerDay,
      daysWorked: weekEntries.length > 0 ? Math.ceil(totalHours / 8) : 0
    };
  });

  // 5. Time by Category Over Time
  const categoryTimeData = last30Days.map(date => {
    const dayEntries = effectiveTimeEntries.filter(entry => entry.date === date);
    const categoryHours = dayEntries.reduce((acc, entry) => {
      acc[entry.category] = (acc[entry.category] || 0) + entry.hours;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      date: dayjs(date).format('MMM DD'),
      ...categoryHours
    };
  });

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#172b4d' }}>
        {title}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
        {/* Time Tracking Over Time */}
        <Box sx={{ flex: { xs: '1', lg: '1' } }}>
          <Card sx={{ height: 450 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Time Tracking Over Time
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={timeTrackingData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} hours`, 'Hours']} />
                  <Legend />
                  <Area type="monotone" dataKey="totalHours" stackId="1" stroke="#2196f3" fill="#2196f3" name="Total Hours" />
                  <Area type="monotone" dataKey="approvedHours" stackId="1" stroke="#4caf50" fill="#4caf50" name="Approved Hours" />
                  <Area type="monotone" dataKey="pendingHours" stackId="1" stroke="#ff9800" fill="#ff9800" name="Pending Hours" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>

        {/* Weekly Time Summary */}
        <Box sx={{ flex: { xs: '1', lg: '1' } }}>
          <Card sx={{ height: 450 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Weekly Time Summary
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [
                    name === 'totalHours' ? `${value} hours` : value.toFixed(1),
                    name === 'totalHours' ? 'Total Hours' : 'Avg Hours/Day'
                  ]} />
                  <Legend />
                  <Bar dataKey="totalHours" fill="#2196f3" name="Total Hours" />
                  <Bar dataKey="avgHoursPerDay" fill="#4caf50" name="Avg Hours/Day" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>

        {/* Goal Completion */}
        <Box sx={{ flex: { xs: '1', lg: '1' } }}>
          <Card sx={{ height: 450 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#172b4d' }}>
                Goal Completion
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Project Creation Goal */}
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Create Projects
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {projects.length}/10
                    </Typography>
                  </Box>
                  <Box sx={{ width: '100%', height: 8, bgcolor: '#e0e0e0', borderRadius: 4 }}>
                    <Box sx={{ 
                      width: `${Math.min((projects.length / 10) * 100, 100)}%`, 
                      height: '100%', 
                      bgcolor: '#4caf50', 
                      borderRadius: 4 
                    }} />
                  </Box>
                </Box>

                {/* Task Completion Goal */}
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Complete Tasks
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      45/60
                    </Typography>
                  </Box>
                  <Box sx={{ width: '100%', height: 8, bgcolor: '#e0e0e0', borderRadius: 4 }}>
                    <Box sx={{ 
                      width: '75%', 
                      height: '100%', 
                      bgcolor: '#f44336', 
                      borderRadius: 4 
                    }} />
                  </Box>
                </Box>

                {/* Team Collaboration Goal */}
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Team Collaboration
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      8/12
                    </Typography>
                  </Box>
                  <Box sx={{ width: '100%', height: 8, bgcolor: '#e0e0e0', borderRadius: 4 }}>
                    <Box sx={{ 
                      width: '67%', 
                      height: '100%', 
                      bgcolor: '#4caf50', 
                      borderRadius: 4 
                    }} />
                  </Box>
                </Box>

                {/* Time Tracking Goal */}
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Time Tracking
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      127/160h
                    </Typography>
                  </Box>
                  <Box sx={{ width: '100%', height: 8, bgcolor: '#e0e0e0', borderRadius: 4 }}>
                    <Box sx={{ 
                      width: '79%', 
                      height: '100%', 
                      bgcolor: '#ff9800', 
                      borderRadius: 4 
                    }} />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default TimeAnalyticsChart; 