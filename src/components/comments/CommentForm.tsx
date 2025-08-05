import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Avatar,
  Typography,
  Autocomplete,
  Chip,
  Paper,
} from '@mui/material';
import {
  Send as SendIcon,
  Cancel as CancelIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { useCreateCommentMutation, useUpdateCommentMutation } from '../../store/api/commentApi';
import type { CreateCommentRequest, UpdateCommentRequest } from '../../types/api/comment';

interface User {
  id: string;
  first_name: string;
  last_name: string;
}

interface CommentFormProps {
  entityType: 'Project' | 'Task' | 'Milestone';
  entityId: string;
  parentCommentId?: string;
  onCancel?: () => void;
  onSuccess?: () => void;
  editComment?: {
    id: string;
    content: string;
  };
  currentUser?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  users?: User[]; // Available users for mentions
}

export const CommentForm: React.FC<CommentFormProps> = ({
  entityType,
  entityId,
  parentCommentId,
  onCancel,
  onSuccess,
  editComment,
  currentUser,
  users = [],
}) => {
  const [content, setContent] = useState(editComment?.content || '');
  const [mentions, setMentions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textFieldRef = useRef<HTMLDivElement>(null);

  const [createComment] = useCreateCommentMutation();
  const [updateComment] = useUpdateCommentMutation();

  const isEditing = !!editComment;

  useEffect(() => {
    if (textFieldRef.current && !isEditing) {
      textFieldRef.current.focus();
    }
  }, [isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      if (isEditing && editComment) {
        const updateData: UpdateCommentRequest = {
          content: content.trim(),
        };
        await updateComment({ id: editComment.id, data: updateData }).unwrap();
      } else {
        const commentData: CreateCommentRequest = {
          content: content.trim(),
          entity_type: entityType,
          entity_id: entityId,
          mentions: mentions.length > 0 ? mentions : undefined,
          ...(parentCommentId && { parent_comment_id: parentCommentId }),
        };
        await createComment(commentData).unwrap();
      }
      
      setContent('');
      setMentions([]);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving comment:', error);
      // TODO: Show error notification
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setContent('');
    setMentions([]);
    onCancel?.();
  };

  const handleMentionSelect = (userId: string) => {
    if (!mentions.includes(userId)) {
      setMentions([...mentions, userId]);
    }
  };

  const handleMentionRemove = (userId: string) => {
    setMentions(mentions.filter(id => id !== userId));
  };

  const getSelectedUsers = () => {
    return users.filter(user => mentions.includes(user.id));
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <form onSubmit={handleSubmit}>
        {/* Current User Info */}
        {currentUser && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main' }}
              alt={`${currentUser.first_name} ${currentUser.last_name}`}
            >
              {currentUser.first_name.charAt(0)}{currentUser.last_name.charAt(0)}
            </Avatar>
            <Typography variant="body2" color="text.secondary">
              {currentUser.first_name} {currentUser.last_name}
            </Typography>
          </Box>
        )}

        {/* Comment Content */}
        <TextField
          ref={textFieldRef}
          multiline
          rows={3}
          fullWidth
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={isEditing ? "Edit your comment..." : "Write a comment..."}
          variant="outlined"
          sx={{ mb: 2 }}
          disabled={isSubmitting}
        />

        {/* Mentions */}
        {users.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PersonAddIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                Mention users:
              </Typography>
            </Box>
            
            {/* Selected Mentions */}
            {getSelectedUsers().length > 0 && (
              <Box sx={{ mb: 1 }}>
                {getSelectedUsers().map((user) => (
                  <Chip
                    key={user.id}
                    label={`${user.first_name} ${user.last_name}`}
                    size="small"
                    onDelete={() => handleMentionRemove(user.id)}
                    sx={{ mr: 0.5, mb: 0.5 }}
                  />
                ))}
              </Box>
            )}

            {/* User Selection */}
            <Autocomplete
              options={users.filter(user => !mentions.includes(user.id))}
              getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
              onChange={(_, value) => value && handleMentionSelect(value.id)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  placeholder="Select user to mention..."
                  variant="outlined"
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Avatar
                    sx={{ width: 24, height: 24, mr: 1, bgcolor: 'primary.main' }}
                    alt={`${option.first_name} ${option.last_name}`}
                  >
                    {option.first_name.charAt(0)}{option.last_name.charAt(0)}
                  </Avatar>
                  {option.first_name} {option.last_name}
                </Box>
              )}
            />
          </Box>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          {onCancel && (
            <Button
              variant="outlined"
              onClick={handleCancel}
              disabled={isSubmitting}
              startIcon={<CancelIcon />}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={!content.trim() || isSubmitting}
            startIcon={<SendIcon />}
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Post Comment'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
}; 