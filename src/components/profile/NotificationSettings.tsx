import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  FormControlLabel,
  Switch,
  Divider,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Chat as ChatIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

interface NotificationPreference {
  id: string;
  name: string;
  description: string;
  email: boolean;
  push: boolean;
  inApp: boolean;
}

interface NotificationSettingsProps {
  preferences?: NotificationPreference[];
  onSavePreferences?: (preferences: NotificationPreference[]) => Promise<void>;
  isLoading?: boolean;
}

const DEFAULT_PREFERENCES: NotificationPreference[] = [
  {
    id: 'project_updates',
    name: 'Project Updates',
    description: 'Get notified when project status or details change',
    email: true,
    push: true,
    inApp: true,
  },
  {
    id: 'task_assignments',
    name: 'Task Assignments',
    description: 'Receive notifications when tasks are assigned to you',
    email: true,
    push: true,
    inApp: true,
  },
  {
    id: 'task_comments',
    name: 'Task Comments',
    description: 'Get notified when someone comments on your tasks',
    email: false,
    push: true,
    inApp: true,
  },
  {
    id: 'deadline_reminders',
    name: 'Deadline Reminders',
    description: 'Receive reminders for upcoming task deadlines',
    email: true,
    push: true,
    inApp: true,
  },
  {
    id: 'time_approvals',
    name: 'Time Approvals',
    description: 'Get notified when time entries need approval',
    email: true,
    push: false,
    inApp: true,
  },
  {
    id: 'team_mentions',
    name: 'Team Mentions',
    description: 'Receive notifications when mentioned in comments',
    email: false,
    push: true,
    inApp: true,
  },
];

const getNotificationIcon = (id: string) => {
  switch (id) {
    case 'project_updates':
      return <AssignmentIcon />;
    case 'task_assignments':
      return <AssignmentIcon />;
    case 'task_comments':
      return <ChatIcon />;
    case 'deadline_reminders':
      return <ScheduleIcon />;
    case 'time_approvals':
      return <ScheduleIcon />;
    case 'team_mentions':
      return <ChatIcon />;
    default:
      return <NotificationsIcon />;
  }
};

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  preferences = DEFAULT_PREFERENCES,
  onSavePreferences,
  isLoading = false,
}) => {
  const [localPreferences, setLocalPreferences] = useState<NotificationPreference[]>(preferences);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handlePreferenceChange = (id: string, type: 'email' | 'push' | 'inApp', value: boolean) => {
    const updatedPreferences = localPreferences.map(pref =>
      pref.id === id ? { ...pref, [type]: value } : pref
    );
    setLocalPreferences(updatedPreferences);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!onSavePreferences) return;

    setIsSubmitting(true);
    try {
      await onSavePreferences(localPreferences);
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving notification preferences:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setLocalPreferences(preferences);
    setHasChanges(false);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <NotificationsIcon sx={{ mr: 1 }} />
        <Typography variant="h6">Notification Settings</Typography>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Choose how you want to be notified about different activities in your projects.
      </Typography>

      <List>
        {localPreferences.map((preference, index) => (
          <React.Fragment key={preference.id}>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                {getNotificationIcon(preference.id)}
              </ListItemIcon>
              <ListItemText
                primary={preference.name}
                secondary={preference.description}
                sx={{ mr: 2 }}
              />
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preference.email}
                      onChange={(e) => handlePreferenceChange(preference.id, 'email', e.target.checked)}
                      disabled={isLoading || isSubmitting}
                      size="small"
                    />
                  }
                  label="Email"
                  labelPlacement="top"
                  sx={{ minWidth: 60, textAlign: 'center' }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={preference.push}
                      onChange={(e) => handlePreferenceChange(preference.id, 'push', e.target.checked)}
                      disabled={isLoading || isSubmitting}
                      size="small"
                    />
                  }
                  label="Push"
                  labelPlacement="top"
                  sx={{ minWidth: 60, textAlign: 'center' }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={preference.inApp}
                      onChange={(e) => handlePreferenceChange(preference.id, 'inApp', e.target.checked)}
                      disabled={isLoading || isSubmitting}
                      size="small"
                    />
                  }
                  label="In-App"
                  labelPlacement="top"
                  sx={{ minWidth: 60, textAlign: 'center' }}
                />
              </Box>
            </ListItem>
            {index < localPreferences.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>

      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!hasChanges || isLoading || isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
        >
          {isSubmitting ? 'Saving...' : 'Save Preferences'}
        </Button>
        {hasChanges && (
          <Button
            variant="outlined"
            onClick={handleReset}
            disabled={isLoading || isSubmitting}
          >
            Reset
          </Button>
        )}
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" color="text.secondary">
          <strong>Email:</strong> Receive notifications via email
        </Typography>
        <br />
        <Typography variant="caption" color="text.secondary">
          <strong>Push:</strong> Receive browser push notifications
        </Typography>
        <br />
        <Typography variant="caption" color="text.secondary">
          <strong>In-App:</strong> Show notifications within the application
        </Typography>
      </Box>
    </Paper>
  );
}; 