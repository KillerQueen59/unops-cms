'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Box, CircularProgress, Container } from '@mui/material';
import { useAuthStatus } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuthStatus();

  useEffect(() => {
    // Don't redirect if we're already on the login page
    if (pathname === '/login') {
      return;
    }

    if (!isLoading && !isAuthenticated) {
      // User is not authenticated, redirect to login
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  // Show loading while checking authentication status
  if (isLoading) {
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
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Don't render protected content if not authenticated (unless on login page)
  if (!isAuthenticated && pathname !== '/login') {
    return null;
  }

  return <>{children}</>;
}
