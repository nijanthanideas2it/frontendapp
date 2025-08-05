import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Pagination,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Paper,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { UserCard } from '../../components/users/UserCard';
import { UserFilters } from '../../components/users/UserFilters';
import { useGetUsersQuery, useUpdateUserMutation, useDeleteUserMutation } from '../../store/api/userApi';
import { useGetCurrentUserQuery } from '../../store/api/authApi';
import type { UsersQueryParams, UserListItem, UpdateUserRequest } from '../../types/api/user';

const ITEMS_PER_PAGE = 12;

export const UsersListPage: React.FC = () => {
  const [filters, setFilters] = useState<UsersQueryParams>({
    page: 1,
    limit: ITEMS_PER_PAGE,
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
  const [editForm, setEditForm] = useState<UpdateUserRequest>({});
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  // API hooks
  const { data: usersData, isLoading, error, refetch } = useGetUsersQuery(filters);
  const { data: currentUser } = useGetCurrentUserQuery();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const handleFiltersChange = (newFilters: UsersQueryParams) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      limit: ITEMS_PER_PAGE,
    });
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleEditUser = (user: UserListItem) => {
    setSelectedUser(user);
    setEditForm({
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      hourly_rate: user.hourly_rate,
      is_active: user.is_active,
    });
    setEditDialogOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId).unwrap();
      setSnackbar({
        open: true,
        message: 'User deleted successfully',
        severity: 'success',
      });
      refetch();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to delete user',
        severity: 'error',
      });
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateUser({ userId, data: { role: newRole } }).unwrap();
      setSnackbar({
        open: true,
        message: 'User role updated successfully',
        severity: 'success',
      });
      refetch();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update user role',
        severity: 'error',
      });
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedUser) return;

    try {
      await updateUser({ userId: selectedUser.id, data: editForm }).unwrap();
      setSnackbar({
        open: true,
        message: 'User updated successfully',
        severity: 'success',
      });
      setEditDialogOpen(false);
      setSelectedUser(null);
      setEditForm({});
      refetch();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update user',
        severity: 'error',
      });
    }
  };

  const handleCancelEdit = () => {
    setEditDialogOpen(false);
    setSelectedUser(null);
    setEditForm({});
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const canManageUsers = currentUser?.role === 'admin' || currentUser?.role === 'manager';

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load users. Please try again.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Users Management
        </Typography>
        {canManageUsers && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {/* TODO: Implement add user */}}
          >
            Add User
          </Button>
        )}
      </Box>

      {/* Filters */}
      <UserFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
        totalResults={usersData?.pagination.total}
      />

      {/* Users Grid */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : usersData?.data.length === 0 ? (
        <Paper
          elevation={1}
          sx={{
            p: 8,
            textAlign: 'center',
            borderRadius: 2,
            border: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No users found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria or filters.
          </Typography>
        </Paper>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {usersData?.data.map((user) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
                <UserCard
                  user={user}
                  onEdit={handleEditUser}
                  onDelete={handleDeleteUser}
                  onRoleChange={handleRoleChange}
                  currentUserRole={currentUser?.role}
                />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {usersData?.pagination.pages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={usersData.pagination.pages}
                page={filters.page || 1}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCancelEdit} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={editForm.first_name || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, first_name: e.target.value }))}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={editForm.last_name || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, last_name: e.target.value }))}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={editForm.role || ''}
                    label="Role"
                    onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value as string }))}
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="manager">Manager</MenuItem>
                    <MenuItem value="developer">Developer</MenuItem>
                    <MenuItem value="business">Business</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Hourly Rate ($)"
                  type="number"
                  value={editForm.hourly_rate || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, hourly_rate: parseFloat(e.target.value) || 0 }))}
                  margin="normal"
                  InputProps={{
                    startAdornment: '$',
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={editForm.is_active === undefined ? '' : editForm.is_active ? 'true' : 'false'}
                    label="Status"
                    onChange={(e) => setEditForm(prev => ({ 
                      ...prev, 
                      is_active: e.target.value === 'true' ? true : e.target.value === 'false' ? false : undefined 
                    }))}
                  >
                    <MenuItem value="true">Active</MenuItem>
                    <MenuItem value="false">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelEdit}>Cancel</Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            disabled={isUpdating}
          >
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}; 