import React from 'react';
import {
  Box,
  Avatar,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  useTheme,
} from '@mui/material';
import { useGetProjectTeamQuery } from '../../store/api/projectApi';

interface TeamMembersListProps {
  projectId: number;
}

interface TeamMember {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  status: 'active' | 'inactive';
  joinedDate: string;
}

const getRoleColor = (role: string) => {
  switch (role.toLowerCase()) {
    case 'manager':
      return 'primary';
    case 'developer':
      return 'success';
    case 'designer':
      return 'warning';
    case 'tester':
      return 'info';
    case 'analyst':
      return 'secondary';
    default:
      return 'default';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'success';
    case 'inactive':
      return 'error';
    default:
      return 'default';
  }
};

export const TeamMembersList: React.FC<TeamMembersListProps> = ({ projectId }) => {
  const theme = useTheme();
  const { data: teamMembers, isLoading, error } = useGetProjectTeamQuery(projectId);

  if (isLoading) {
    return (
      <Box sx={{ py: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Loading team members...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 2 }}>
        <Typography variant="body2" color="error">
          Failed to load team members.
        </Typography>
      </Box>
    );
  }

  const members = teamMembers || [];

  if (members.length === 0) {
    return (
      <Box sx={{ py: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          No team members assigned to this project.
        </Typography>
        <Button variant="outlined" size="small" sx={{ mt: 1 }}>
          Add Team Member
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {members.length} team member{members.length !== 1 ? 's' : ''}
        </Typography>
        <Button variant="outlined" size="small">
          Add Member
        </Button>
      </Box>

      <List sx={{ p: 0 }}>
        {members.map((member: TeamMember) => (
          <ListItem
            key={member.id}
            sx={{
              p: 2,
              mb: 1,
              borderRadius: 1,
              border: `1px solid ${theme.palette.divider}`,
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <ListItemAvatar>
              <Avatar
                src={member.avatar}
                sx={{ width: 48, height: 48 }}
              >
                {member.name.charAt(0)}
              </Avatar>
            </ListItemAvatar>

            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography variant="subtitle1" fontWeight={500}>
                    {member.name}
                  </Typography>
                  <Chip
                    label={member.role}
                    color={getRoleColor(member.role) as 'primary' | 'success' | 'warning' | 'info' | 'secondary' | 'default'}
                    size="small"
                  />
                  <Chip
                    label={member.status}
                    color={getStatusColor(member.status) as 'success' | 'error' | 'default'}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              }
              secondary={
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {member.email}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Joined {new Date(member.joinedDate).toLocaleDateString()}
                  </Typography>
                </Box>
              }
            />

            <ListItemSecondaryAction>
              <IconButton edge="end" size="small">
                <Typography variant="caption">•••</Typography>
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TeamMembersList; 