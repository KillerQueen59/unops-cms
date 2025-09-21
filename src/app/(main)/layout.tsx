'use client';

import * as React from 'react';
import BaseLayout from '@/components/BaseLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ClientWrapper } from './MainWrapper';

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <ClientWrapper>
        <BaseLayout>{props.children}</BaseLayout>
      </ClientWrapper>
    </ProtectedRoute>
  );
}
