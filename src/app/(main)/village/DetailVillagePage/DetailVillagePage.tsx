'use client';

import React from 'react';
import { Paper, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { useVillageStore } from '@/stores/villageStore';
import { MonthlyDataPerMonth } from './components/MonthlyDataPerMonth';
import { PageEnum } from '@/constants/page';
import { ConfirmationModal } from '@/components';
import { useDeleteVillage } from '@/hooks/useVillageData';

export const DetailVillagePage = () => {
  const {
    updateBreadcrumbs,
    setPage,
    navigateToEdit,
    selectedVillage,
    breadcrumbs,
  } = useVillageStore();
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const deleteVillageMutation = useDeleteVillage();

  useEffect(() => {
    updateBreadcrumbs(PageEnum.DETAIL, selectedVillage?.villageName);
  }, [updateBreadcrumbs]);

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleBack = () => {
    setPage(PageEnum.LIST);
    updateBreadcrumbs(PageEnum.LIST);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const villageData = selectedVillage || {
    id: '',
    villageName: 'Unknown Village',
    villageCode: 'N/A',
    villageCategory: 'N/A',
    totalPopulation: 0,
    villageLat: 0,
    villageLng: 0,
    landManageStart: 0,
    landManageEnd: 0,
    carbonEmisionStart: 0,
    carbonEmisionEnd: 0,
    potency: 'N/A',
    climateIssue: 'N/A',
    mainSourceOfEconomy: 'N/A',
    srnStatus: 'N/A',
    // Cat 1
    incomesStart: 0,
    incomesEnd: 0,
    unsustainableLandClearings: [],
    // Cat 2
    incomes: [],
    seedCapital: 0,
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteVillageMutation.mutateAsync(villageData.villageCode);
      setShowDeleteModal(false);
      handleBack();
    } catch (error) {
      console.error('Failed to delete village:', error);
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
          villageData={villageData}
          handleBack={handleBack}
          handleDelete={() => {
            setShowDeleteModal(true);
          }}
          handleEdit={() => navigateToEdit(villageData)}
        />
      </Paper>

      <MonthlyDataPerMonth
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={showDeleteModal}
        onClose={handleDeleteCancel}
        onSecondaryButtonClick={handleDeleteCancel}
        onPrimaryButtonClick={() => {
          handleDeleteConfirm();
          handleBack();
        }}
        title="Delete Village?"
        message={`Are you sure you want to delete "${villageData?.villageName}"? This action cannot be undone.`}
        primaryButtonText={'Delete'}
        secondaryButtonText="Cancel"
      />
    </Box>
  );
};
