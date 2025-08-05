import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Alert,
} from '@mui/material';

interface TimeTrackerProps {
  taskId: number;
}

export const TimeTracker: React.FC<TimeTrackerProps> = ({ taskId }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [manualHours, setManualHours] = useState('');
  const [error, setError] = useState('');

  const handleStartTracking = () => {
    setIsTracking(true);
    setError('');
  };

  const handleStopTracking = () => {
    setIsTracking(false);
    setError('');
  };

  const handleManualEntry = () => {
    const hours = parseFloat(manualHours);
    if (isNaN(hours) || hours <= 0) {
      setError('Please enter a valid number of hours');
      return;
    }
    
    // Here you would typically call an API to log the time
    console.log(`Logging ${hours} hours for task ${taskId}`);
    setManualHours('');
    setError('');
  };

  return (
    <Box>
      {/* Timer Controls */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Time Tracking
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          {!isTracking ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleStartTracking}
              sx={{ textTransform: 'none' }}
            >
              Start Timer
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleStopTracking}
              sx={{ textTransform: 'none' }}
            >
              Stop Timer
            </Button>
          )}
        </Box>

        {isTracking && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Timer is running... (00:00:00)
          </Alert>
        )}
      </Box>

      {/* Manual Time Entry */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Manual Time Entry
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <TextField
            label="Hours"
            type="number"
            value={manualHours}
            onChange={(e) => setManualHours(e.target.value)}
            size="small"
            sx={{ width: 100 }}
            inputProps={{ min: 0, step: 0.25 }}
          />
          <Button
            variant="outlined"
            onClick={handleManualEntry}
            disabled={!manualHours}
            sx={{ textTransform: 'none' }}
          >
            Log Time
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {error}
          </Alert>
        )}
      </Box>

      {/* Time Summary */}
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Today's Time
        </Typography>
        <Typography variant="h6" color="primary.main" fontWeight={600}>
          0.0 hours
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Total logged today
        </Typography>
      </Box>
    </Box>
  );
};

export default TimeTracker; 