import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';
import { CommentCard } from './CommentCard';
import { CommentForm } from './CommentForm';
import { useGetCommentRepliesQuery } from '../../store/api/commentApi';
import type { CommentListItem } from '../../types/api/comment';

interface CommentThreadProps {
  comment: CommentListItem;
  onReply: (commentId: string) => void;
  onEdit: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  currentUserId?: string;
  entityType: 'Project' | 'Task' | 'Milestone';
  entityId: string;
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

export const CommentThread: React.FC<CommentThreadProps> = ({
  comment,
  onReply,
  onEdit,
  onDelete,
  currentUserId,
  entityType,
  entityId,
  currentUser,
  users = [],
}) => {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const { data: repliesData, isLoading: isLoadingReplies } = useGetCommentRepliesQuery(
    { commentId: comment.id },
    { skip: !showReplies }
  );

  const hasReplies = comment.replies_count > 0;
  const replies = repliesData?.data || [];

  const handleToggleReplies = () => {
    setShowReplies(!showReplies);
  };

  const handleReply = (commentId: string) => {
    if (commentId === comment.id) {
      setShowReplyForm(true);
    } else {
      onReply(commentId);
    }
  };

  const handleReplySuccess = () => {
    setShowReplyForm(false);
    // Refetch replies if they're currently shown
    if (showReplies) {
      // The query will automatically refetch due to cache invalidation
    }
  };

  const handleReplyCancel = () => {
    setShowReplyForm(false);
  };

  return (
    <Box>
      {/* Main Comment */}
      <CommentCard
        comment={comment}
        onReply={handleReply}
        onEdit={onEdit}
        onDelete={onDelete}
        currentUserId={currentUserId}
        showReplies={showReplies}
        onToggleReplies={hasReplies ? handleToggleReplies : undefined}
      />

      {/* Reply Form */}
      {showReplyForm && (
        <Box sx={{ ml: 4, mb: 2 }}>
          <CommentForm
            entityType={entityType}
            entityId={entityId}
            parentCommentId={comment.id}
            onCancel={handleReplyCancel}
            onSuccess={handleReplySuccess}
            currentUser={currentUser}
            users={users}
          />
        </Box>
      )}

      {/* Replies */}
      {showReplies && (
        <Box sx={{ ml: 4 }}>
          {isLoadingReplies ? (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Loading replies...
              </Typography>
            </Box>
          ) : replies.length > 0 ? (
            replies.map((reply) => (
              <CommentThread
                key={reply.id}
                comment={reply}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
                currentUserId={currentUserId}
                entityType={entityType}
                entityId={entityId}
                currentUser={currentUser}
                users={users}
              />
            ))
          ) : (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No replies yet
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Show/Hide Replies Button */}
      {hasReplies && !showReplies && (
        <Box sx={{ ml: 4, mb: 2 }}>
          <Button
            size="small"
            onClick={handleToggleReplies}
            startIcon={<ExpandMoreIcon />}
            sx={{ textTransform: 'none' }}
          >
            Show {comment.replies_count} {comment.replies_count === 1 ? 'reply' : 'replies'}
          </Button>
        </Box>
      )}

      {/* Hide Replies Button */}
      {hasReplies && showReplies && (
        <Box sx={{ ml: 4, mb: 2 }}>
          <Button
            size="small"
            onClick={handleToggleReplies}
            startIcon={<ExpandLessIcon />}
            sx={{ textTransform: 'none' }}
          >
            Hide replies
          </Button>
        </Box>
      )}
    </Box>
  );
}; 