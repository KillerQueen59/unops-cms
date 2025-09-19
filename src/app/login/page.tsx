'use client';

import React from 'react';
import { Box, Paper, Typography, Button, Container } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper sx={{ p: 4, width: '100%', textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom color="primary">
            Authentication Disabled
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            The application is currently using static authentication with a
            Bearer token. Login functionality has been temporarily disabled.
          </Typography>

          <Typography variant="body2" sx={{ mb: 4, color: 'text.secondary' }}>
            You are automatically authenticated as: <strong>Admin User</strong>
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={handleGoHome}
            sx={{
              mt: 2,
              backgroundColor: '#0EA5E9',
              '&:hover': {
                backgroundColor: '#0284C7',
              },
            }}
          >
            Go to Dashboard
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}
