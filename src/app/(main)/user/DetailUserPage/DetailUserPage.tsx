'use client';

import React, { useEffect } from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { useUserStore, UserPageEnum } from '@/stores/userStore';
import { Header } from './components/Header';
import { Content } from './components/Content';

export const DetailUserPage = () => {
  const { selectedUser, setPage, updateBreadcrumbs } = useUserStore();

  // Ensure breadcrumbs are set for DETAIL page
  useEffect(() => {
    if (selectedUser) {
      setPage(UserPageEnum.DETAIL);
      updateBreadcrumbs(UserPageEnum.DETAIL, selectedUser.name);
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
        <Content />
      </Box>
    </Paper>
  );
};

export default DetailUserPage;
