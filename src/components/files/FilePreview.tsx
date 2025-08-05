import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  LinearProgress,
  Alert,
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
  Download as DownloadIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';

interface FileObject {
  id: string;
  filename: string;
  file_size: number;
  mime_type: string;
  download_url?: string;
  created_at?: string;
}

interface FilePreviewProps {
  file: File | FileObject;
  onDelete?: (file: File | string) => void;
  onDownload?: (fileId: string) => void;
  onView?: (file: File | string) => void;
  uploadProgress?: number;
  isUploading?: boolean;
  error?: string;
  showActions?: boolean;
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  onDelete,
  onDownload,
  onView,
  uploadProgress,
  isUploading = false,
  error,
  showActions = true,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const isFileObject = file instanceof File;
  const fileId = isFileObject ? undefined : (file as FileObject).id;
  const fileName = isFileObject ? file.name : (file as FileObject).filename;
  const fileSize = isFileObject ? file.size : (file as FileObject).file_size;
  const mimeType = isFileObject ? file.type : (file as FileObject).mime_type;
  const downloadUrl = isFileObject ? undefined : (file as FileObject).download_url;

  // Generate image preview for image files
  React.useEffect(() => {
    if (isFileObject && file && mimeType.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [file, isFileObject, mimeType]);

  const getFileIcon = () => {
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

  const getFileTypeColor = () => {
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

  const handleDelete = () => {
    if (onDelete) {
      onDelete(isFileObject ? file : fileId!);
    }
  };

  const handleDownload = () => {
    if (onDownload && fileId) {
      onDownload(fileId);
    } else if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    }
  };

  const handleView = () => {
    if (onView) {
      onView(isFileObject ? file : fileId!);
    } else if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    }
  };

  const canPreview = mimeType.startsWith('image/') || mimeType === 'application/pdf';

  return (
    <Card sx={{ mb: 2, position: 'relative' }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          {/* File Icon/Preview */}
          <Box sx={{ position: 'relative' }}>
            {imagePreview && mimeType.startsWith('image/') && !imageError ? (
              <Box
                component="img"
                src={imagePreview}
                alt={fileName}
                sx={{
                  width: 60,
                  height: 60,
                  objectFit: 'cover',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
                onError={() => setImageError(true)}
              />
            ) : (
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.100',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                {getFileIcon()}
              </Box>
            )}
          </Box>

          {/* File Info */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" noWrap>
              {fileName}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Chip
                label={mimeType.split('/')[1]?.toUpperCase() || 'FILE'}
                size="small"
                color={getFileTypeColor() as 'success' | 'error' | 'warning' | 'info' | 'secondary' | 'default'}
                variant="outlined"
              />
              <Typography variant="caption" color="text.secondary">
                {formatFileSize(fileSize)}
              </Typography>
            </Box>

            {/* Upload Progress */}
            {isUploading && uploadProgress !== undefined && (
              <Box sx={{ width: '100%', mb: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={uploadProgress}
                  sx={{ height: 4, borderRadius: 2 }}
                />
                <Typography variant="caption" color="text.secondary">
                  {uploadProgress}% uploaded
                </Typography>
              </Box>
            )}

            {/* Error Message */}
            {error && (
              <Alert severity="error" sx={{ mt: 1, py: 0 }}>
                {error}
              </Alert>
            )}
          </Box>

          {/* Actions */}
          {showActions && (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {canPreview && (
                <IconButton
                  size="small"
                  onClick={handleView}
                  title="Preview file"
                >
                  <ViewIcon fontSize="small" />
                </IconButton>
              )}
              {(downloadUrl || onDownload) && (
                <IconButton
                  size="small"
                  onClick={handleDownload}
                  title="Download file"
                >
                  <DownloadIcon fontSize="small" />
                </IconButton>
              )}
              {onDelete && (
                <IconButton
                  size="small"
                  onClick={handleDelete}
                  title="Delete file"
                  color="error"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}; 