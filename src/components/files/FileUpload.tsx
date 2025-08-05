import React, { useRef, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { FileDropzone } from './FileDropzone';
import { FilePreview } from './FilePreview';
import type { FileUploadResponse } from '../../types/api/file';

interface FileUploadProps {
  onFilesUpload: (files: File[]) => Promise<FileUploadResponse[]>;
  onFileDelete?: (fileId: string) => Promise<void>;
  onFileDownload?: (fileId: string) => Promise<void>;
  onFileView?: (fileId: string) => Promise<void>;
  accept?: string;
  maxFiles?: number;
  maxSize?: number;
  disabled?: boolean;
  existingFiles?: Array<{
    id: string;
    filename: string;
    file_size: number;
    mime_type: string;
    download_url?: string;
    created_at?: string;
  }>;
  title?: string;
  description?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesUpload,
  onFileDelete,
  onFileDownload,
  onFileView,
  accept,
  maxFiles = 10,
  maxSize = 50 * 1024 * 1024, // 50MB default
  disabled = false,
  existingFiles = [],
  title = 'File Upload',
  description = 'Upload files by dragging and dropping or clicking to browse',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<Map<File, number>>(new Map());
  const [uploadedFiles, setUploadedFiles] = useState<FileUploadResponse[]>([]);
  const [fileErrors, setFileErrors] = useState<Map<File, string>>(new Map());
  const [isUploading, setIsUploading] = useState(false);

  const handleFilesDrop = (files: File[]) => {
    const newFiles = [...selectedFiles, ...files].slice(0, maxFiles);
    setSelectedFiles(newFiles);
    setFileErrors(new Map()); // Clear previous errors
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    handleFilesDrop(files);
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    const newUploadingFiles = new Map<File, number>();
    selectedFiles.forEach(file => newUploadingFiles.set(file, 0));
    setUploadingFiles(newUploadingFiles);

    try {
      const responses = await onFilesUpload(selectedFiles);
      setUploadedFiles(prev => [...prev, ...responses]);
      setSelectedFiles([]);
      setUploadingFiles(new Map());
      setFileErrors(new Map());
    } catch (error) {
      console.error('Upload failed:', error);
      // Set error for all files
      const newErrors = new Map<File, string>();
      selectedFiles.forEach(file => {
        newErrors.set(file, 'Upload failed. Please try again.');
      });
      setFileErrors(newErrors);
      setUploadingFiles(new Map());
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileDelete = async (file: File | string) => {
    if (typeof file === 'string') {
      // Delete uploaded file
      if (onFileDelete) {
        try {
          await onFileDelete(file);
          setUploadedFiles(prev => prev.filter(f => f.id !== file));
        } catch (error) {
          console.error('Delete failed:', error);
        }
      }
    } else {
      // Remove from selected files
      setSelectedFiles(prev => prev.filter(f => f !== file));
      setFileErrors(prev => {
        const newErrors = new Map(prev);
        newErrors.delete(file);
        return newErrors;
      });
    }
  };

  const handleFileDownload = async (fileId: string) => {
    if (onFileDownload) {
      try {
        await onFileDownload(fileId);
      } catch (error) {
        console.error('Download failed:', error);
      }
    }
  };

  const handleFileView = async (file: File | string) => {
    if (typeof file === 'string' && onFileView) {
      try {
        await onFileView(file);
      } catch (error) {
        console.error('View failed:', error);
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const allFiles = [
    ...selectedFiles.map(file => ({ file, type: 'selected' as const })),
    ...uploadedFiles.map(file => ({ file, type: 'uploaded' as const })),
    ...existingFiles.map(file => ({ file, type: 'existing' as const })),
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {description}
      </Typography>

      {/* File Dropzone */}
      <FileDropzone
        onFilesDrop={handleFilesDrop}
        accept={accept}
        maxFiles={maxFiles}
        maxSize={maxSize}
        disabled={disabled || isUploading}
      >
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Drag and drop files here
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            or click to browse
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading}
          >
            Select Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={accept}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </Box>
      </FileDropzone>

      {/* Upload Button */}
      {selectedFiles.length > 0 && (
        <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={isUploading || disabled}
            startIcon={isUploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
          >
            {isUploading ? 'Uploading...' : `Upload ${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''}`}
          </Button>
          <Typography variant="body2" color="text.secondary">
            {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
          </Typography>
        </Box>
      )}

      {/* File List */}
      {allFiles.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Files ({allFiles.length})
          </Typography>
          {allFiles.map(({ file, type }) => (
            <FilePreview
              key={type === 'selected' ? `selected-${file.name}` : `uploaded-${(file as { id: string }).id}`}
              file={file}
              onDelete={type === 'selected' || type === 'uploaded' ? handleFileDelete : undefined}
              onDownload={type === 'uploaded' || type === 'existing' ? handleFileDownload : undefined}
              onView={type === 'uploaded' || type === 'existing' ? handleFileView : undefined}
              uploadProgress={type === 'selected' ? uploadingFiles.get(file as File) : undefined}
              isUploading={type === 'selected' && uploadingFiles.has(file as File)}
              error={type === 'selected' ? fileErrors.get(file as File) : undefined}
              showActions={true}
            />
          ))}
        </Box>
      )}

      {/* File Limits Info */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Maximum {maxFiles} files, {formatFileSize(maxSize)} each
          {accept && ` • Accepted formats: ${accept}`}
        </Typography>
      </Box>
    </Box>
  );
}; 