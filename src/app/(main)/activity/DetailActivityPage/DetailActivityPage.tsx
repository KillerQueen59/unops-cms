'use client';

import React, { useMemo, useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useEffect } from 'react';
import { Header } from './components/Header';
import { ActivityPageEnum, useActivityStore } from '@/stores/activityStore';
import { useVillages } from '@/hooks/useVillageData';
import { ConfirmationModal } from '@/components';
import { useDeleteActivity } from '@/hooks/useActivityData';

export const DetailActivityPage = () => {
  const {
    updateBreadcrumbs,
    setPage,
    navigateToEdit,
    selectedActivity,
    breadcrumbs,
  } = useActivityStore();

  useEffect(() => {
    updateBreadcrumbs(ActivityPageEnum.DETAIL);
  }, [updateBreadcrumbs]);

  const handleBack = () => {
    setPage(ActivityPageEnum.LIST);
    updateBreadcrumbs(ActivityPageEnum.LIST);
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const deleteActivityMutation = useDeleteActivity();

  const { data: villagesResponse, isLoading, error } = useVillages();
  const villages = villagesResponse?.data || [];

  const villageOptions = villages.map((village) => ({
    label: village.villageName,
    value: village.villageCode,
    category: village.categoryName,
  }));

  const category = useMemo(() => {
    if (!selectedActivity) return '';
    const village = villageOptions.find(
      (village) => village.value === selectedActivity.villageId
    );
    return village?.category || '';
  }, [selectedActivity, villageOptions]);

  const villageName = useMemo(() => {
    if (!selectedActivity) return '';
    const village = villageOptions.find(
      (village) => village.value === selectedActivity.villageId
    );
    return village?.label || '';
  }, [selectedActivity, villageOptions]);

  const activityData = selectedActivity || {
    id: '',
    activityName: '',
    activityCategory: '',
    startDate: '',
    endDate: '',
    status: 'not yet',
    percentage: '0',
    description: '',
    type: 'demosite',
    files: [],
    villageId: '',
    category: '',
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteActivityMutation.mutateAsync(activityData.id);
      setShowDeleteModal(false);
      handleBack();
    } catch (error) {
      console.error('Failed to delete activity:', error);
    }
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 3,
      }}
    >
      <Paper
        sx={{
          width: '100%',
          overflow: 'hidden',
          borderRadius: '16px',
          padding: '28px',
        }}
      >
        <Header
          breadcrumbs={breadcrumbs}
          activityData={activityData}
          handleBack={handleBack}
          villageName={villageName}
          category={category}
          handleDelete={() => {
            setShowDeleteModal(true);
          }}
          handleEdit={() => navigateToEdit(activityData)}
        />
      </Paper>

      {/* Activity Log Section */}
      <Paper
        sx={{
          width: '100%',
          overflow: 'hidden',
          borderRadius: '16px',
          padding: '28px',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            color: '#374151',
            mb: 3,
          }}
        >
          Documentation
        </Typography>

        <List sx={{ padding: 0 }}>
          {selectedActivity?.files.map((doc, index) => (
            <ListItem
              key={index}
              sx={{
                padding: '16px 0',
                borderBottom:
                  index < selectedActivity.files.length - 1
                    ? '1px solid #F3F4F6'
                    : 'none',
                alignItems: 'flex-start',
              }}
            >
              {/* <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                {doc.type === 'pdf' ? (
                  <FileText size={24} color="#EF4444" weight="fill" />
                ) : (
                  <File size={24} color="#F59E0B" weight="fill" />
                )}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 'medium', color: '#374151' }}
                  >
                    {doc.name}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {doc.date}
                  </Typography>
                }
              /> */}
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={showDeleteModal}
        onClose={handleDeleteCancel}
        onSecondaryButtonClick={handleDeleteCancel}
        onPrimaryButtonClick={() => {
          handleDeleteConfirm();
          handleBack();
        }}
        title="Delete Activity?"
        message={`Are you sure you want to delete "${selectedActivity?.activityName}"? This action cannot be undone.`}
        primaryButtonText={'Delete'}
        secondaryButtonText="Cancel"
      />
    </Box>
  );
};
