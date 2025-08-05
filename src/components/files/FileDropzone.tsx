import React, { useCallback, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  useTheme,
  Fade,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';

interface FileDropzoneProps {
  onFilesDrop: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
  maxSize?: number; // in bytes
  disabled?: boolean;
  children?: React.ReactNode;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFilesDrop,
  accept,
  maxFiles = 10,
  maxSize = 50 * 1024 * 1024, // 50MB default
  disabled = false,
  children,
}) => {
  const theme = useTheme();
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev - 1);
    if (dragCounter === 1) {
      setIsDragOver(false);
    }
  }, [dragCounter]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setDragCounter(0);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    
    // Validate file count
    if (files.length > maxFiles) {
      console.warn(`Too many files. Maximum allowed: ${maxFiles}`);
      return;
    }

    // Validate file types
    if (accept) {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const validFiles = files.filter(file => {
        return acceptedTypes.some(type => {
          if (type.startsWith('.')) {
            // File extension
            return file.name.toLowerCase().endsWith(type.toLowerCase());
          } else if (type.includes('*')) {
            // MIME type with wildcard
            const pattern = type.replace('*', '.*');
            return new RegExp(pattern).test(file.type);
          } else {
            // Exact MIME type
            return file.type === type;
          }
        });
      });

      if (validFiles.length !== files.length) {
        console.warn('Some files have invalid types');
        return;
      }
    }

    // Validate file sizes
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        console.warn(`File ${file.name} is too large. Maximum size: ${formatFileSize(maxSize)}`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      onFilesDrop(validFiles);
    }
  }, [onFilesDrop, accept, maxFiles, maxSize, disabled]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Paper
      sx={{
        position: 'relative',
        border: `2px dashed ${isDragOver ? theme.palette.primary.main : theme.palette.divider}`,
        borderRadius: 2,
        backgroundColor: isDragOver ? theme.palette.primary.light + '10' : 'transparent',
        transition: 'all 0.2s ease-in-out',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
      }}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {children || (
        <Box
          sx={{
            p: 4,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Fade in={isDragOver} timeout={200}>
            <CloudUploadIcon
              sx={{
                fontSize: 48,
                color: isDragOver ? theme.palette.primary.main : theme.palette.text.secondary,
              }}
            />
          </Fade>
          <Fade in={!isDragOver} timeout={200}>
            <FileIcon
              sx={{
                fontSize: 48,
                color: theme.palette.text.secondary,
              }}
            />
          </Fade>
          <Typography variant="h6" color="text.primary">
            {isDragOver ? 'Drop files here' : 'Drag and drop files here'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            or click to browse
          </Typography>
          {accept && (
            <Typography variant="caption" color="text.secondary">
              Accepted formats: {accept}
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary">
            Max {maxFiles} files, {formatFileSize(maxSize)} each
          </Typography>
        </Box>
      )}
    </Paper>
  );
}; 