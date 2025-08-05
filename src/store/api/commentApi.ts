import { apiSlice } from './apiSlice';
import type {
  Comment,
  CommentsListResponse,
  CreateCommentRequest,
  UpdateCommentRequest,
  UpdateCommentResponse,
  CommentsQueryParams,
} from '../../types/api/comment';

export const commentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get comments for an entity (project, task, milestone)
    getComments: builder.query<CommentsListResponse, CommentsQueryParams>({
      query: ({ entity_type, entity_id, page = 1, limit = 20 }) => ({
        url: '/comments',
        params: {
          entity_type,
          entity_id,
          page,
          limit,
        },
      }),
      providesTags: (result, error, { entity_type, entity_id }) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Comment' as const, id })),
              { type: 'Comment', id: 'LIST' },
              { type: 'Comment', id: `${entity_type}-${entity_id}` },
            ]
          : [{ type: 'Comment', id: 'LIST' }],
    }),

    // Get a single comment by ID
    getComment: builder.query<Comment, string>({
      query: (id) => `/comments/${id}`,
      providesTags: (result, error, id) => [{ type: 'Comment', id }],
    }),

    // Create a new comment
    createComment: builder.mutation<Comment, CreateCommentRequest>({
      query: (comment) => ({
        url: '/comments',
        method: 'POST',
        body: comment,
      }),
      invalidatesTags: (result, error, { entity_type, entity_id }) => [
        { type: 'Comment', id: 'LIST' },
        { type: 'Comment', id: `${entity_type}-${entity_id}` },
      ],
    }),

    // Update a comment
    updateComment: builder.mutation<UpdateCommentResponse, { id: string; data: UpdateCommentRequest }>({
      query: ({ id, data }) => ({
        url: `/comments/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Comment', id },
        { type: 'Comment', id: 'LIST' },
      ],
    }),

    // Delete a comment
    deleteComment: builder.mutation<void, string>({
      query: (id) => ({
        url: `/comments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Comment', id },
        { type: 'Comment', id: 'LIST' },
      ],
    }),

    // Get comment replies (threaded comments)
    getCommentReplies: builder.query<CommentsListResponse, { commentId: string; page?: number; limit?: number }>({
      query: ({ commentId, page = 1, limit = 20 }) => ({
        url: `/comments/${commentId}/replies`,
        params: { page, limit },
      }),
      providesTags: (result, error, { commentId }) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Comment' as const, id })),
              { type: 'Comment', id: 'REPLIES' },
              { type: 'Comment', id: `replies-${commentId}` },
            ]
          : [{ type: 'Comment', id: 'REPLIES' }],
    }),
  }),
});

export const {
  useGetCommentsQuery,
  useGetCommentQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useGetCommentRepliesQuery,
} = commentApi; 