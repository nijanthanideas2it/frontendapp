import React from 'react';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  level?: number;
  showLabel?: boolean;
  endIcon?: React.ReactNode;
}

export const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  isActive,
  onClick,
  level = 0,
  showLabel = true,
  endIcon,
}) => {
  return (
    <ListItem disablePadding>
      <ListItemButton
        onClick={onClick}
        selected={isActive}
        sx={{
          pl: 2 + level * 2,
          '&.Mui-selected': {
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
            '& .MuiListItemIcon-root': {
              color: 'primary.contrastText',
            },
          },
        }}
      >
        <ListItemIcon
          sx={{
            color: isActive ? 'primary.contrastText' : 'inherit',
            minWidth: 40,
          }}
        >
          {icon}
        </ListItemIcon>
        {showLabel && (
          <>
            <ListItemText
              primary={label}
              primaryTypographyProps={{
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 400,
              }}
            />
            {endIcon && (
              <Box>
                {endIcon}
              </Box>
            )}
          </>
        )}
      </ListItemButton>
    </ListItem>
  );
};

export default NavItem; 