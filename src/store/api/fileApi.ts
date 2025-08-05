import { apiSlice } from './apiSlice';
import type { FileUploadResponse, FileDownloadResponse } from '../../types/api/file';

export const fileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Upload file attachment to comment
    uploadFileAttachment: builder.mutation<FileUploadResponse, { commentId: string; file: File }>({
      query: ({ commentId, file }) => {
        const formData = new FormData();
        formData.append('file', file);
        
        return {
          url: `/comments/${commentId}/attachments`,
          method: 'POST',
          body: formData,
          // Don't set Content-Type header, let the browser set it with boundary
          headers: {},
        };
      },
      invalidatesTags: (result, error, { commentId }) => [
        { type: 'Comment', id: commentId },
        { type: 'Comment', id: 'LIST' },
      ],
    }),

    // Download file attachment
    downloadFileAttachment: builder.mutation<FileDownloadResponse, string>({
      query: (attachmentId) => ({
        url: `/attachments/${attachmentId}/download`,
        method: 'GET',
        responseHandler: async (response: Response) => {
          if (!response.ok) {
            throw new Error('Download failed');
          }
          
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          
          // Create a temporary link and trigger download
          const link = document.createElement('a');
          link.href = url;
          link.download = response.headers.get('content-disposition')?.split('filename=')[1]?.replace(/"/g, '') || 'download';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          
          return { success: true };
        },
      }),
    }),

    // Delete file attachment
    deleteFileAttachment: builder.mutation<void, { commentId: string; attachmentId: string }>({
      query: ({ commentId, attachmentId }) => ({
        url: `/comments/${commentId}/attachments/${attachmentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { commentId }) => [
        { type: 'Comment', id: commentId },
        { type: 'Comment', id: 'LIST' },
      ],
    }),

    // Get file attachments for a comment
    getFileAttachments: builder.query<FileUploadResponse[], string>({
      query: (commentId) => `/comments/${commentId}/attachments`,
      providesTags: (result, error, commentId) => [
        { type: 'File', id: commentId },
        ...(result?.map(file => ({ type: 'File' as const, id: file.id })) || []),
      ],
    }),
  }),
});

export const {
  useUploadFileAttachmentMutation,
  useDownloadFileAttachmentMutation,
  useDeleteFileAttachmentMutation,
  useGetFileAttachmentsQuery,
} = fileApi; 