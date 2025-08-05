import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Button,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Reply as ReplyIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
// Simple date formatting function
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
};
import type { CommentListItem } from '../../types/api/comment';

interface CommentCardProps {
  comment: CommentListItem;
  onReply: (commentId: string) => void;
  onEdit: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  currentUserId?: string;
  showReplies?: boolean;
  onToggleReplies?: () => void;
}

export const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  onReply,
  onEdit,
  onDelete,
  currentUserId,
  showReplies = false,
  onToggleReplies,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setIsEditing(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(comment.id);
    handleMenuClose();
  };

  const handleSaveEdit = () => {
    onEdit(comment.id, editContent);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const handleReply = () => {
    onReply(comment.id);
  };

  const isAuthor = currentUserId === comment.author.id;
  const hasReplies = comment.replies_count > 0;

  return (
    <Card sx={{ mb: 2, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          {/* Author Avatar */}
          <Avatar
            sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}
            alt={`${comment.author.first_name} ${comment.author.last_name}`}
          >
            {comment.author.first_name.charAt(0)}{comment.author.last_name.charAt(0)}
          </Avatar>

          {/* Comment Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Author Info and Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {comment.author.first_name} {comment.author.last_name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {formatRelativeTime(comment.created_at)}
                  </Typography>
                </Box>
              </Box>

              {/* Actions Menu */}
              {isAuthor && (
                <IconButton size="small" onClick={handleMenuOpen}>
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              )}
            </Box>

            {/* Comment Content */}
            {isEditing ? (
              <Box sx={{ mb: 2 }}>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontFamily: 'inherit',
                    fontSize: '14px',
                    resize: 'vertical',
                  }}
                />
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Button size="small" variant="contained" onClick={handleSaveEdit}>
                    Save
                  </Button>
                  <Button size="small" variant="outlined" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <Typography variant="body2" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                {comment.content}
              </Typography>
            )}

            {/* Mentions */}
            {comment.mentions && comment.mentions.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                  Mentions:
                </Typography>
                {comment.mentions.map((mention) => (
                  <Chip
                    key={mention.id}
                    label={`${mention.first_name} ${mention.last_name}`}
                    size="small"
                    variant="outlined"
                    sx={{ mr: 0.5, mb: 0.5 }}
                  />
                ))}
              </Box>
            )}

            {/* Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                size="small"
                startIcon={<ReplyIcon />}
                onClick={handleReply}
                sx={{ textTransform: 'none' }}
              >
                Reply
              </Button>
              {hasReplies && (
                <Button
                  size="small"
                  onClick={onToggleReplies}
                  sx={{ textTransform: 'none' }}
                >
                  {showReplies ? 'Hide' : 'Show'} {comment.replies_count} {comment.replies_count === 1 ? 'reply' : 'replies'}
                </Button>
              )}
            </Box>
          </Box>
        </Box>

        {/* Actions Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleEdit}>
            <EditIcon sx={{ mr: 1, fontSize: 18 }} />
            Edit
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <DeleteIcon sx={{ mr: 1, fontSize: 18 }} />
            Delete
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
}; 