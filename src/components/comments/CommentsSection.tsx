import React, { useState } from 'react';
import {
  Box,
  Typography,
  Divider,
  CircularProgress,
  Alert,
  Button,
  Pagination,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useGetCommentsQuery, useDeleteCommentMutation, useUpdateCommentMutation } from '../../store/api/commentApi';
import { CommentForm } from './CommentForm';
import { CommentThread } from './CommentThread';
import type { EntityType } from '../../types/api/comment';

interface CommentsSectionProps {
  entityType: EntityType;
  entityId: string;
  title?: string;
  currentUser?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  users?: Array<{
    id: string;
    first_name: string;
    last_name: string;
  }>;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  entityType,
  entityId,
  title = 'Comments',
  currentUser,
  users = [],
}) => {
  const [page, setPage] = useState(1);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const { data: commentsData, isLoading, error, refetch } = useGetCommentsQuery({
    entity_type: entityType,
    entity_id: entityId,
    page,
    limit: 10,
  });

  const [deleteComment] = useDeleteCommentMutation();
  const [updateComment] = useUpdateCommentMutation();

  const comments = commentsData?.data || [];
  const totalPages = commentsData?.pagination?.pages || 1;
  const totalComments = commentsData?.pagination?.total || 0;

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleAddComment = () => {
    setShowCommentForm(true);
  };

  const handleCommentSuccess = () => {
    setShowCommentForm(false);
    setReplyingTo(null);
    refetch();
  };

  const handleCommentCancel = () => {
    setShowCommentForm(false);
    setReplyingTo(null);
  };

  const handleReply = (commentId: string) => {
    setReplyingTo(commentId);
  };

  const handleEdit = async (commentId: string, content: string) => {
    try {
      await updateComment({ id: commentId, data: { content } }).unwrap();
      refetch();
    } catch (error) {
      console.error('Error updating comment:', error);
      // TODO: Show error notification
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment(commentId).unwrap();
      refetch();
    } catch (error) {
      console.error('Error deleting comment:', error);
      // TODO: Show error notification
    }
  };

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">
          Failed to load comments. Please try again.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h3">
          {title} ({totalComments})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddComment}
          disabled={!currentUser}
        >
          Add Comment
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Comment Form */}
      {showCommentForm && (
        <Box sx={{ mb: 3 }}>
          <CommentForm
            entityType={entityType}
            entityId={entityId}
            onCancel={handleCommentCancel}
            onSuccess={handleCommentSuccess}
            currentUser={currentUser}
            users={users}
          />
        </Box>
      )}

      {/* Comments List */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : comments.length === 0 ? (
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="body2" color="text.secondary">
            No comments yet. Be the first to add a comment!
          </Typography>
          {currentUser && (
            <Button
              variant="outlined"
              onClick={handleAddComment}
              sx={{ mt: 2 }}
            >
              Add First Comment
            </Button>
          )}
        </Box>
      ) : (
        <Box>
          {/* Comments */}
          {comments.map((comment) => (
            <CommentThread
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              onEdit={handleEdit}
              onDelete={handleDelete}
              currentUserId={currentUser?.id}
              entityType={entityType}
              entityId={entityId}
              currentUser={currentUser}
              users={users}
            />
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="small"
              />
            </Box>
          )}
        </Box>
      )}

      {/* Reply Form (for specific comment) */}
      {replyingTo && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Replying to comment
          </Typography>
          <CommentForm
            entityType={entityType}
            entityId={entityId}
            parentCommentId={replyingTo}
            onCancel={handleCommentCancel}
            onSuccess={handleCommentSuccess}
            currentUser={currentUser}
            users={users}
          />
        </Box>
      )}
    </Box>
  );
}; 