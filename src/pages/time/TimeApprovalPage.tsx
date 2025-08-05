import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  useTheme,
  Breadcrumbs,
  Link,
  Button,
  Alert,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ApprovalList } from '../../components/time/ApprovalList';
import { useGetPendingApprovalsQuery } from '../../store/api/timeApi';

export const TimeApprovalPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [selectedEntries, setSelectedEntries] = useState<number[]>([]);

  const { data: approvalsData, isLoading, error } = useGetPendingApprovalsQuery();

  const handleBulkApprove = () => {
    // Bulk approval functionality will be implemented in the next iteration
    console.log('Bulk approving entries:', selectedEntries);
  };

  const handleBulkReject = () => {
    // Bulk rejection functionality will be implemented in the next iteration
    console.log('Bulk rejecting entries:', selectedEntries);
  };

  const handleSelectionChange = (entryIds: number[]) => {
    setSelectedEntries(entryIds);
  };

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load pending approvals. Please try again.
        </Alert>
      </Container>
    );
  }

  const pendingEntries = approvalsData?.timeEntries || [];
  const totalPending = pendingEntries.length;

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('/dashboard');
          }}
          sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        >
          Dashboard
        </Link>
        <Link
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('/time');
          }}
          sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        >
          Time Entries
        </Link>
        <Typography color="text.primary">Time Approval</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Time Approval
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {selectedEntries.length > 0 && (
              <>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleBulkReject}
                  sx={{ textTransform: 'none' }}
                >
                  Reject Selected ({selectedEntries.length})
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleBulkApprove}
                  sx={{ textTransform: 'none' }}
                >
                  Approve Selected ({selectedEntries.length})
                </Button>
              </>
            )}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body1" color="text.secondary">
            Review and approve time entries from your team
          </Typography>
          <Chip
            label={`${totalPending} pending`}
            color="warning"
            size="small"
          />
        </Box>
      </Box>

      {/* Approval Summary */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Approval Summary
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {totalPending} time entries awaiting approval
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h4" color="warning.main" fontWeight={600}>
              {totalPending}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pending
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Approval List */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <ApprovalList
          timeEntries={pendingEntries}
          isLoading={isLoading}
          selectedEntries={selectedEntries}
          onSelectionChange={handleSelectionChange}
        />
      </Paper>

      {totalPending === 0 && !isLoading && (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No pending approvals
          </Typography>
          <Typography variant="body2" color="text.secondary">
            All time entries have been reviewed and approved.
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default TimeApprovalPage; 