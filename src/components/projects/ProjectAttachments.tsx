import React from 'react';
import {
  Box,
  Typography,
  Button,
} from '@mui/material';

export const ProjectAttachments: React.FC = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Project Attachments
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Upload files and documents related to your project
      </Typography>

      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          File upload functionality will be implemented in the next iteration
        </Typography>
        <Button variant="outlined" disabled>
          Upload Files
        </Button>
      </Box>
    </Box>
  );
};

export default ProjectAttachments; 