import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useUpdateProjectMutation } from '../../store/api/projectApi';
import type { ProjectInfo } from '../../store/api/projectApi';

interface ProjectSettingsProps {
  project: ProjectInfo;
}

const settingsSchema = yup.object({
  name: yup.string().required('Project name is required'),
  description: yup.string().required('Project description is required'),
  status: yup.string().required('Status is required'),
  dueDate: yup.string().required('Due date is required'),
});

interface SettingsFormData {
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold' | 'cancelled';
  dueDate: string;
}

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'on-hold', label: 'On Hold' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const ProjectSettings: React.FC<ProjectSettingsProps> = ({ project }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updateProject, { isLoading, error }] = useUpdateProjectMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SettingsFormData>({
    resolver: yupResolver(settingsSchema),
    defaultValues: {
      name: project.name,
      description: project.description,
      status: project.status,
      dueDate: project.dueDate.split('T')[0], // Convert to date input format
    },
  });

  const onSubmit = async (data: SettingsFormData) => {
    try {
      await updateProject({
        id: project.id,
        data: {
          ...data,
          dueDate: new Date(data.dueDate).toISOString(),
        },
      }).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update project:', error);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          Project Settings
        </Typography>
        {!isEditing && (
          <Button
            variant="outlined"
            size="small"
            onClick={handleEdit}
            sx={{ textTransform: 'none' }}
          >
            Edit
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to update project settings.
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Project Name"
              fullWidth
              margin="normal"
              error={!!errors.name}
              helperText={errors.name?.message}
              disabled={!isEditing || isLoading}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Description"
              fullWidth
              margin="normal"
              multiline
              rows={3}
              error={!!errors.description}
              helperText={errors.description?.message}
              disabled={!isEditing || isLoading}
            />
          )}
        />

        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth margin="normal" error={!!errors.status}>
              <InputLabel>Status</InputLabel>
              <Select
                {...field}
                label="Status"
                disabled={!isEditing || isLoading}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />

        <Controller
          name="dueDate"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Due Date"
              type="date"
              fullWidth
              margin="normal"
              error={!!errors.dueDate}
              helperText={errors.dueDate?.message}
              disabled={!isEditing || isLoading}
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
        />

        {isEditing && (
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{ textTransform: 'none' }}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              variant="outlined"
              onClick={handleCancel}
              disabled={isLoading}
              sx={{ textTransform: 'none' }}
            >
              Cancel
            </Button>
          </Box>
        )}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Read-only Information */}
      <Box>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Project Information
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Created: {new Date(project.startDate).toLocaleDateString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manager: {project.manager.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Budget: {project.budget.currency} {project.budget.allocated.toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Progress: {project.progress}%
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectSettings; 