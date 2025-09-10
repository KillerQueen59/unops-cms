'use client';

import React, { useEffect } from 'react';
import { Paper, Box } from '@mui/material';
import { Header } from './components/Header';
import { Form } from './components/Form';
import { useDemositeStore, DemositePageEnum } from '@/stores/demositeStore';

export const AddDemositePage = () => {
  const { breadcrumbs, setPage, updateBreadcrumbs } = useDemositeStore();

  // Ensure breadcrumbs are set for ADD page
  useEffect(() => {
    updateBreadcrumbs(DemositePageEnum.ADD);
  }, [updateBreadcrumbs]);

  const handleBack = () => {
    setPage(DemositePageEnum.LIST);
    updateBreadcrumbs(DemositePageEnum.LIST);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '16px' }}>
      <Box sx={{ padding: '28px', borderBottom: '1px solid #E5E7EB' }}>
        <Header
          breadcrumbs={breadcrumbs || []}
          isEditMode={false}
          handleBack={handleBack}
        />
      </Box>
      <Box sx={{ padding: '28px' }}>
        <Form />
      </Box>
    </Paper>
  );
};
