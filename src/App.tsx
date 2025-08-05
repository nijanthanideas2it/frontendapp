import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  CssBaseline,
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Drawer,
  AppBar,
  Toolbar,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Paper,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Fab
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Feedback as FeedbackIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { store } from './store';
import { theme } from './theme';
import './App.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import UserMenu from './components/common/UserMenu';
import { logout } from './store/slices/authSlice';
import { useLogoutMutation } from './store/api/authApi';
import { ProjectAnalyticsChart, TaskAnalyticsChart, TimeAnalyticsChart } from './components/charts';

// Utility function for API calls with token handling
const apiCall = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // Handle 401/403 responses (token expired or invalid)
    if (response.status === 401 || response.status === 403) {
      console.log('Token expired or invalid, clearing storage and redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return null;
    }
    
    return response;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Simple Login Component
const LoginPage = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('https://projexiq.onrender.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Login response:', responseData); // Debug log
        
        // The API returns { success: true, data: { access_token: "...", user: {...} } }
        if (responseData.success && responseData.data) {
          console.log('Storing token:', responseData.data.access_token);
          console.log('Storing user:', responseData.data.user);
          localStorage.setItem('token', responseData.data.access_token);
          localStorage.setItem('user', JSON.stringify(responseData.data.user));
          
          // Verify token was stored
          const storedToken = localStorage.getItem('token');
          const storedUser = localStorage.getItem('user');
          console.log('Stored token:', storedToken);
          console.log('Stored user:', storedUser);
          
          window.location.href = '/dashboard';
        } else {
          alert('Login failed. Invalid response format.');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Login failed:', errorData);
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `
          radial-gradient(circle at 30% 20%, #1e293b 0%, #334155 25%, #475569 50%, #64748b 75%, #94a3b8 100%),
          linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)
        `,
        backgroundBlendMode: 'overlay',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Add subtle animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle at 70% 80%, rgba(100, 116, 139, 0.3) 0%, transparent 50%)',
          animation: 'float 20s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
            '50%': { transform: 'translate(-20px, -20px) rotate(180deg)' }
          }
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          right: '-30%',
          width: '60%',
          height: '60%',
          background: 'radial-gradient(circle, rgba(71, 85, 105, 0.2) 0%, transparent 70%)',
          animation: 'float 15s ease-in-out infinite reverse',
          '@keyframes float': {
            '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
            '50%': { transform: 'translate(20px, 20px) rotate(-180deg)' }
          }
        }}
      />
      <Container maxWidth="sm">
        <Paper 
          elevation={12} 
          sx={{ 
            p: 4, 
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            position: 'relative',
            zIndex: 1
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ 
                fontWeight: 500,
                color: '#37474f',
                mb: 2
              }}
            >
              Project Management System
            </Typography>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 600,
                color: '#1a237e',
                mb: 1
              }}
            >
              Projexiq
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ 
                fontStyle: 'italic',
                color: '#78909c',
                mb: 2,
                fontWeight: 400
              }}
            >
              Organize. Execute. Deliver.
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ 
                fontWeight: 400,
                color: '#546e7a'
              }}
            >
              Sign in to your account
            </Typography>
          </Box>
        
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Email
            </Typography>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '16px'
              }}
              placeholder="Enter your email"
            />
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Password
            </Typography>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '16px'
              }}
              placeholder="Enter your password"
            />
          </Box>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{ mb: 2 }}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
          

        </Box>
        </Paper>
      </Container>
    </Box>
  );
};

// Sidebar Navigation Component (Jira-style)
const Sidebar = ({ 
  projects, 
  onCreateProject,
  hideProjects = false,
  searchQuery = '',
  onSearchChange = () => {}
}: { 
  projects: Record<string, unknown>[];
  onCreateProject: () => void;
  hideProjects?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isTaskPage = location.pathname.includes('/tasks/');
  
  // Helper function to get project color based on status
  const getProjectColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return '#4caf50';
      case 'completed':
        return '#2196f3';
      case 'on hold':
        return '#ff9800';
      case 'cancelled':
        return '#f44336';
      default:
        return '#9e9e9e';
    }
  };

  // Helper function to get project icon based on status
  const getProjectIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return '▶️';
      case 'completed':
        return '✅';
      case 'on hold':
        return '⏸️';
      case 'cancelled':
        return '❌';
      default:
        return '📋';
    }
  };

  const overviews = [
    { name: 'Home', icon: <HomeIcon />, path: '/dashboard', color: '#0052cc' }
  ];

  // Get starred projects (first 2 projects as starred for demo)
  const starredProjects = (projects || []).slice(0, 2).map(project => ({
    id: project.id as string,
    name: project.name as string,
    icon: getProjectIcon(project.status as string),
    color: getProjectColor(project.status as string),
    status: project.status as string
  }));

  // Get recent projects (next 3 projects as recent for demo)
  const recentProjects = (projects || []).slice(2, 5).map(project => ({
    id: project.id as string,
    name: project.name as string,
    icon: getProjectIcon(project.status as string),
    color: getProjectColor(project.status as string),
    status: project.status as string
  }));

  // Show all projects
  const allProjects = (projects || []).map(project => ({
    id: project.id as string,
    name: project.name as string,
    icon: getProjectIcon(project.status as string),
    color: getProjectColor(project.status as string),
    status: project.status as string
  }));

  // Filter projects based on search query
  const filteredProjects = allProjects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log('Sidebar projects:', { 
    starredProjects, 
    recentProjects, 
    allProjects, 
    filteredProjects,
    searchQuery,
    totalProjects: projects.length, 
    isTaskPage, 
    location: location.pathname,
    hideProjects,
    shouldShowProjects: !isTaskPage && !hideProjects,
    projectsData: projects
  });

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: { xs: 0, sm: isTaskPage ? 80 : 280 },
        flexShrink: 0,
        display: { xs: 'none', sm: 'block' },
        '& .MuiDrawer-paper': {
          width: { xs: 0, sm: isTaskPage ? 80 : 280 },
          boxSizing: 'border-box',
          backgroundColor: '#fafafa',
          borderRight: '1px solid #e0e0e0',
          padding: isTaskPage ? 1 : 2,
          overflow: 'hidden', // Prevent drawer from scrolling
          transition: 'width 0.3s ease-in-out',
          display: { xs: 'none', sm: 'block' },
        },
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        overflow: 'hidden' // Prevent container from scrolling
      }}>
        {/* Overviews Section */}
        <Box sx={{ mb: isTaskPage ? 2 : 3 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: isTaskPage ? 'center' : 'space-between', 
            mb: 2 
          }}>
            {!isTaskPage && (
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#666' }}>
                OVERVIEWS
              </Typography>
            )}
            {!isTaskPage && (
              <IconButton size="small">
                <AddIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
          <List dense>
            {overviews.map((overview) => (
              <ListItem key={overview.name} component="a" href={overview.path} sx={{ 
                backgroundColor: '#fff', 
                borderRadius: 1, 
                mb: 1,
                border: '1px solid #e0e0e0',
                '&:hover': { backgroundColor: '#f5f5f5' },
                minHeight: isTaskPage ? 48 : 'auto',
                justifyContent: isTaskPage ? 'center' : 'flex-start',
                px: isTaskPage ? 1 : 2,
              }}>
                <ListItemIcon sx={{ minWidth: isTaskPage ? 0 : 32 }}>
                  <Box sx={{ 
                    width: isTaskPage ? 32 : 20, 
                    height: isTaskPage ? 32 : 20, 
                    borderRadius: '50%', 
                    backgroundColor: overview.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isTaskPage ? '16px' : '12px'
                  }}>
                    {overview.icon}
                  </Box>
                </ListItemIcon>
                {!isTaskPage && (
                  <ListItemText 
                    primary={overview.name} 
                    primaryTypographyProps={{ fontSize: '14px', fontWeight: 500 }}
                  />
                )}
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Projects Section - Hidden on task pages */}
        {!isTaskPage && !hideProjects && (
          <Box sx={{ 
            flexGrow: 1, 
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexShrink: 0 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#666' }}>
                PROJECTS ({projects.length})
              </Typography>
              <IconButton size="small" onClick={onCreateProject}>
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* Search Bar */}
            <Box sx={{ mb: 2, flexShrink: 0 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: '1rem' }} />,
                  sx: { fontSize: '0.875rem' }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#fff',
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: '#f5f5f5'
                    }
                  }
                }}
              />
            </Box>

            {/* Scrollable Projects Container */}
            <Box sx={{ 
              flexGrow: 1, 
              overflow: 'auto',
              pr: 1 // Add some padding for scrollbar
            }}>
              {/* All Projects */}
              <Typography variant="caption" sx={{ color: '#999', mb: 1, display: 'block' }}>
                {searchQuery ? `Search Results (${filteredProjects.length})` : `All Projects (${allProjects.length})`}
              </Typography>
              {filteredProjects.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {searchQuery ? 'No projects found' : 'No projects yet'}
                  </Typography>
                  {!searchQuery && (
                    <Button 
                      variant="outlined" 
                      size="small" 
                      onClick={onCreateProject}
                      sx={{ fontSize: '0.75rem' }}
                    >
                      Create Project
                    </Button>
                  )}
                </Box>
              ) : (
                <List dense>
                  {filteredProjects.map((project) => (
                    <ListItem 
                      key={project.id} 
                      sx={{ 
                        backgroundColor: '#fff', 
                        borderRadius: 1, 
                        mb: 1,
                        border: '1px solid #e0e0e0',
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: '#f5f5f5' }
                      }}
                      onClick={() => navigate(`/tasks/${project.id}`)}
                    >
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Box sx={{ 
                          width: 20, 
                          height: 20, 
                          borderRadius: '50%', 
                          backgroundColor: project.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px'
                        }}>
                          {project.icon}
                        </Box>
                      </ListItemIcon>
                      <ListItemText 
                        primary={project.name} 
                        primaryTypographyProps={{ fontSize: '14px' }}
                        secondary={project.status}
                        secondaryTypographyProps={{ fontSize: '11px', color: '#999' }}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>

            {/* Show total count if many projects */}
            {filteredProjects.length > 10 && (
              <Box sx={{ 
                mt: 1, 
                textAlign: 'center',
                flexShrink: 0
              }}>
                <Typography variant="caption" sx={{ color: '#999' }}>
                  Showing {filteredProjects.length} of {allProjects.length} projects
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Feedback Section - Hidden on task pages */}
        {!isTaskPage && (
          <Box sx={{ marginTop: 'auto', pt: 2 }}>
            <Button 
              variant="text" 
              size="small" 
              startIcon={<FeedbackIcon />}
              sx={{ 
                color: '#666', 
                textTransform: 'none',
                fontSize: '12px'
              }}
            >
              Give feedback
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

// Header Component (Jira-style)
const Header = ({ user }: { user: Record<string, unknown> | null }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutMutation] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
      dispatch(logout());
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Navigate to login page
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, clear local storage and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'white',
        color: 'text.primary',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        height: 64,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', height: '100%' }}>
        {/* Left Section - Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', width: 200 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#172b4d' }}>
            Projexiq
          </Typography>
        </Box>
        
        {/* Center Section - Search */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          flexGrow: 1, 
          justifyContent: 'center',
          maxWidth: 600
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            backgroundColor: '#f4f5f7',
            borderRadius: 2,
            px: 2,
            py: 1,
            width: '100%',
            maxWidth: 400,
            border: '1px solid #e0e0e0'
          }}>
            <SearchIcon sx={{ color: '#6b778c', mr: 1, fontSize: 20 }} />
            <input
              type="text"
              placeholder="Search"
              style={{
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                fontSize: '14px',
                color: '#172b4d',
                width: '100%'
              }}
            />
          </Box>
        </Box>
        
        {/* Right Section - Profile Icon */}
        <Box sx={{ display: 'flex', alignItems: 'center', width: 200, justifyContent: 'flex-end' }}>
          <UserMenu
            user={{
              name: user?.first_name && user?.last_name 
                ? `${user.first_name} ${user.last_name}` 
                : user?.email || 'User',
              email: user?.email || '',
              avatar: user?.avatar_url || undefined
            }}
            onLogout={handleLogout}
            onProfileClick={() => {
              // TODO: Navigate to profile page
              console.log('Profile clicked');
            }}
            onSettingsClick={() => {
              // TODO: Navigate to settings page
              console.log('Settings clicked');
            }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

// Enhanced Dashboard Component with Layout
const DashboardPage = () => {
  const [user, setUser] = React.useState<Record<string, unknown> | null>(null);
  const [projects, setProjects] = React.useState<Record<string, unknown>[]>([]);
  const [tasks, setTasks] = React.useState<Record<string, unknown>[]>([]);
  const [timeEntries, setTimeEntries] = React.useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState('active');
  const [createProjectOpen, setCreateProjectOpen] = React.useState(false);
  const [createProjectLoading, setCreateProjectLoading] = React.useState(false);
  const [createProjectError, setCreateProjectError] = React.useState('');
  const [createProjectSuccess, setCreateProjectSuccess] = React.useState('');
  const [projectSearchQuery, setProjectSearchQuery] = React.useState('');

  // Form state for create project
  const [projectForm, setProjectForm] = React.useState({
    name: '',
    description: '',
    status: 'Draft',
    start_date: dayjs() as any,
    end_date: null as any,
    budget: '',
    manager_id: ''
  });

  // Form validation errors
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    console.log('DashboardPage useEffect - token:', token ? 'exists' : 'missing');
    console.log('DashboardPage useEffect - userData:', userData ? 'exists' : 'missing');
    
    if (!token || !userData) {
      console.log('Missing token or user data, redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // Skip token validation for now - just proceed with dashboard
        // const testResponse = await apiCall('https://projexiq.onrender.com/auth/me');
        // if (!testResponse) return; // apiCall handles redirect

        // Fetch projects
        const projectsResponse = await apiCall('https://projexiq.onrender.com/projects');
        if (projectsResponse && projectsResponse.ok) {
          const projectsResult = await projectsResponse.json();
          console.log('Projects data:', projectsResult);
          setProjects(projectsResult.data || []);
        } else if (projectsResponse && projectsResponse.status === 401) {
          console.error('Token expired during projects fetch');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return;
        } else {
          console.error('Failed to fetch projects:', projectsResponse?.status);
        }

        // Fetch tasks
        const tasksResponse = await apiCall('https://projexiq.onrender.com/projects/tasks/all');
        if (tasksResponse && tasksResponse.ok) {
          const tasksResult = await tasksResponse.json();
          console.log('Tasks data:', tasksResult);
          setTasks(tasksResult.data || []);
        } else {
          console.error('Failed to fetch tasks:', tasksResponse?.status);
        }

        // Fetch time entries
        const timeEntriesResponse = await apiCall('https://projexiq.onrender.com/time-entries');
        if (timeEntriesResponse && timeEntriesResponse.ok) {
          const timeEntriesResult = await timeEntriesResponse.json();
          console.log('Time entries data:', timeEntriesResult);
          setTimeEntries(timeEntriesResult.data || []);
        } else {
          console.error('Failed to fetch time entries:', timeEntriesResponse?.status);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  console.log('Current projects state:', projects);

  const fetchProjects = async () => {
    try {
      const projectsResponse = await apiCall('https://projexiq.onrender.com/projects');
      if (projectsResponse && projectsResponse.ok) {
        const projectsResult = await projectsResponse.json();
        setProjects(projectsResult.data || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes} MINS AGO`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} HOURS AGO`;
    return 'TODAY';
  };

  const handleCreateProject = async () => {
    // Reset errors and success
    setCreateProjectError('');
    setCreateProjectSuccess('');
    setFormErrors({});

    // Validate form
    const errors: Record<string, string> = {};
    if (!projectForm.name.trim()) {
      errors.name = 'Project name is required';
    }
    if (!projectForm.start_date) {
      errors.start_date = 'Start date is required';
    }
    if (projectForm.end_date && projectForm.end_date.isBefore(projectForm.start_date)) {
      errors.end_date = 'End date must be after start date';
    }
    if (projectForm.budget && parseFloat(projectForm.budget) < 0) {
      errors.budget = 'Budget must be positive';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setCreateProjectLoading(true);

    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (!token || !userData) {
        throw new Error('Authentication required');
      }

      const parsedUser = JSON.parse(userData);
      
      const projectData = {
        name: projectForm.name.trim(),
        description: projectForm.description.trim() || null,
        start_date: projectForm.start_date.format('YYYY-MM-DD'),
        end_date: projectForm.end_date ? projectForm.end_date.format('YYYY-MM-DD') : null,
        budget: projectForm.budget ? parseFloat(projectForm.budget) : null,
        manager_id: parsedUser.id // Use current user as manager
      };

      const response = await apiCall('https://projexiq.onrender.com/projects', {
        method: 'POST',
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create project');
      }

      const result = await response.json();
      
      if (result.success) {
        setCreateProjectSuccess('Project created successfully!');
        // Reset form
        setProjectForm({
          name: '',
          description: '',
          status: 'Draft',
          start_date: dayjs(),
          end_date: null,
          budget: '',
          manager_id: ''
        });
        
        // Refresh projects list
        await fetchProjects();
        
        // Close modal after a short delay
        setTimeout(() => {
          setCreateProjectOpen(false);
          setCreateProjectSuccess('');
        }, 1500);
      } else {
        throw new Error(result.message || 'Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      setCreateProjectError(error instanceof Error ? error.message : 'Failed to create project');
    } finally {
      setCreateProjectLoading(false);
    }
  };

  const handleCloseCreateProject = () => {
    setCreateProjectOpen(false);
    setCreateProjectError('');
    setCreateProjectSuccess('');
    setFormErrors({});
    // Reset form
    setProjectForm({
      name: '',
      description: '',
      status: 'Draft',
      start_date: dayjs(),
      end_date: null,
      budget: '',
      manager_id: ''
    });
  };

  const handleOpenCreateProject = () => {
    setCreateProjectOpen(true);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex' }}>
        <Header user={user} />
        <Sidebar projects={[]} onCreateProject={handleOpenCreateProject} />
        <Box sx={{ 
          flexGrow: 1, 
          p: 3, 
          mt: 8, 
          ml: 7,
          backgroundColor: '#f8f9fa',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#6b778c' }}>
              Loading dashboard...
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  const activeProjects = projects.filter(p => (p.status as string) === 'Active');
  const completedProjects = projects.filter(p => (p.status as string) === 'Completed');
  const displayProjects = activeTab === 'active' ? activeProjects : completedProjects;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <Header user={user} />
        <Sidebar projects={projects} onCreateProject={handleOpenCreateProject} hideProjects={false} searchQuery={projectSearchQuery} onSearchChange={setProjectSearchQuery} />
        
        {/* Main Content */}
        <Box sx={{ 
          flexGrow: 1, 
          display: 'flex',
          flexDirection: 'column',
          ml: { xs: 0, sm: '20px' }, // Responsive margin for mobile
          mt: '64px',
          backgroundColor: '#f8f9fa',
          minHeight: 'calc(100vh - 64px)',
          transition: 'margin-left 0.3s ease-in-out',
          width: '100%',
        }}>
          {/* Welcome Message */}
          <Box sx={{ mb: 4, px: { xs: 2, sm: 3 }, pt: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#172b4d', mb: 1 }}>
              Welcome, {user?.first_name || 'User'}! 👋
            </Typography>
            <Typography variant="body1" sx={{ color: '#6b778c', mb: 1 }}>
              Manage your projects, track tasks, and collaborate with your team.
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b778c', fontStyle: 'italic' }}>
              Role: {user?.role || 'Unknown'}
            </Typography>
          </Box>

          {/* Top Section: Key Performance Indicators */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            flexWrap: 'wrap',
            gap: 3, 
            mb: 4, 
            px: { xs: 2, sm: 3 } 
          }}>
            {/* TOTAL PROJECTS */}
            <Box sx={{ flex: { xs: '1', sm: '1', md: '1' }, minWidth: { sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
              <Card sx={{ 
                height: 120, 
                width: '100%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                        {projects.length}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        TOTAL PROJECTS
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 0.5,
                      color: '#4caf50'
                    }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ↗
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        17%
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* TOTAL TASKS */}
            <Box sx={{ flex: { xs: '1', sm: '1', md: '1' }, minWidth: { sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
              <Card sx={{ 
                height: 120, 
                width: '100%',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                        45
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        TOTAL TASKS
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 0.5,
                      color: '#ff9800'
                    }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ↗
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        70%
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* COMPLETED TASKS */}
            <Box sx={{ flex: { xs: '1', sm: '1', md: '1' }, minWidth: { sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
              <Card sx={{ 
                height: 120, 
                background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                color: 'white',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                        34
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        COMPLETED TASKS
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 0.5,
                      color: '#4caf50'
                    }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ↗
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        80%
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* TEAM MEMBERS */}
            <Box sx={{ flex: { xs: '1', sm: '1', md: '1' }, minWidth: { sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
              <Card sx={{ 
                height: 120, 
                width: '100%',
                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                color: 'white',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                        8
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        TEAM MEMBERS
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 0.5,
                      color: '#f44336'
                    }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ↘
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        28%
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>

          {/* Analytics Charts Section */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 3, 
            mb: 4, 
            px: { xs: 2, sm: 3 } 
          }}>
            {/* Project Analytics */}
            <Box sx={{ width: '100%' }}>
              <ProjectAnalyticsChart 
                projects={projects.map(project => ({
                  id: project.id as string,
                  name: project.name as string,
                  status: project.status as string,
                  start_date: project.start_date as string,
                  end_date: project.end_date as string,
                  budget: project.budget as number || 0,
                  actual_cost: project.actual_cost as number || 0,
                  manager_id: project.manager_id as string,
                  created_at: project.created_at as string
                }))}
                title="Project Analytics"
              />
            </Box>

            {/* Task Analytics */}
            <Box sx={{ width: '100%' }}>
              <TaskAnalyticsChart 
                tasks={tasks.map(task => ({
                  id: task.id as string,
                  title: task.title as string,
                  status: task.status as string,
                  priority: task.priority as string,
                  estimated_hours: task.estimated_hours as number || 0,
                  actual_hours: task.actual_hours as number || 0,
                  due_date: task.due_date as string,
                  assignee_id: task.assignee_id as string,
                  project_id: task.project_id as string
                }))}
                title="Task Analytics"
              />
            </Box>

            {/* Time Analytics */}
            <Box sx={{ width: '100%' }}>
              <TimeAnalyticsChart 
                timeEntries={timeEntries.map(entry => ({
                  id: entry.id as string,
                  hours: entry.hours as number || 0,
                  date: entry.date as string,
                  category: entry.category as string,
                  is_approved: entry.is_approved as boolean || false,
                  user_id: entry.user_id as string,
                  project_id: entry.project_id as string
                }))}
                projects={projects}
                title="Time Tracking Analytics"
              />
            </Box>
          </Box>


        </Box>

        {/* Create Project Dialog */}
        <Dialog
          open={createProjectOpen}
          onClose={handleCloseCreateProject}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: 8
            }
          }}
        >
          <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#172b4d' }}>
              Create New Project
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                fullWidth
                label="Project Name *"
                value={projectForm.name}
                onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                error={!!formErrors.name}
                helperText={formErrors.name}
                placeholder="Enter project name"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                placeholder="Enter project description"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' }, 
                gap: 2 
              }}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={projectForm.status}
                    onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                    label="Status"
                  >
                    <MenuItem value="Draft">Draft</MenuItem>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="On Hold">On Hold</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
                
                <TextField
                  fullWidth
                  label="Budget"
                  type="number"
                  value={projectForm.budget}
                  onChange={(e) => setProjectForm({ ...projectForm, budget: e.target.value })}
                  placeholder="Enter budget amount"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>$</Typography>,
                  }}
                />
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' }, 
                gap: 2 
              }}>
                <DatePicker
                  label="Start Date *"
                  value={projectForm.start_date}
                  onChange={(date) => setProjectForm({ ...projectForm, start_date: date })}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!formErrors.start_date,
                      helperText: formErrors.start_date,
                      InputLabelProps: {
                        shrink: true,
                      },
                    },
                  }}
                />
                
                <DatePicker
                  label="End Date"
                  value={projectForm.end_date}
                  onChange={(date) => setProjectForm({ ...projectForm, end_date: date })}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!formErrors.end_date,
                      helperText: formErrors.end_date,
                      InputLabelProps: {
                        shrink: true,
                      },
                    },
                  }}
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button 
              onClick={handleCloseCreateProject} 
              color="inherit"
              sx={{ 
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateProject} 
              variant="contained" 
              disabled={createProjectLoading}
              startIcon={createProjectLoading ? <CircularProgress size={20} /> : null}
              sx={{ 
                textTransform: 'none',
                '&:hover': {
                  boxShadow: 4
                }
              }}
            >
              {createProjectLoading ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

// Task Management Page Component
const TaskManagementPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const [project, setProject] = useState<Record<string, unknown> | null>(null);
  const [tasks, setTasks] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Task creation state
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [createTaskLoading, setCreateTaskLoading] = useState(false);
  const [createTaskError, setCreateTaskError] = useState('');
  const [createTaskSuccess, setCreateTaskSuccess] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Task edit state
  const [editTaskOpen, setEditTaskOpen] = useState(false);
  const [editTaskLoading, setEditTaskLoading] = useState(false);
  const [editTaskError, setEditTaskError] = useState('');
  const [editTaskSuccess, setEditTaskSuccess] = useState('');
  const [editFormErrors, setEditFormErrors] = useState<Record<string, string>>({});
  const [editingTask, setEditingTask] = useState<Record<string, unknown> | null>(null);
  
  // Task delete state
  const [deleteTaskOpen, setDeleteTaskOpen] = useState(false);
  const [deleteTaskLoading, setDeleteTaskLoading] = useState(false);
  const [deleteTaskError, setDeleteTaskError] = useState('');
  const [deleteTaskSuccess, setDeleteTaskSuccess] = useState('');
  const [deletingTask, setDeletingTask] = useState<Record<string, unknown> | null>(null);
  
  // Project status update state
  const [updateStatusOpen, setUpdateStatusOpen] = useState(false);
  const [updateStatusLoading, setUpdateStatusLoading] = useState(false);
  const [updateStatusError, setUpdateStatusError] = useState('');
  const [updateStatusSuccess, setUpdateStatusSuccess] = useState('');
  const [newStatus, setNewStatus] = useState('');
  
  // Task form state
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assignee_id: '',
    priority: 'Medium',
    estimated_hours: '',
    due_date: null as any,
  });

  // Edit task form state
  const [editTaskForm, setEditTaskForm] = useState({
    title: '',
    description: '',
    assignee_id: '',
    priority: 'Medium',
    estimated_hours: '',
    due_date: null as any,
  });

  // Filter state
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Users state for assignee dropdown
  const [users, setUsers] = useState<Record<string, unknown>[]>([
    // Default mock users to ensure the field always shows
    { id: 'mock-dev-1', first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@example.com', role: 'Developer' },
    { id: 'mock-dev-2', first_name: 'Mike', last_name: 'Wilson', email: 'mike.wilson@example.com', role: 'Developer' },
    { id: 'mock-dev-3', first_name: 'Alex', last_name: 'Johnson', email: 'alex.johnson@example.com', role: 'Developer' },
    { id: 'mock-dev-4', first_name: 'Sarah', last_name: 'Davis', email: 'sarah.davis@example.com', role: 'Developer' }
  ]);
  const [usersLoading, setUsersLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }

    const fetchProjectAndTasks = async () => {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // Fetch project details
        const projectResponse = await apiCall(`https://projexiq.onrender.com/projects/${projectId}`);
        if (projectResponse && projectResponse.ok) {
          const projectResult = await projectResponse.json();
          setProject(projectResult.data);
        } else {
          setError('Failed to fetch project details');
          setIsLoading(false);
          return;
        }

        // Fetch project tasks
        const tasksResponse = await apiCall(`https://projexiq.onrender.com/projects/${projectId}/tasks`);
        if (tasksResponse && tasksResponse.ok) {
          const tasksResult = await tasksResponse.json();
          setTasks(tasksResult.data || []);
        } else {
          console.error('Failed to fetch tasks:', tasksResponse?.status);
        }

        // Fetch users with developer roles for assignee dropdown
        const fetchUsers = async () => {
          setUsersLoading(true);
          try {
            console.log('Fetching assignable users...');
            const usersResponse = await apiCall(`https://projexiq.onrender.com/users/assignable`);
            console.log('Users response status:', usersResponse?.status);
            
            if (usersResponse && usersResponse.ok) {
              const usersResult = await usersResponse.json();
              console.log('Users result:', usersResult);
              console.log('Users data:', usersResult.data);
              console.log('Users array length:', usersResult.data?.length);
              setUsers(usersResult.data || []);
            } else {
              console.error('Failed to fetch users:', usersResponse?.status);
              const errorText = await usersResponse?.text();
              console.error('Error response:', errorText);
              
              // Fallback: Create mock developers if API fails
              const mockDevelopers = [
                { id: 'mock-dev-1', first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@example.com', role: 'Developer' },
                { id: 'mock-dev-2', first_name: 'Mike', last_name: 'Wilson', email: 'mike.wilson@example.com', role: 'Developer' },
                { id: 'mock-dev-3', first_name: 'Alex', last_name: 'Johnson', email: 'alex.johnson@example.com', role: 'Developer' },
                { id: 'mock-dev-4', first_name: 'Sarah', last_name: 'Davis', email: 'sarah.davis@example.com', role: 'Developer' }
              ];
              console.log('Using mock developers:', mockDevelopers);
              setUsers(mockDevelopers);
            }
          } catch (error) {
            console.error('Error fetching users:', error);
            
            // Fallback: Create mock developers if API fails
            const mockDevelopers = [
              { id: 'mock-dev-1', first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@example.com', role: 'Developer' },
              { id: 'mock-dev-2', first_name: 'Mike', last_name: 'Wilson', email: 'mike.wilson@example.com', role: 'Developer' },
              { id: 'mock-dev-3', first_name: 'Alex', last_name: 'Johnson', email: 'alex.johnson@example.com', role: 'Developer' },
              { id: 'mock-dev-4', first_name: 'Sarah', last_name: 'Davis', email: 'sarah.davis@example.com', role: 'Developer' }
            ];
            console.log('Using mock developers due to error:', mockDevelopers);
            setUsers(mockDevelopers);
          } finally {
            setUsersLoading(false);
          }
        };

        fetchUsers();

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching project and tasks:', error);
        setError('Failed to load project data');
        setIsLoading(false);
      }
    };

    fetchProjectAndTasks();
  }, [projectId, navigate]);

  const handleCreateTask = async () => {
    setCreateTaskError('');
    setCreateTaskSuccess('');
    setFormErrors({});

    const errors: Record<string, string> = {};
    if (!taskForm.title.trim()) {
      errors.title = 'Task title is required';
    }
    if (taskForm.estimated_hours && parseFloat(taskForm.estimated_hours) < 0) {
      errors.estimated_hours = 'Estimated hours must be positive';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setCreateTaskLoading(true);

    try {
      const taskData: any = {
        title: taskForm.title.trim(),
        description: taskForm.description.trim() || null,
        priority: taskForm.priority,
        estimated_hours: taskForm.estimated_hours && taskForm.estimated_hours.trim() ? parseFloat(taskForm.estimated_hours) : null,
        due_date: taskForm.due_date ? taskForm.due_date.format('YYYY-MM-DD') : null,
      };

      // Only include assignee_id if it's a valid UUID
      if (taskForm.assignee_id && taskForm.assignee_id.trim() && taskForm.assignee_id.trim().length === 36) {
        taskData.assignee_id = taskForm.assignee_id.trim();
      }

      console.log('Sending task data:', taskData);

      const response = await apiCall(`https://projexiq.onrender.com/projects/${projectId}/tasks`, {
        method: 'POST',
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error response:', errorData);
        
        if (response.status === 422) {
          // Handle validation errors
          if (errorData.detail && Array.isArray(errorData.detail)) {
            const validationErrors = errorData.detail.map((err: any) => 
              `${err.loc?.join('.') || 'field'}: ${err.msg}`
            ).join(', ');
            throw new Error(`Validation errors: ${validationErrors}`);
          } else if (errorData.detail) {
            throw new Error(errorData.detail);
          } else {
            throw new Error('Invalid data provided');
          }
        } else {
          throw new Error(errorData.detail || errorData.message || 'Failed to create task');
        }
      }

      const result = await response.json();
      
      if (result.success) {
        setCreateTaskSuccess('Task created successfully!');
        setTaskForm({
          title: '',
          description: '',
          assignee_id: '',
          priority: 'Medium',
          estimated_hours: '',
          due_date: null as any,
        });
        
        // Refresh tasks list
        const tasksResponse = await apiCall(`https://projexiq.onrender.com/projects/${projectId}/tasks`);
        if (tasksResponse && tasksResponse.ok) {
          const tasksResult = await tasksResponse.json();
          setTasks(tasksResult.data || []);
        }
        
        setTimeout(() => {
          setCreateTaskOpen(false);
          setCreateTaskSuccess('');
        }, 1500);
      } else {
        throw new Error(result.message || 'Failed to create task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      let errorMessage = 'Failed to create task';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object') {
        errorMessage = JSON.stringify(error);
      }
      
      setCreateTaskError(errorMessage);
    } finally {
      setCreateTaskLoading(false);
    }
  };

  const handleCloseCreateTask = () => {
    setCreateTaskOpen(false);
    setCreateTaskError('');
    setCreateTaskSuccess('');
    setFormErrors({});
    setTaskForm({
      title: '',
      description: '',
      assignee_id: '',
      priority: 'Medium',
      estimated_hours: '',
      due_date: null as any,
    });
  };

  const handleOpenCreateTask = () => {
    setCreateTaskOpen(true);
  };

  const handleEditTask = (task: Record<string, unknown>) => {
    setEditingTask(task);
    setEditTaskForm({
      title: task.title as string || '',
      description: task.description as string || '',
      assignee_id: task.assignee_id as string || '',
      priority: task.priority as string || 'Medium',
      estimated_hours: task.estimated_hours ? task.estimated_hours.toString() : '',
      due_date: task.due_date ? dayjs(task.due_date as string) : null,
    });
    setEditTaskOpen(true);
  };

  const handleUpdateTask = async () => {
    if (!editingTask) return;

    setEditTaskError('');
    setEditTaskSuccess('');
    setEditFormErrors({});

    const errors: Record<string, string> = {};
    if (!editTaskForm.title.trim()) {
      errors.title = 'Task title is required';
    }
    if (editTaskForm.estimated_hours && parseFloat(editTaskForm.estimated_hours) < 0) {
      errors.estimated_hours = 'Estimated hours must be positive';
    }

    if (Object.keys(errors).length > 0) {
      setEditFormErrors(errors);
      return;
    }

    setEditTaskLoading(true);

    try {
      const updateData: any = {
        title: editTaskForm.title.trim(),
        description: editTaskForm.description.trim() || null,
        priority: editTaskForm.priority,
        estimated_hours: editTaskForm.estimated_hours && editTaskForm.estimated_hours.trim() ? parseFloat(editTaskForm.estimated_hours) : null,
        due_date: editTaskForm.due_date ? editTaskForm.due_date.format('YYYY-MM-DD') : null,
      };

      // Only include assignee_id if it's a valid UUID
      if (editTaskForm.assignee_id && editTaskForm.assignee_id.trim() && editTaskForm.assignee_id.trim().length === 36) {
        updateData.assignee_id = editTaskForm.assignee_id.trim();
      }

      const response = await apiCall(`https://projexiq.onrender.com/projects/tasks/${editingTask.id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error response:', errorData);
        
        if (response.status === 422) {
          // Handle validation errors
          if (errorData.detail && Array.isArray(errorData.detail)) {
            const validationErrors = errorData.detail.map((err: any) => 
              `${err.loc?.join('.') || 'field'}: ${err.msg}`
            ).join(', ');
            throw new Error(`Validation errors: ${validationErrors}`);
          } else if (errorData.detail) {
            throw new Error(errorData.detail);
          } else {
            throw new Error('Invalid data provided');
          }
        } else {
          throw new Error(errorData.detail || errorData.message || 'Failed to update task');
        }
      }

      const result = await response.json();
      
      if (result.success) {
        setEditTaskSuccess('Task updated successfully!');
        
        // Refresh tasks list
        const tasksResponse = await apiCall(`https://projexiq.onrender.com/projects/${projectId}/tasks`);
        if (tasksResponse && tasksResponse.ok) {
          const tasksResult = await tasksResponse.json();
          setTasks(tasksResult.data || []);
        }
        
        setTimeout(() => {
          setEditTaskOpen(false);
          setEditTaskSuccess('');
        }, 1500);
      } else {
        throw new Error(result.message || 'Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      let errorMessage = 'Failed to update task';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object') {
        errorMessage = JSON.stringify(error);
      }
      
      setEditTaskError(errorMessage);
    } finally {
      setEditTaskLoading(false);
    }
  };

  const handleCloseEditTask = () => {
    setEditTaskOpen(false);
    setEditTaskError('');
    setEditTaskSuccess('');
    setEditFormErrors({});
    setEditingTask(null);
  };

  const handleDeleteTask = (task: Record<string, unknown>) => {
    setDeletingTask(task);
    setDeleteTaskOpen(true);
  };

  const handleConfirmDeleteTask = async () => {
    if (!deletingTask) return;

    setDeleteTaskLoading(true);

    try {
      const response = await apiCall(`https://projexiq.onrender.com/projects/tasks/${deletingTask.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete task');
      }

      const result = await response.json();
      
      if (result.success) {
        setDeleteTaskSuccess('Task deleted successfully!');
        
        // Refresh tasks list
        const tasksResponse = await apiCall(`https://projexiq.onrender.com/projects/${projectId}/tasks`);
        if (tasksResponse && tasksResponse.ok) {
          const tasksResult = await tasksResponse.json();
          setTasks(tasksResult.data || []);
        }
        
        setTimeout(() => {
          setDeleteTaskOpen(false);
          setDeleteTaskSuccess('');
        }, 1500);
      } else {
        throw new Error(result.message || 'Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      setDeleteTaskError(error instanceof Error ? error.message : 'Failed to delete task');
    } finally {
      setDeleteTaskLoading(false);
    }
  };

  const handleCloseDeleteTask = () => {
    setDeleteTaskOpen(false);
    setDeleteTaskError('');
    setDeleteTaskSuccess('');
    setDeletingTask(null);
  };

  const handleOpenUpdateStatus = () => {
    setUpdateStatusOpen(true);
  };

  const handleCloseUpdateStatus = () => {
    setUpdateStatusOpen(false);
    setUpdateStatusError('');
    setUpdateStatusSuccess('');
    setNewStatus('');
  };

  const handleUpdateProjectStatus = async () => {
    if (!project) return;

    setUpdateStatusLoading(true);

    try {
      const response = await apiCall(`https://projexiq.onrender.com/projects/${project.id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update project status');
      }

      const result = await response.json();
      
      if (result.success) {
        setUpdateStatusSuccess('Project status updated successfully!');
        setProject({ ...project, status: newStatus });
        
        setTimeout(() => {
          setUpdateStatusOpen(false);
          setUpdateStatusSuccess('');
        }, 1500);
      } else {
        throw new Error(result.message || 'Failed to update project status');
      }
    } catch (error) {
      console.error('Error updating project status:', error);
      setUpdateStatusError(error instanceof Error ? error.message : 'Failed to update project status');
    } finally {
      setUpdateStatusLoading(false);
    }
  };

  const getProjectStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return '#4caf50';
      case 'completed':
        return '#2196f3';
      case 'on hold':
      case 'onhold':
        return '#ff9800';
      case 'cancelled':
        return '#f44336';
      default:
        return '#9e9e9e';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return '#f44336';
      case 'medium':
        return '#ff9800';
      case 'low':
        return '#4caf50';
      default:
        return '#9e9e9e';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'done':
        return '#4caf50';
      case 'in progress':
      case 'inprogress':
        return '#2196f3';
      case 'review':
        return '#ff9800';
      case 'todo':
        return '#9e9e9e';
      default:
        return '#9e9e9e';
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex' }}>
        <Header user={user} />
        <Sidebar projects={[]} onCreateProject={() => {}} hideProjects={true} />
        <Box sx={{ 
          flexGrow: 1, 
          p: 3, 
          mt: 8, 
          ml: 7,
          backgroundColor: '#f8f9fa',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#6b778c' }}>
              Loading project...
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex' }}>
        <Header user={user} />
        <Sidebar projects={[]} onCreateProject={() => {}} hideProjects={true} />
        <Box sx={{ 
          flexGrow: 1, 
          p: 3, 
          mt: 8, 
          ml: 7,
          backgroundColor: '#f8f9fa',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: '#f44336', mb: 2 }}>
              {error}
            </Typography>
            <Button variant="contained" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = statusFilter === 'all' || (task.status as string) === statusFilter;
    const matchesPriority = priorityFilter === 'all' || (task.priority as string) === priorityFilter;
    const matchesSearch = searchQuery === '' || 
      (task.title as string).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description as string)?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesPriority && matchesSearch;
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <Header user={user} />
        <Sidebar projects={[]} onCreateProject={() => {}} hideProjects={true} />
        
        {/* Main Content */}
        <Box sx={{ 
          flexGrow: 1, 
          display: 'flex',
          flexDirection: 'column',
          ml: { xs: '20px', sm: '20px' }, // Reduced sidebar width for dashboard
          mt: '64px',
          p: 3, // Increased padding for more space
          backgroundColor: '#f8f9fa',
          minHeight: 'calc(100vh - 64px)',
          transition: 'margin-left 0.3s ease-in-out',
        }}>
          {/* Project Header */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 600, color: '#172b4d', mb: 1 }}>
                  {project?.name}
                </Typography>
                <Typography variant="body1" sx={{ color: '#6b778c', mb: 2 }}>
                  {project?.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip 
                    label={project?.status || 'Unknown'} 
                    sx={{ 
                      backgroundColor: getProjectStatusColor(project?.status as string),
                      color: 'white'
                    }} 
                  />
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={handleOpenUpdateStatus}
                  >
                    Update Status
                  </Button>
                </Box>
              </Box>
              <Fab
                color="primary"
                aria-label="Create Task"
                onClick={handleOpenCreateTask}
                sx={{
                  position: 'fixed',
                  bottom: 24,
                  right: 24,
                  zIndex: 1000,
                  boxShadow: 4,
                  '&:hover': {
                    boxShadow: 8,
                    transform: 'scale(1.1)',
                    transition: 'all 0.2s ease-in-out'
                  }
                }}
              >
                <AddIcon />
              </Fab>
            </Box>
          </Box>

          {/* Stats Cards */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            flexWrap: 'wrap',
            gap: 3, 
            mb: 4 
          }}>
            <Box sx={{ flex: { xs: '1', sm: '1', md: '1' }, minWidth: { sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
              <Card sx={{ 
                height: 120, 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                  transition: 'all 0.3s ease-in-out'
                }
              }}>
                <CardContent>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'white' }}>
                    {tasks.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
                    TOTAL TASKS
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            <Box sx={{ flex: { xs: '1', sm: '1', md: '1' }, minWidth: { sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
              <Card sx={{ 
                height: 120, 
                background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                color: 'white',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                  transition: 'all 0.3s ease-in-out'
                }
              }}>
                <CardContent>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'white' }}>
                    {tasks.filter(t => (t.status as string) === 'Done').length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
                    COMPLETED
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            <Box sx={{ flex: { xs: '1', sm: '1', md: '1' }, minWidth: { sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
              <Card sx={{ 
                height: 120, 
                background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                color: 'white',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                  transition: 'all 0.3s ease-in-out'
                }
              }}>
                <CardContent>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'white' }}>
                    {tasks.filter(t => (t.status as string) === 'InProgress').length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
                    IN PROGRESS
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            <Box sx={{ flex: { xs: '1', sm: '1', md: '1' }, minWidth: { sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
              <Card sx={{ 
                height: 120, 
                background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                color: 'white',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                  transition: 'all 0.3s ease-in-out'
                }
              }}>
                <CardContent>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'white' }}>
                    {tasks.filter(t => (t.status as string) === 'ToDo').length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
                    TO DO
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>

          {/* Filters */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              gap: 2, 
              alignItems: { xs: 'stretch', sm: 'center' } 
            }}>
              <Box sx={{ flex: { xs: '1', sm: '2' } }}>
                <TextField
                  fullWidth
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  size="small"
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                  }}
                />
              </Box>
              <Box sx={{ flex: { xs: '1', sm: '1' } }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="ToDo">To Do</MenuItem>
                    <MenuItem value="InProgress">In Progress</MenuItem>
                    <MenuItem value="Review">Review</MenuItem>
                    <MenuItem value="Done">Done</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ flex: { xs: '1', sm: '1' } }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={priorityFilter}
                    label="Priority"
                    onChange={(e) => setPriorityFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Priority</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Box>

          {/* Tasks List */}
          <Card sx={{ flexGrow: 1, overflow: 'hidden', boxShadow: 2 }}>
            <CardContent sx={{ height: 'calc(100vh - 400px)', overflow: 'hidden', p: 0 }}>
              <Box sx={{ height: '100%', overflowY: 'auto', overflowX: 'hidden', p: 2 }}>
                {filteredTasks.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" sx={{ color: '#6b778c', mb: 2 }}>
                      No tasks found
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#9e9e9e', fontStyle: 'italic' }}>
                      Tap + to create tasks for this project
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                    gap: 2 
                  }}>
                    {filteredTasks.map((task) => (
                      <Card 
                        key={task.id as string}
                        sx={{ 
                          p: 3, 
                          border: '1px solid',
                          borderColor: 'divider',
                          height: 'fit-content',
                          '&:hover': { 
                            boxShadow: 4,
                            transform: 'translateY(-2px)',
                            transition: 'all 0.2s ease-in-out',
                            borderColor: 'primary.main'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#172b4d' }}>
                              {task.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#6b778c', mb: 2, lineHeight: 1.6 }}>
                              {task.description}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                              <Chip 
                                label={task.status as string} 
                                size="small"
                                sx={{ 
                                  backgroundColor: getStatusColor(task.status as string),
                                  color: 'white',
                                  fontWeight: 500,
                                  '&:hover': {
                                    backgroundColor: getStatusColor(task.status as string),
                                    opacity: 0.8
                                  }
                                }} 
                              />
                              <Chip 
                                label={task.priority as string} 
                                size="small"
                                sx={{ 
                                  backgroundColor: getPriorityColor(task.priority as string),
                                  color: 'white',
                                  fontWeight: 500,
                                  '&:hover': {
                                    backgroundColor: getPriorityColor(task.priority as string),
                                    opacity: 0.8
                                  }
                                }} 
                              />
                              {task.estimated_hours && (
                                <Chip 
                                  label={`${task.estimated_hours}h`} 
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontWeight: 500 }}
                                />
                              )}
                              {task.due_date && (
                                <Chip 
                                  label={dayjs(task.due_date as string).format('MMM DD')} 
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontWeight: 500 }}
                                />
                              )}
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                            <IconButton 
                              size="small" 
                              onClick={() => handleEditTask(task)}
                              sx={{ 
                                color: '#2196f3',
                                '&:hover': { 
                                  backgroundColor: 'rgba(33, 150, 243, 0.1)',
                                  transform: 'scale(1.1)'
                                },
                                transition: 'all 0.2s ease-in-out'
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={() => handleDeleteTask(task)}
                              sx={{ 
                                color: '#f44336',
                                '&:hover': { 
                                  backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                  transform: 'scale(1.1)'
                                },
                                transition: 'all 0.2s ease-in-out'
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </Card>
                    ))}
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Create Task Dialog */}
          <Dialog 
            open={createTaskOpen} 
            onClose={handleCloseCreateTask}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 2,
                boxShadow: 8
              }
            }}
          >
            <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#172b4d' }}>
                Create New Task
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  fullWidth
                  label="Task Title *"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  error={!!formErrors.title}
                  helperText={formErrors.title}
                  placeholder="Enter task title"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Description"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  multiline
                  rows={3}
                  placeholder="Enter task description"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' }, 
                  gap: 2 
                }}>
                  <FormControl fullWidth>
                    <InputLabel>Assignee</InputLabel>
                    <Select
                      value={taskForm.assignee_id}
                      label="Assignee"
                      onChange={(e) => setTaskForm({ ...taskForm, assignee_id: e.target.value })}
                      disabled={usersLoading}
                    >
                      <MenuItem value="">
                        <em>Select an assignee</em>
                      </MenuItem>
                      {(() => {
                        console.log('Current users state:', users);
                        console.log('Users length:', users?.length);
                        return users && users.length > 0 ? (
                          users.map((user) => (
                            <MenuItem key={user.id as string} value={user.id as string}>
                              {`${user.first_name as string} ${user.last_name as string}`}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem value="" disabled>
                            <em>No users available</em>
                          </MenuItem>
                        );
                      })()}
                    </Select>
                  </FormControl>
                  
                  <FormControl fullWidth>
                    <InputLabel>Priority *</InputLabel>
                    <Select
                      value={taskForm.priority}
                      label="Priority *"
                      onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                    >
                      <MenuItem value="Low">Low</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="High">High</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' }, 
                  gap: 2 
                }}>
                  <TextField
                    fullWidth
                    label="Estimated Hours"
                    value={taskForm.estimated_hours}
                    onChange={(e) => setTaskForm({ ...taskForm, estimated_hours: e.target.value })}
                    type="number"
                    placeholder="Enter estimated hours"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  
                  <DatePicker
                    label="Due Date"
                    value={taskForm.due_date}
                    onChange={(newValue) => setTaskForm({ ...taskForm, due_date: newValue })}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        InputLabelProps: {
                          shrink: true,
                        },
                      },
                    }}
                  />
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={handleCloseCreateTask} color="inherit">
                Cancel
              </Button>
              <Button 
                onClick={handleCreateTask} 
                variant="contained" 
                disabled={createTaskLoading}
                startIcon={createTaskLoading ? <CircularProgress size={20} /> : null}
              >
                {createTaskLoading ? 'Creating...' : 'Create Task'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Edit Task Dialog */}
          <Dialog 
            open={editTaskOpen} 
            onClose={handleCloseEditTask}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#172b4d' }}>
                Edit Task
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ pt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Task Title *"
                      value={editTaskForm.title}
                      onChange={(e) => setEditTaskForm({ ...editTaskForm, title: e.target.value })}
                      error={!!editFormErrors.title}
                      helperText={editFormErrors.title}
                      placeholder="Enter task title"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ mt: 1 }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      value={editTaskForm.description}
                      onChange={(e) => setEditTaskForm({ ...editTaskForm, description: e.target.value })}
                      multiline
                      rows={3}
                      placeholder="Enter task description"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ mt: 1 }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={8}>
                    <FormControl fullWidth sx={{ mt: 1 }}>
                      <InputLabel>Assignee</InputLabel>
                      <Select
                        value={editTaskForm.assignee_id}
                        label="Assignee"
                        onChange={(e) => setEditTaskForm({ ...editTaskForm, assignee_id: e.target.value })}
                        disabled={usersLoading}
                      >
                        <MenuItem value="">
                          <em>Select an assignee</em>
                        </MenuItem>
                        {users.map((user) => (
                          <MenuItem key={user.id as string} value={user.id as string}>
                            {`${user.first_name as string} ${user.last_name as string}`}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth sx={{ mt: 1 }}>
                      <InputLabel>Priority *</InputLabel>
                      <Select
                        value={editTaskForm.priority}
                        label="Priority *"
                        onChange={(e) => setEditTaskForm({ ...editTaskForm, priority: e.target.value })}
                      >
                        <MenuItem value="Low">Low</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="High">High</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Estimated Hours"
                      value={editTaskForm.estimated_hours}
                      onChange={(e) => setEditTaskForm({ ...editTaskForm, estimated_hours: e.target.value })}
                      type="number"
                      placeholder="Enter estimated hours"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ mt: 1 }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <DatePicker
                      label="Due Date"
                      value={editTaskForm.due_date}
                      onChange={(date) => setEditTaskForm({ ...editTaskForm, due_date: date })}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!editFormErrors.due_date,
                          helperText: editFormErrors.due_date,
                          InputLabelProps: {
                            shrink: true,
                          },
                          sx: { mt: 1 }
                        }
                      }}
                    />
                  </Grid>
                </Grid>

                {editTaskError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {editTaskError}
                  </Alert>
                )}
                {editTaskSuccess && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    {editTaskSuccess}
                  </Alert>
                )}
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={handleCloseEditTask} color="inherit">
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateTask} 
                variant="contained" 
                disabled={editTaskLoading}
                startIcon={editTaskLoading ? <CircularProgress size={20} /> : null}
              >
                {editTaskLoading ? 'Updating...' : 'Update Task'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Delete Task Confirmation Modal */}
          <Dialog 
            open={deleteTaskOpen} 
            onClose={handleCloseDeleteTask}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle sx={{ pb: 1 }}>
              <Box sx={{ fontWeight: 600, fontSize: '1.25rem', lineHeight: 1.2, mb: 0.5 }}>
                Delete Task Confirmation
              </Box>
              <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
                Are you sure you want to delete this task?
              </Typography>
            </DialogTitle>
            
            <DialogContent sx={{ pt: 2 }}>
              {deleteTaskError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {deleteTaskError}
                </Alert>
              )}
              
              {deleteTaskSuccess && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {deleteTaskSuccess}
                </Alert>
              )}

              {deletingTask && (
                <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                    Task: {deletingTask.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    This action cannot be undone.
                  </Typography>
                </Box>
              )}
            </DialogContent>
            
            <DialogActions sx={{ p: 3, pt: 1 }}>
              <Button
                onClick={handleCloseDeleteTask}
                disabled={deleteTaskLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDeleteTask}
                variant="contained"
                color="error"
                disabled={deleteTaskLoading}
                startIcon={deleteTaskLoading ? <CircularProgress size={16} /> : <DeleteIcon />}
              >
                {deleteTaskLoading ? 'Deleting...' : 'Delete Task'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Update Project Status Modal */}
          <Dialog
            open={updateStatusOpen}
            onClose={handleCloseUpdateStatus}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle sx={{ pb: 1 }}>
              <Box sx={{ fontWeight: 600, fontSize: '1.25rem', lineHeight: 1.2, mb: 0.5 }}>
                Update Project Status
              </Box>
              <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
                Change the current status of "{project?.name}" project
              </Typography>
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
              {updateStatusError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {updateStatusError}
                </Alert>
              )}

              <Typography variant="body1" sx={{ mb: 2 }}>
                Current Status:
                <Chip
                  label={project?.status || 'Unknown'}
                  sx={{ 
                    ml: 1,
                    backgroundColor: getProjectStatusColor(project?.status as string),
                    color: 'white'
                  }}
                />
              </Typography>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>New Status</InputLabel>
                <Select
                  value={newStatus}
                  label="New Status"
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <MenuItem value="Draft">Draft</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="OnHold">On Hold</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{
                backgroundColor: '#f5f5f5',
                p: 2,
                borderRadius: 1,
                border: '1px solid #e0e0e0'
              }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Status Descriptions:</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  • <strong>Draft:</strong> Project is in planning phase
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • <strong>Active:</strong> Project is currently being worked on
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • <strong>On Hold:</strong> Project is temporarily paused
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • <strong>Completed:</strong> Project has been finished successfully
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • <strong>Cancelled:</strong> Project has been terminated
                </Typography>
              </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 1 }}>
              <Button
                onClick={handleCloseUpdateStatus}
                disabled={updateStatusLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateProjectStatus}
                variant="contained"
                disabled={updateStatusLoading || !newStatus.trim()}
                startIcon={updateStatusLoading ? <CircularProgress size={16} /> : <EditIcon />}
              >
                {updateStatusLoading ? 'Updating...' : 'Update Status'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Success Snackbar */}
          <Snackbar
            open={!!deleteTaskSuccess || !!updateStatusSuccess}
            autoHideDuration={3000}
            onClose={() => {
              setDeleteTaskSuccess('');
              setUpdateStatusSuccess('');
            }}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert
              onClose={() => {
                setDeleteTaskSuccess('');
                setUpdateStatusSuccess('');
              }}
              severity="success"
              sx={{ width: '100%' }}
            >
              {deleteTaskSuccess || updateStatusSuccess}
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

// Main App Component
function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/tasks/:projectId" element={<TaskManagementPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;