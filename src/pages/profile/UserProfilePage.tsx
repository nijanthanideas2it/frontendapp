import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Breadcrumbs,
  Link,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGetCurrentUserQuery } from '../../store/api/authApi';
import { ProfileForm } from '../../components/profile/ProfileForm';
import { SkillsManager } from '../../components/profile/SkillsManager';
import { NotificationSettings } from '../../components/profile/NotificationSettings';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export const UserProfilePage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();

  const { data: user, isLoading, error, refetch } = useGetCurrentUserQuery();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleProfileSuccess = () => {
    refetch();
  };

  const handleSkillsSuccess = () => {
    refetch();
  };

  const handleNotificationSuccess = () => {
    // TODO: Implement notification preferences update
    console.log('Notification preferences updated');
  };

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load user profile. Please try again.
        </Alert>
      </Container>
    );
  }

  if (isLoading || !user) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            Loading profile...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('/dashboard');
          }}
          sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        >
          Dashboard
        </Link>
        <Typography color="text.primary">Profile</Typography>
      </Breadcrumbs>

      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          User Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your profile information, skills, and notification preferences.
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs">
          <Tab label="Profile Information" />
          <Tab label="Skills" />
          <Tab label="Notifications" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <ProfileForm
              user={user}
              onSuccess={handleProfileSuccess}
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Box sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Profile Summary
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>Role:</strong> {user.role}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>Status:</strong> {user.is_active ? 'Active' : 'Inactive'}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>Member Since:</strong> {new Date(user.created_at).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>Skills:</strong> {user.skills.length} skills added
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <SkillsManager
              skills={user.skills}
              onSuccess={handleSkillsSuccess}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Box sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Skills Overview
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>Total Skills:</strong> {user.skills.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>Expert Level:</strong> {user.skills.filter(s => s.proficiency_level === 'Expert').length}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>Advanced Level:</strong> {user.skills.filter(s => s.proficiency_level === 'Advanced').length}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>Intermediate Level:</strong> {user.skills.filter(s => s.proficiency_level === 'Intermediate').length}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>Beginner Level:</strong> {user.skills.filter(s => s.proficiency_level === 'Beginner').length}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <NotificationSettings
              onSavePreferences={handleNotificationSuccess}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Box sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Notification Tips
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Email notifications are sent to your registered email address
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Push notifications appear in your browser when the app is open
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • In-app notifications appear in the notification center
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • You can change these settings at any time
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </TabPanel>
    </Container>
  );
};

export default UserProfilePage; 