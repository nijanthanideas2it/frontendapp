import React, { useState } from 'react';
import {
  Box,
  Container,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showHeader?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  showSidebar = true,
  showHeader = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {showHeader && (
        <Header 
          onMenuClick={handleSidebarToggle}
          showMenuButton={showSidebar}
        />
      )}

      {showSidebar && (
        <Sidebar 
          open={sidebarOpen} 
          onClose={handleSidebarClose}
          user={{
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'ProjectManager'
          }}
        />
      )}

      <Main open={showSidebar ? sidebarOpen : true}>
        <Container maxWidth="xl" sx={{ mt: 2, mb: 2 }}>
          {children}
        </Container>
      </Main>
    </Box>
  );
};

export default AppLayout; 