import React from 'react';
import {
  Box,
  Typography,
  Button,
} from '@mui/material';

export const ProjectTeamMembers: React.FC = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Team Members
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Add team members to your project
      </Typography>

      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Team member selection will be implemented in the next iteration
        </Typography>
        <Button variant="outlined" disabled>
          Add Team Member
        </Button>
      </Box>
    </Box>
  );
};

export default ProjectTeamMembers; 