'use client';

import * as React from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import theme from '@/theme';
import { ReactQueryProvider } from '@/providers';
import { AuthProvider } from '@/providers/AuthProvider';
import { GlobalDataProvider } from '@/providers/GlobalDataProvider';
import { Toaster } from 'react-hot-toast';

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <InitColorSchemeScript attribute="class" />
      </head>
      <body>
        <ReactQueryProvider>
          <AuthProvider>
            <GlobalDataProvider>
              <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                <ThemeProvider theme={theme}>
                  <Toaster />
                  {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                  <CssBaseline />
                  {props.children}
                </ThemeProvider>
              </AppRouterCacheProvider>
            </GlobalDataProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
