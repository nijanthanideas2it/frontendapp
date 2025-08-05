import React from 'react';
import {
  Box,
  Typography,
  Button,
} from '@mui/material';

export const ProjectTemplate: React.FC = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Project Template
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Choose a template to get started quickly
      </Typography>

      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Project template selection will be implemented in the next iteration
        </Typography>
        <Button variant="outlined" disabled>
          Select Template
        </Button>
      </Box>
    </Box>
  );
};

export default ProjectTemplate; 