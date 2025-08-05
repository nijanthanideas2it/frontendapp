import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  useTheme,
} from '@mui/material';

interface TimerProps {
  onTimeUpdate: (seconds: number) => void;
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
}

export const Timer: React.FC<TimerProps> = ({
  onTimeUpdate,
  isRunning,
  onStart,
  onStop,
  onReset,
}) => {
  const theme = useTheme();
  const [seconds, setSeconds] = useState(0);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatHours = (totalSeconds: number) => {
    return (totalSeconds / 3600).toFixed(2);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prev => {
          const newSeconds = prev + 1;
          onTimeUpdate(newSeconds);
          return newSeconds;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, onTimeUpdate]);

  const handleReset = useCallback(() => {
    setSeconds(0);
    onTimeUpdate(0);
    onReset();
  }, [onTimeUpdate, onReset]);

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
        textAlign: 'center',
      }}
    >
      <Typography variant="h4" component="div" sx={{ fontFamily: 'monospace', mb: 2 }}>
        {formatTime(seconds)}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {formatHours(seconds)} hours
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
        {!isRunning ? (
          <Button
            variant="contained"
            color="primary"
            onClick={onStart}
            sx={{ textTransform: 'none' }}
          >
            Start Timer
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="secondary"
            onClick={onStop}
            sx={{ textTransform: 'none' }}
          >
            Stop Timer
          </Button>
        )}
        
        <Button
          variant="outlined"
          onClick={handleReset}
          disabled={seconds === 0}
          sx={{ textTransform: 'none' }}
        >
          Reset
        </Button>
      </Box>

      {isRunning && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
          <Typography variant="body2" color="info.main">
            Timer is running...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Timer; 