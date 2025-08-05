import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  useTheme,
  Box,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { TimeEntryForm } from './TimeEntryForm';

interface TimeEntryModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const TimeEntryModal: React.FC<TimeEntryModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const theme = useTheme();

  const handleSuccess = () => {
    onSuccess?.();
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '80vh',
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 3, pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Create Time Entry</span>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3, pt: 0 }}>
        <TimeEntryForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TimeEntryModal; 