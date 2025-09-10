'use client';

import React, { useEffect } from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { Header } from './components/Header';
import { Form } from './components/Form';
import { useDemositeStore, DemositePageEnum } from '@/stores/demositeStore';

export const EditDemositePage = () => {
  const { selectedDemosite, breadcrumbs, setPage, updateBreadcrumbs } =
    useDemositeStore();

  // Ensure breadcrumbs are set for EDIT page
  useEffect(() => {
    if (selectedDemosite) {
      updateBreadcrumbs(DemositePageEnum.EDIT, selectedDemosite.title);
    }
  }, [updateBreadcrumbs, selectedDemosite]);

  const handleBack = () => {
    setPage(DemositePageEnum.LIST);
    updateBreadcrumbs(DemositePageEnum.LIST);
  };

  if (!selectedDemosite) {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '16px' }}>
        <Box sx={{ padding: '28px', textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No demosite selected for editing
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '16px' }}>
      <Box sx={{ padding: '28px', borderBottom: '1px solid #E5E7EB' }}>
        <Header
          breadcrumbs={breadcrumbs || []}
          demositeData={selectedDemosite}
          handleBack={handleBack}
        />
      </Box>
      <Box sx={{ padding: '28px' }}>
        <Form />
      </Box>
    </Paper>
  );
};
