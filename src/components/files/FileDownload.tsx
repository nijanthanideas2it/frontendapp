import React, { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useDownloadFileAttachmentMutation } from '../../store/api/fileApi';

interface FileDownloadProps {
  fileId: string;
  fileSize?: number;
  disabled?: boolean;
  variant?: 'button' | 'icon' | 'text';
  size?: 'small' | 'medium' | 'large';
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const FileDownload: React.FC<FileDownloadProps> = ({
  fileId,
  fileSize,
  disabled = false,
  variant = 'button',
  size = 'medium',
  onSuccess,
  onError,
}) => {
  const [downloadFile, { isLoading, error }] = useDownloadFileAttachmentMutation();
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'downloading' | 'success' | 'error'>('idle');

  const handleDownload = async () => {
    if (disabled || isLoading) return;

    setDownloadStatus('downloading');
    setDownloadProgress(0);

    let progressInterval: NodeJS.Timeout | undefined;

    try {
      // Simulate progress for better UX (since we can't track actual download progress)
      progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      await downloadFile(fileId).unwrap();
      
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      setDownloadProgress(100);
      setDownloadStatus('success');
      onSuccess?.();

      // Reset status after a delay
      setTimeout(() => {
        setDownloadStatus('idle');
        setDownloadProgress(0);
      }, 2000);
    } catch (error) {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      setDownloadStatus('error');
      setDownloadProgress(0);
      const errorMessage = error instanceof Error ? error.message : 'Download failed';
      onError?.(errorMessage);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getButtonContent = () => {
    if (downloadStatus === 'downloading') {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={16} />
          <Typography variant="body2">Downloading...</Typography>
        </Box>
      );
    } else if (downloadStatus === 'success') {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircleIcon fontSize="small" color="success" />
          <Typography variant="body2">Downloaded</Typography>
        </Box>
      );
    } else if (downloadStatus === 'error') {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ErrorIcon fontSize="small" color="error" />
          <Typography variant="body2">Failed</Typography>
        </Box>
      );
    } else {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DownloadIcon fontSize="small" />
          <Typography variant="body2">Download</Typography>
        </Box>
      );
    }
  };

  const getIconContent = () => {
    if (downloadStatus === 'downloading') {
      return <CircularProgress size={20} />;
    } else if (downloadStatus === 'success') {
      return <CheckCircleIcon fontSize="small" color="success" />;
    } else if (downloadStatus === 'error') {
      return <ErrorIcon fontSize="small" color="error" />;
    } else {
      return <DownloadIcon fontSize="small" />;
    }
  };

  const getTextContent = () => {
    if (downloadStatus === 'downloading') {
      return 'Downloading...';
    } else if (downloadStatus === 'success') {
      return 'Downloaded';
    } else if (downloadStatus === 'error') {
      return 'Failed';
    } else {
      return 'Download';
    }
  };

  const isDisabled = disabled || isLoading || downloadStatus === 'downloading';

  return (
    <Box>
      {variant === 'button' && (
        <Button
          variant="outlined"
          size={size}
          onClick={handleDownload}
          disabled={isDisabled}
          startIcon={getIconContent()}
          sx={{ minWidth: 120 }}
        >
          {getButtonContent()}
        </Button>
      )}

      {variant === 'icon' && (
        <Button
          variant="text"
          size={size}
          onClick={handleDownload}
          disabled={isDisabled}
          sx={{ minWidth: 'auto', p: 1 }}
        >
          {getIconContent()}
        </Button>
      )}

      {variant === 'text' && (
        <Button
          variant="text"
          size={size}
          onClick={handleDownload}
          disabled={isDisabled}
          sx={{ textTransform: 'none' }}
        >
          {getTextContent()}
        </Button>
      )}

      {/* Download Progress */}
      {downloadStatus === 'downloading' && (
        <Box sx={{ mt: 1 }}>
          <LinearProgress
            variant="determinate"
            value={downloadProgress}
            sx={{ height: 4, borderRadius: 2 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            {downloadProgress}% complete
          </Typography>
        </Box>
      )}

      {/* File Info */}
      {fileSize && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
          {formatFileSize(fileSize)}
        </Typography>
      )}

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mt: 1, py: 0 }}>
          Download failed. Please try again.
        </Alert>
      )}
    </Box>
  );
}; 