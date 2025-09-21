'use client';

import React from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useUserStore } from '@/stores/userStore';
import { UserRole, UserStatus } from '@/types/user';

export const Header = () => {
  const { selectedUser, navigateToEdit } = useUserStore();

  if (!selectedUser) return null;

  const handleEdit = () => {
    navigateToEdit(selectedUser);
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log('Delete user:', selectedUser.id);
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return 'error';
      case UserRole.ADMIN:
        return 'warning';
      case UserRole.USER:
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE:
        return 'success';
      case UserStatus.INACTIVE:
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        mb: 2,
      }}
    >
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          {selectedUser.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {selectedUser.email}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <Chip
            label={selectedUser.role}
            color={getRoleColor(selectedUser.role)}
            size="small"
          />
          <Chip
            label={selectedUser.status}
            color={getStatusColor(selectedUser.status)}
            size="small"
            variant="outlined"
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={handleEdit}
          size="small"
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
          size="small"
          color="error"
        >
          Delete
        </Button>
      </Box>
    </Box>
  );
};
