'use client';

import React, { useEffect, useState } from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { Header } from './components/Header';
import { Content } from './components/Content';
import { useDemositeStore, DemositePageEnum } from '@/stores/demositeStore';
import { ConfirmationModal } from '@/components';
import { useDeleteDemosite } from '@/hooks/useDemositeData';

export const DetailDemositePage = () => {
  const {
    selectedDemosite,
    breadcrumbs,
    setPage,
    updateBreadcrumbs,
    navigateToEdit,
  } = useDemositeStore();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const deleteDemositeMutation = useDeleteDemosite();

  // Ensure breadcrumbs are set for DETAIL page
  useEffect(() => {
    if (selectedDemosite) {
      updateBreadcrumbs(DemositePageEnum.DETAIL, selectedDemosite.title);
    }
  }, [updateBreadcrumbs, selectedDemosite]);

  const handleBack = () => {
    setPage(DemositePageEnum.LIST);
    updateBreadcrumbs(DemositePageEnum.LIST);
  };

  const handleEdit = () => {
    if (selectedDemosite) {
      navigateToEdit(selectedDemosite);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const demosite = selectedDemosite || {
    id: '',
    title: '',
    description: '',
    location: '',
    establishedDate: '',
    imageUrl: '',
    status: 'inactive',
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteDemositeMutation.mutateAsync(demosite.id);
      setShowDeleteModal(false);
      handleBack();
    } catch (error) {
      console.error('Failed to delete activity:', error);
    }
  };

  if (!selectedDemosite) {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '16px' }}>
        <Box sx={{ padding: '28px', textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No demosite selected
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
          handleEdit={handleEdit}
          handleDelete={() => {
            setShowDeleteModal(true);
          }}
        />
      </Box>
      <Box sx={{ padding: '28px' }}>
        <Content />
      </Box>
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={showDeleteModal}
        onClose={handleDeleteCancel}
        onSecondaryButtonClick={handleDeleteCancel}
        onPrimaryButtonClick={() => {
          handleDeleteConfirm();
          handleBack();
        }}
        title="Delete Demosite?"
        message={`Are you sure you want to delete "${selectedDemosite?.title}"? This action cannot be undone.`}
        primaryButtonText={'Delete'}
        secondaryButtonText="Cancel"
      />
    </Paper>
  );
};
