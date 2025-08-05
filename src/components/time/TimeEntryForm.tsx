import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Alert,
  Grid,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Timer } from './Timer';
import { useCreateTimeEntryMutation } from '../../store/api/timeApi';

interface TimeEntryFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const timeEntrySchema = yup.object({
  projectId: yup.number().required('Project is required'),
  taskId: yup.number().optional(),
  category: yup.string().required('Category is required'),
  description: yup.string().required('Description is required'),
  startTime: yup.string().required('Start time is required'),
  endTime: yup.string().optional(),
  duration: yup.number().required('Duration is required').min(0, 'Duration must be positive'),
});

interface TimeEntryFormData {
  projectId: number;
  taskId?: number;
  category: string;
  description: string;
  startTime: string;
  endTime?: string;
  duration: number;
}

const categoryOptions = [
  { value: 'development', label: 'Development' },
  { value: 'design', label: 'Design' },
  { value: 'testing', label: 'Testing' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'research', label: 'Research' },
  { value: 'documentation', label: 'Documentation' },
  { value: 'other', label: 'Other' },
];

const projectOptions = [
  { id: 1, name: 'Project Alpha' },
  { id: 2, name: 'Project Beta' },
  { id: 3, name: 'Project Gamma' },
];

const taskOptions = [
  { id: 1, title: 'Design System Setup', projectId: 1 },
  { id: 2, title: 'API Integration', projectId: 1 },
  { id: 3, title: 'Database Schema', projectId: 2 },
  { id: 4, title: 'User Authentication', projectId: 2 },
  { id: 5, title: 'Testing Framework', projectId: 3 },
];

export const TimeEntryForm: React.FC<TimeEntryFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [createTimeEntry, { isLoading }] = useCreateTimeEntryMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TimeEntryFormData>({
    resolver: yupResolver(timeEntrySchema),
    defaultValues: {
      projectId: 0,
      taskId: undefined,
      category: '',
      description: '',
      startTime: new Date().toISOString().slice(0, 16),
      endTime: '',
      duration: 0,
    },
  });

  const watchedProjectId = watch('projectId');

  const handleTimerStart = () => {
    setIsTimerRunning(true);
    setValue('startTime', new Date().toISOString().slice(0, 16));
  };

  const handleTimerStop = () => {
    setIsTimerRunning(false);
    setValue('endTime', new Date().toISOString().slice(0, 16));
    setValue('duration', Math.round(timerSeconds / 60));
  };

  const handleTimerReset = () => {
    setIsTimerRunning(false);
    setTimerSeconds(0);
    setValue('duration', 0);
    setValue('endTime', '');
  };

  const handleTimeUpdate = (seconds: number) => {
    setTimerSeconds(seconds);
    setValue('duration', Math.round(seconds / 60));
  };

  const handleManualDurationChange = (hours: string) => {
    const minutes = parseFloat(hours) * 60;
    setValue('duration', Math.round(minutes));
  };

  const onSubmit = async (data: TimeEntryFormData) => {
    try {
      await createTimeEntry({
        projectId: data.projectId,
        taskId: data.taskId,
        category: data.category,
        description: data.description,
        startTime: new Date(data.startTime).toISOString(),
        endTime: data.endTime ? new Date(data.endTime).toISOString() : undefined,
        duration: data.duration,
      }).unwrap();
      
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create time entry:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h6" gutterBottom>
        Log Time Entry
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Timer
            onTimeUpdate={handleTimeUpdate}
            isRunning={isTimerRunning}
            onStart={handleTimerStart}
            onStop={handleTimerStop}
            onReset={handleTimerReset}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="projectId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.projectId}>
                <InputLabel>Project</InputLabel>
                <Select {...field} label="Project" disabled={isLoading}>
                  <MenuItem value={0}>
                    <em>Select a project</em>
                  </MenuItem>
                  {projectOptions.map((project) => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.projectId && (
                  <Typography variant="caption" color="error">
                    {errors.projectId.message}
                  </Typography>
                )}
              </FormControl>
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="taskId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Task (Optional)</InputLabel>
                <Select {...field} label="Task (Optional)" disabled={isLoading}>
                  <MenuItem value="">
                    <em>No specific task</em>
                  </MenuItem>
                  {taskOptions
                    .filter(task => !watchedProjectId || task.projectId === watchedProjectId)
                    .map((task) => (
                      <MenuItem key={task.id} value={task.id}>
                        {task.title}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.category}>
                <InputLabel>Category</InputLabel>
                <Select {...field} label="Category" disabled={isLoading}>
                  <MenuItem value="">
                    <em>Select a category</em>
                  </MenuItem>
                  {categoryOptions.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.category && (
                  <Typography variant="caption" color="error">
                    {errors.category.message}
                  </Typography>
                )}
              </FormControl>
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="duration"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Duration (hours)"
                type="number"
                fullWidth
                error={!!errors.duration}
                helperText={errors.duration?.message}
                disabled={isLoading}
                inputProps={{ min: 0, step: 0.25 }}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  field.onChange(Math.round(value * 60));
                  handleManualDurationChange(e.target.value);
                }}
                value={field.value ? (field.value / 60).toFixed(2) : ''}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="startTime"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Start Time"
                type="datetime-local"
                fullWidth
                error={!!errors.startTime}
                helperText={errors.startTime?.message}
                disabled={isLoading}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="endTime"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="End Time (Optional)"
                type="datetime-local"
                fullWidth
                error={!!errors.endTime}
                helperText={errors.endTime?.message}
                disabled={isLoading}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                multiline
                rows={4}
                fullWidth
                error={!!errors.description}
                helperText={errors.description?.message}
                disabled={isLoading}
                placeholder="Describe what you worked on..."
              />
            )}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading || isTimerRunning}
          sx={{ textTransform: 'none' }}
        >
          {isLoading ? 'Saving...' : 'Save Time Entry'}
        </Button>
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={isLoading}
          sx={{ textTransform: 'none' }}
        >
          Cancel
        </Button>
      </Box>

      {isTimerRunning && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Timer is running. Stop the timer before saving the time entry.
        </Alert>
      )}
    </Box>
  );
};

export default TimeEntryForm; 