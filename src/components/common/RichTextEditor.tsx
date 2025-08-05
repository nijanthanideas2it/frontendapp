import React from 'react';
import {
  Box,
  TextField,
  Typography,
} from '@mui/material';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = 'Enter task description...',
}) => {

  return (
    <Box>
      <TextField
        multiline
        rows={6}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        fullWidth
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
            fontFamily: 'monospace',
            fontSize: '14px',
          },
        }}
      />
      <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Typography variant="caption" color="text.secondary">
          Supports basic text formatting. Rich text editor will be implemented in the next iteration.
        </Typography>
      </Box>
    </Box>
  );
};

export default RichTextEditor; 