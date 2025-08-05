import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  Avatar,
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useUpdateProfileMutation } from '../../store/api/authApi';
import type { UserProfile, UpdateUserProfileRequest } from '../../types/api/user';

const profileSchema = yup.object({
  first_name: yup.string().required('First name is required').min(2, 'First name must be at least 2 characters'),
  last_name: yup.string().required('Last name is required').min(2, 'Last name must be at least 2 characters'),
  hourly_rate: yup.number().positive('Hourly rate must be positive').nullable(),
}).required();

interface ProfileFormProps {
  user: UserProfile;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  user,
  onSuccess,
  onCancel,
}) => {
  const [updateProfile, { isLoading, error }] = useUpdateProfileMutation();
  const [isEditing, setIsEditing] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<UpdateUserProfileRequest>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      hourly_rate: user.hourly_rate,
    },
  });

  const onSubmit = async (data: UpdateUserProfileRequest) => {
    try {
      await updateProfile(data).unwrap();
      setIsEditing(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
    onCancel?.();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar
          sx={{ width: 64, height: 64, mr: 2, bgcolor: 'primary.main' }}
          alt={`${user.first_name} ${user.last_name}`}
        >
          {user.first_name.charAt(0)}{user.last_name.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="h6">
            {user.first_name} {user.last_name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to update profile. Please try again.
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="first_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="First Name"
                  fullWidth
                  disabled={!isEditing || isLoading}
                  error={!!errors.first_name}
                  helperText={errors.first_name?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="last_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Last Name"
                  fullWidth
                  disabled={!isEditing || isLoading}
                  error={!!errors.last_name}
                  helperText={errors.last_name?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="hourly_rate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Hourly Rate ($)"
                  type="number"
                  fullWidth
                  disabled={!isEditing || isLoading}
                  error={!!errors.hourly_rate}
                  helperText={errors.hourly_rate?.message}
                  InputProps={{
                    startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>$</Typography>,
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              value={user.email}
              fullWidth
              disabled
              helperText="Email cannot be changed"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Role"
              value={user.role}
              fullWidth
              disabled
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Status"
              value={user.is_active ? 'Active' : 'Inactive'}
              fullWidth
              disabled
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Member Since"
              value={new Date(user.created_at).toLocaleDateString()}
              fullWidth
              disabled
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Login"
              value={user.last_login_at ? new Date(user.last_login_at).toLocaleString() : 'Never'}
              fullWidth
              disabled
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          {!isEditing ? (
            <Button
              variant="contained"
              onClick={handleEdit}
              startIcon={<SaveIcon />}
            >
              Edit Profile
            </Button>
          ) : (
            <>
              <Button
                type="submit"
                variant="contained"
                disabled={!isDirty || isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={isLoading}
                startIcon={<CancelIcon />}
              >
                Cancel
              </Button>
            </>
          )}
        </Box>
      </form>
    </Paper>
  );
}; 