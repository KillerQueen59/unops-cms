'use client';

import React, { useEffect } from 'react';
import { Paper, Box } from '@mui/material';
import { Header } from './components/Header';
import { Form } from './components/Form';
import { useUserStore } from '@/stores/userStore';
import { PageEnum } from '@/constants/page';
import { Role } from '@/types/role';

interface AddUserPageProps {
  roles: Role[];
  rolesLoading: boolean;
}

export const AddUserPage = ({ roles, rolesLoading }: AddUserPageProps) => {
  const {
    breadcrumbs,
    navigateToList,
    setPage,
    updateBreadcrumbs,
    selectedUser,
    page,
  } = useUserStore();

  const isEditMode = page === PageEnum.EDIT;

  // Ensure breadcrumbs are set for ADD/EDIT page
  useEffect(() => {
    if (isEditMode) {
      setPage(PageEnum.EDIT);
      updateBreadcrumbs(PageEnum.EDIT, selectedUser?.name);
    } else {
      setPage(PageEnum.ADD);
      updateBreadcrumbs(PageEnum.ADD);
    }
  }, [setPage, updateBreadcrumbs, isEditMode, selectedUser]);

  const handleBack = () => {
    navigateToList();
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '16px' }}>
      <Box sx={{ padding: '28px', borderBottom: '1px solid #E5E7EB' }}>
        <Header
          breadcrumbs={breadcrumbs}
          title={isEditMode ? 'Edit User' : 'Add New User'}
          handleBack={handleBack}
        />
      </Box>
      <Box sx={{ padding: '28px' }}>
        <Form
          isEditMode={isEditMode}
          selectedUser={selectedUser}
          roles={roles}
          rolesLoading={rolesLoading}
        />
      </Box>
    </Paper>
  );
};
