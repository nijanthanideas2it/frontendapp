// File API Types

export interface FileAttachment {
  id: string;
  filename: string;
  file_size: number;
  mime_type: string;
  entity_type: string;
  entity_id: string;
  uploaded_by: string;
  created_at: string;
}

export interface FileUploadResponse {
  id: string;
  filename: string;
  file_size: number;
  mime_type: string;
  download_url: string;
  created_at: string;
}

export interface FileDownloadResponse {
  file_url: string;
  filename: string;
  expires_at: string;
}

// File upload request (multipart form data)
export interface FileUploadRequest {
  file: File;
  entity_type: string;
  entity_id: string;
} 