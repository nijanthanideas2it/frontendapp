import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const CreateProjectButton: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/projects/create');
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleClick}
      sx={{
        borderRadius: 2,
        textTransform: 'none',
        fontWeight: 600,
        px: 3,
        py: 1,
      }}
    >
      Create Project
    </Button>
  );
};

export default CreateProjectButton; 