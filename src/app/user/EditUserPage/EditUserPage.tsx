'use client';

import React, { useEffect } from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { useUserStore, UserPageEnum } from '@/stores/userStore';
import { Header } from './components/Header';
import { Form } from './components/Form';

export const EditUserPage = () => {
  const { selectedUser, setPage, updateBreadcrumbs } = useUserStore();

  // Ensure breadcrumbs are set for EDIT page
  useEffect(() => {
    if (selectedUser) {
      setPage(UserPageEnum.EDIT);
      updateBreadcrumbs(UserPageEnum.EDIT, selectedUser.name);
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
        <Header />
        <Form />
      </Box>
    </Paper>
  );
};

export default EditUserPage;
