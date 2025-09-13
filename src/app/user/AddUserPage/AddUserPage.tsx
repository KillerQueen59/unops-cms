'use client';

import React from 'react';
import { Paper, Box } from '@mui/material';
import { Header } from './components/Header';
import { Form } from './components/Form';
import { useUserStore } from '@/stores/userStore';

export const AddUserPage = () => {
  const { breadcrumbs, navigateToList } = useUserStore();

  const handleBack = () => {
    navigateToList();
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '16px' }}>
      <Box sx={{ padding: '28px', borderBottom: '1px solid #E5E7EB' }}>
        <Header
          breadcrumbs={breadcrumbs}
          title="Add New User"
          handleBack={handleBack}
        />
      </Box>
      <Box sx={{ padding: '28px' }}>
        <Form />
      </Box>
    </Paper>
  );
};
