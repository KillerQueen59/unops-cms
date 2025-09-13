'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { useUserStore } from '@/stores/userStore';

export const Header = () => {
  const { selectedUser } = useUserStore();

  if (!selectedUser) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Edit User
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Update information for {selectedUser.name}
      </Typography>
    </Box>
  );
};
