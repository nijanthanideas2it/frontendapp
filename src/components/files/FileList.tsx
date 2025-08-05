import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  InsertDriveFile as FileIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  Description as DocumentIcon,
  VideoFile as VideoIcon,
  AudioFile as AudioIcon,
  Archive as ArchiveIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { FileDownload } from './FileDownload';

interface FileListProps {
  files: Array<{
    id: string;
    filename: string;
    file_size: number;
    mime_type: string;
    download_url?: string;
    created_at?: string;
  }>;
  onDelete?: (fileId: string) => Promise<void>;
  onView?: (fileId: string) => Promise<void>;
  isLoading?: boolean;
  error?: string;
  showActions?: boolean;
  title?: string;
  emptyMessage?: string;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  onDelete,
  onView,
  isLoading = false,
  error,
  showActions = true,
  title = 'Files',
  emptyMessage = 'No files available',
}) => {
  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <ImageIcon />;
    } else if (mimeType === 'application/pdf') {
      return <PdfIcon />;
    } else if (mimeType.startsWith('video/')) {
      return <VideoIcon />;
    } else if (mimeType.startsWith('audio/')) {
      return <AudioIcon />;
    } else if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) {
      return <ArchiveIcon />;
    } else if (mimeType.startsWith('text/') || mimeType.includes('document') || mimeType.includes('word')) {
      return <DocumentIcon />;
    } else {
      return <FileIcon />;
    }
  };

  const getFileTypeColor = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return 'success';
    } else if (mimeType === 'application/pdf') {
      return 'error';
    } else if (mimeType.startsWith('video/')) {
      return 'warning';
    } else if (mimeType.startsWith('audio/')) {
      return 'info';
    } else if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) {
      return 'secondary';
    } else {
      return 'default';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleDelete = async (fileId: string) => {
    if (onDelete) {
      try {
        await onDelete(fileId);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleView = async (fileId: string) => {
    if (onView) {
      try {
        await onView(fileId);
      } catch (error) {
        console.error('View failed:', error);
      }
    }
  };

  const canPreview = (mimeType: string) => {
    return mimeType.startsWith('image/') || mimeType === 'application/pdf';
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {title} ({files.length})
      </Typography>

      {files.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <FileIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            {emptyMessage}
          </Typography>
        </Box>
      ) : (
        <List>
          {files.map((file) => (
            <ListItem
              key={file.id}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                mb: 1,
                '&:last-child': { mb: 0 },
              }}
            >
              <ListItemIcon>
                {getFileIcon(file.mime_type)}
              </ListItemIcon>
              
              <ListItemText
                primary={file.filename}
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Chip
                      label={file.mime_type.split('/')[1]?.toUpperCase() || 'FILE'}
                      size="small"
                      color={getFileTypeColor(file.mime_type) as 'success' | 'error' | 'warning' | 'info' | 'secondary' | 'default'}
                      variant="outlined"
                    />
                    <Typography variant="caption" color="text.secondary">
                      {formatFileSize(file.file_size)}
                    </Typography>
                    {file.created_at && (
                      <Typography variant="caption" color="text.secondary">
                        • {formatDate(file.created_at)}
                      </Typography>
                    )}
                  </Box>
                }
              />

              {showActions && (
                <ListItemSecondaryAction>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {canPreview(file.mime_type) && (
                      <IconButton
                        size="small"
                        onClick={() => handleView(file.id)}
                        title="Preview file"
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    )}
                    
                    <FileDownload
                      fileId={file.id}
                      fileSize={file.file_size}
                      variant="icon"
                      size="small"
                    />
                    
                    {onDelete && (
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(file.id)}
                        title="Delete file"
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}; 