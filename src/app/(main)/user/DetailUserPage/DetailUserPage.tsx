'use client';

import React, { useEffect, useState } from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { useUserStore } from '@/stores/userStore';
import { Header } from './components/Header';
import { PageEnum } from '@/constants/page';
import { ConfirmationModal } from '@/components';
import { useDeleteUser } from '@/hooks/useUserData';
import { UserRole, UserStatus } from '@/types/user';

export const DetailUserPage = () => {
  const {
    breadcrumbs,
    selectedUser,
    navigateToEdit,
    setPage,
    updateBreadcrumbs,
  } = useUserStore();
  const user = selectedUser || {
    id: '',
    name: '',
    email: '',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    lastLogin: '',
    createdAt: '',
    createdBy: '',
    lastModified: '',
    modifiedBy: '',
    password: '',
  };

  const handleBack = () => {
    setPage(PageEnum.LIST);
    updateBreadcrumbs(PageEnum.LIST);
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const deleteUserMutation = useDeleteUser();

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteUserMutation.mutateAsync(user.id);
      setShowDeleteModal(false);
      handleBack();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  // Ensure breadcrumbs are set for DETAIL page
  useEffect(() => {
    if (selectedUser) {
      setPage(PageEnum.DETAIL);
      updateBreadcrumbs(PageEnum.DETAIL, selectedUser.name);
    }
  }, [selectedUser, setPage, updateBreadcrumbs]);

  if (!selectedUser) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography>No user selected</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Header
          breadcrumbs={breadcrumbs}
          userData={user}
          handleBack={handleBack}
          handleDelete={() => {
            setShowDeleteModal(true);
          }}
          handleEdit={() => navigateToEdit(user)}
        />
      </Box>
      <ConfirmationModal
        open={showDeleteModal}
        onClose={handleDeleteCancel}
        onSecondaryButtonClick={handleDeleteCancel}
        onPrimaryButtonClick={handleDeleteConfirm}
        title="Delete User?"
        message={`Are you sure you want to delete "${selectedUser?.email}"? This action cannot be undone.`}
        primaryButtonText={'Delete'}
        secondaryButtonText="Cancel"
      />
    </Paper>
  );
};

export default DetailUserPage;
