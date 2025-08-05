import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  SupervisorAccount as ManagerIcon,
  Engineering as DeveloperIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import type { UserListItem } from '../../types/api/user';

interface UserCardProps {
  user: UserListItem;
  onEdit: (user: UserListItem) => void;
  onDelete: (userId: string) => void;
  onRoleChange: (userId: string, newRole: string) => void;
  currentUserRole?: string;
}

const getRoleIcon = (role: string) => {
  switch (role.toLowerCase()) {
    case 'admin':
      return <AdminIcon />;
    case 'manager':
      return <ManagerIcon />;
    case 'developer':
      return <DeveloperIcon />;
    case 'business':
      return <BusinessIcon />;
    default:
      return <PersonIcon />;
  }
};

const getRoleColor = (role: string) => {
  switch (role.toLowerCase()) {
    case 'admin':
      return 'error';
    case 'manager':
      return 'warning';
    case 'developer':
      return 'primary';
    case 'business':
      return 'success';
    default:
      return 'default';
  }
};

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDelete,
  onRoleChange,
  currentUserRole = 'user',
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(user);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(user.id);
    handleMenuClose();
  };

  const handleRoleChange = (newRole: string) => {
    onRoleChange(user.id, newRole);
    handleMenuClose();
  };

  const canManageUsers = currentUserRole === 'admin' || currentUserRole === 'manager';
  const canDeleteUser = currentUserRole === 'admin' && user.role !== 'admin';

  return (
    <Card
      elevation={1}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          elevation: 3,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              mr: 2,
              bgcolor: user.is_active ? 'primary.main' : 'grey.400',
            }}
          >
            {user.first_name.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              {user.first_name} {user.last_name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {user.email}
            </Typography>
          </Box>
          {canManageUsers && (
            <IconButton
              size="small"
              onClick={handleMenuClick}
              aria-label="User actions"
              aria-controls={open ? 'user-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <MoreVertIcon />
            </IconButton>
          )}
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip
            icon={getRoleIcon(user.role)}
            label={user.role}
            color={getRoleColor(user.role) as 'error' | 'warning' | 'primary' | 'success' | 'default'}
            size="small"
            variant="outlined"
          />
          <Chip
            label={user.is_active ? 'Active' : 'Inactive'}
            color={user.is_active ? 'success' : 'default'}
            size="small"
            variant="outlined"
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Rate: ${user.hourly_rate}/hr
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Joined: {new Date(user.created_at).toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'user-menu-button',
        }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit User</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleRoleChange('admin')}>
          <ListItemIcon>
            <AdminIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Make Admin</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleRoleChange('manager')}>
          <ListItemIcon>
            <ManagerIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Make Manager</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleRoleChange('developer')}>
          <ListItemIcon>
            <DeveloperIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Make Developer</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleRoleChange('business')}>
          <ListItemIcon>
            <BusinessIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Make Business</ListItemText>
        </MenuItem>

        {canDeleteUser && (
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Delete User</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </Card>
  );
}; 