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
  Chip,
  OutlinedInput,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { RichTextEditor } from '../common/RichTextEditor';
import { useCreateTaskMutation, useUpdateTaskMutation } from '../../store/api/taskApi';
import type { Task } from '../../store/api/taskApi';

interface TaskFormProps {
  mode: 'create' | 'edit';
  projectId?: number;
  task?: Task;
  onSuccess: (taskId: number) => void;
  onCancel: () => void;
}

const taskSchema = yup.object({
  title: yup.string().required('Task title is required'),
  description: yup.string().required('Task description is required'),
  status: yup.string().required('Status is required'),
  priority: yup.string().required('Priority is required'),
  dueDate: yup.string().required('Due date is required'),
  estimatedHours: yup.number().required('Estimated hours is required').min(0, 'Hours must be positive'),
  assigneeId: yup.number().optional(),
  tags: yup.array().of(yup.string()),
  dependencies: yup.array().of(yup.number()),
});

interface TaskFormData {
  title: string;
  description: string;
  status: Task['status'];
  priority: Task['priority'];
  dueDate: string;
  estimatedHours: number;
  assigneeId?: number;
  tags: string[];
  dependencies: number[];
}

const statusOptions = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' },
];

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const assigneeOptions = [
  { id: 1, name: 'John Doe', avatar: '' },
  { id: 2, name: 'Jane Smith', avatar: '' },
  { id: 3, name: 'Bob Johnson', avatar: '' },
];

const dependencyOptions = [
  { id: 1, title: 'Design System Setup' },
  { id: 2, title: 'API Integration' },
  { id: 3, title: 'Database Schema' },
];

export const TaskForm: React.FC<TaskFormProps> = ({
  mode,
  projectId,
  task,
  onSuccess,
  onCancel,
}) => {
  const [newTag, setNewTag] = useState('');
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  const isLoading = isCreating || isUpdating;

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TaskFormData>({
    resolver: yupResolver(taskSchema),
    defaultValues: task ? {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate.split('T')[0],
      estimatedHours: task.estimatedHours,
      assigneeId: task.assignee?.id,
      tags: task.tags,
      dependencies: task.dependencies,
    } : {
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: '',
      estimatedHours: 0,
      assigneeId: undefined,
      tags: [],
      dependencies: [],
    },
  });

  const watchedTags = watch('tags');
  const watchedDependencies = watch('dependencies');

  const handleAddTag = () => {
    if (newTag.trim() && !watchedTags.includes(newTag.trim())) {
      setValue('tags', [...watchedTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue('tags', watchedTags.filter(tag => tag !== tagToRemove));
  };

  const handleAddDependency = (dependencyId: number) => {
    if (!watchedDependencies.includes(dependencyId)) {
      setValue('dependencies', [...watchedDependencies, dependencyId]);
    }
  };

  const handleRemoveDependency = (dependencyId: number) => {
    setValue('dependencies', watchedDependencies.filter(id => id !== dependencyId));
  };

  const onSubmit = async (data: TaskFormData) => {
    try {
      if (mode === 'create' && projectId) {
        const result = await createTask({
          ...data,
          projectId,
          dueDate: new Date(data.dueDate).toISOString(),
        }).unwrap();
        onSuccess(result.id);
      } else if (mode === 'edit' && task) {
        await updateTask({
          id: task.id,
          data: {
            ...data,
            dueDate: new Date(data.dueDate).toISOString(),
          },
        }).unwrap();
        onSuccess(task.id);
      }
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h6" gutterBottom>
        {mode === 'create' ? 'Create New Task' : 'Edit Task'}
      </Typography>

      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Task Title"
                fullWidth
                error={!!errors.title}
                helperText={errors.title?.message}
                disabled={isLoading}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Description
                </Typography>
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isLoading}
                />
                {errors.description && (
                  <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                    {errors.description.message}
                  </Typography>
                )}
              </Box>
            )}
          />
        </Grid>

        {/* Status and Priority */}
        <Grid item xs={12} sm={6}>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.status}>
                <InputLabel>Status</InputLabel>
                <Select {...field} label="Status" disabled={isLoading}>
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.priority}>
                <InputLabel>Priority</InputLabel>
                <Select {...field} label="Priority" disabled={isLoading}>
                  {priorityOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Grid>

        {/* Assignee */}
        <Grid item xs={12} sm={12}>
          <Controller
            name="assigneeId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.assigneeId} sx={{ minWidth: '100%' }}>
                <InputLabel>Assignee (Wider Field)</InputLabel>
                <Select 
                  {...field} 
                  label="Assignee (Wider Field)" 
                  disabled={isLoading}
                  displayEmpty
                  sx={{ minWidth: '100%' }}
                >
                  <MenuItem value="">
                    <em>Select an assignee</em>
                  </MenuItem>
                  {assigneeOptions.map((assignee) => (
                    <MenuItem key={assignee.id} value={assignee.id}>
                      {assignee.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Grid>

        {/* Due Date */}
        <Grid item xs={12} sm={4}>
          <Controller
            name="dueDate"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Due Date"
                type="date"
                fullWidth
                error={!!errors.dueDate}
                helperText={errors.dueDate?.message}
                disabled={isLoading}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        </Grid>

        {/* Estimated Hours */}
        <Grid item xs={12}>
          <Controller
            name="estimatedHours"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Estimated Hours (Updated Layout)"
                type="number"
                fullWidth
                error={!!errors.estimatedHours}
                helperText={errors.estimatedHours?.message}
                disabled={isLoading}
                inputProps={{ min: 0, step: 0.5 }}
              />
            )}
          />
        </Grid>

        {/* Tags */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            Tags
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            {watchedTags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onDelete={() => handleRemoveTag(tag)}
                disabled={isLoading}
              />
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              label="Add Tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              size="small"
              disabled={isLoading}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Button
              variant="outlined"
              onClick={handleAddTag}
              disabled={!newTag.trim() || isLoading}
              sx={{ textTransform: 'none' }}
            >
              Add
            </Button>
          </Box>
        </Grid>

        {/* Dependencies */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            Dependencies
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            {watchedDependencies.map((dependencyId) => {
              const dependency = dependencyOptions.find(d => d.id === dependencyId);
              return dependency ? (
                <Chip
                  key={dependencyId}
                  label={dependency.title}
                  onDelete={() => handleRemoveDependency(dependencyId)}
                  disabled={isLoading}
                />
              ) : null;
            })}
          </Box>
          <FormControl fullWidth>
            <InputLabel>Add Dependency</InputLabel>
            <Select
              value=""
              onChange={(e) => handleAddDependency(e.target.value as number)}
              label="Add Dependency"
              disabled={isLoading}
            >
              {dependencyOptions
                .filter(d => !watchedDependencies.includes(d.id))
                .map((dependency) => (
                  <MenuItem key={dependency.id} value={dependency.id}>
                    {dependency.title}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          sx={{ textTransform: 'none' }}
        >
          {isLoading ? 'Saving...' : mode === 'create' ? 'Create Task' : 'Update Task'}
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
    </Box>
  );
};

export default TaskForm; 