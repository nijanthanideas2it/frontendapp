import { styled } from '@mui/material/styles';
import { Drawer, Box } from '@mui/material';

export const drawerWidth = 240;

export const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    borderRight: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  },
}));

export const StyledMobileDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    boxSizing: 'border-box',
    width: drawerWidth,
    borderRight: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
  },
}));

export const SidebarContent = styled(Box)(() => ({
  overflow: 'auto',
  height: '100%',
}));

export const UserProfileSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const NavigationList = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(1),
}));

export const CollapsedDrawer = styled(Drawer)(({ theme }) => ({
  width: 64,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: 64,
    boxSizing: 'border-box',
    borderRight: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    overflowX: 'hidden',
  },
})); 