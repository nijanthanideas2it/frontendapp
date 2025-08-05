import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Box,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  Person,
  Settings,
  Logout,
} from '@mui/icons-material';

interface UserMenuProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onLogout?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  user,
  onLogout,
  onProfileClick,
  onSettingsClick,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    onProfileClick?.();
    handleMenuClose();
  };

  const handleSettingsClick = () => {
    onSettingsClick?.();
    handleMenuClose();
  };

  const handleLogout = () => {
    onLogout?.();
    handleMenuClose();
  };

  const isMenuOpen = Boolean(anchorEl);
  const menuId = 'user-menu';

  return (
    <>
      <Tooltip title="Account settings">
        <IconButton
          size="large"
          edge="end"
          aria-label="account of current user"
          aria-controls={menuId}
          aria-haspopup="true"
          onClick={handleMenuOpen}
          color="inherit"
        >
          {user?.avatar ? (
            <Avatar src={user.avatar} sx={{ width: 32, height: 32 }} />
          ) : (
            <Avatar sx={{ width: 32, height: 32 }}>
              <Person />
            </Avatar>
          )}
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        id={menuId}
        keepMounted
        open={isMenuOpen}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            minWidth: 200,
            mt: 1,
          },
        }}
      >
        {user && (
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {user.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user.email}
            </Typography>
          </Box>
        )}
        {user && <Divider />}

        <MenuItem onClick={handleProfileClick}>
          <Person sx={{ mr: 1 }} />
          Profile
        </MenuItem>

        <MenuItem onClick={handleSettingsClick}>
          <Settings sx={{ mr: 1 }} />
          Settings
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogout}>
          <Logout sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu; 