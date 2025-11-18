'use client';

import React, { useEffect } from 'react';
import { Paper, Box, Typography, CircularProgress } from '@mui/material';
import { Header } from './components/Header';
import { Form } from './components/Form';
import { useDemositeStore, DemositePageEnum } from '@/stores/demositeStore';
import { useVillages } from '@/hooks/useVillageData';
import { useDemosite } from '@/hooks/useDemositeData';

export const EditDemositePage = () => {
  const { selectedDemosite, breadcrumbs, setPage, updateBreadcrumbs } =
    useDemositeStore();

  // Fetch detailed demosite data by ID
  const demositeId = selectedDemosite?.id || null;
  const {
    data: detailedDemosite,
    isLoading: isLoadingDemosite,
    error: demositeError,
  } = useDemosite(demositeId, { enabled: !!demositeId });

  // Use detailed data if available, fallback to store data
  const demositeData = detailedDemosite || selectedDemosite;

  // Ensure breadcrumbs are set for EDIT page
  useEffect(() => {
    if (demositeData) {
      updateBreadcrumbs(DemositePageEnum.EDIT, demositeData.title);
    }
  }, [updateBreadcrumbs, demositeData]);

  const handleBack = () => {
    setPage(DemositePageEnum.LIST);
    updateBreadcrumbs(DemositePageEnum.LIST);
  };

  // fetch village
  const { data: villagesResponse, isLoading } = useVillages();
  const villages = villagesResponse?.data || [];

  const villageOptions = villages.map((village) => ({
    label: village.villageName,
    value: village.villageCode,
  }));

  // Handle loading state
  if (isLoadingDemosite) {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '16px' }}>
        <Box sx={{ padding: '28px', textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            Loading demosite details...
          </Typography>
        </Box>
      </Paper>
    );
  }

  // Handle error state
  if (demositeError) {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '16px' }}>
        <Box sx={{ padding: '28px', textAlign: 'center' }}>
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>
            Error loading demosite
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {demositeError instanceof Error
              ? demositeError.message
              : 'Unknown error occurred'}
          </Typography>
        </Box>
      </Paper>
    );
  }

  // Handle no demosite selected
  if (!demositeData) {
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
          isEditMode={true}
          handleBack={handleBack}
        />
      </Box>
      <Box sx={{ padding: '28px' }}>
        <Form demositeData={demositeData} />
      </Box>
    </Paper>
  );
};
