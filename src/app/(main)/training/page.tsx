'use client';

import DataTable from '@/components/DataTable/DataTable';
import { TrainingTable } from '@/types/training';
import {
  Paper,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  TuneOutlined,
  Close as CloseIcon,
} from '@mui/icons-material';
import React from 'react';
import { AddTrainingPage } from './AddTrainingPage/AddTrainingPage';
import { useTrainingPageImpl } from './useTrainingPageImpl';
import { DetailTrainingPage } from './DetailTrainingPage/DetailTrainingPage';
import { FilterModal } from './components/FilterModal';
import { PageEnum } from '@/constants/page';
import { trainingTypeOptions } from './constants';
import { ConfirmationModal } from '@/components';
import { useTrainingStore } from '@/stores';

const TrainingPage = () => {
  const { state, action } = useTrainingPageImpl();

  const {
    searchQuery,
    page,
    columns,
    trainings,
    error,
    isLoading,
    isFilterModalOpen,
    showDeleteModal,
    trainingToDelete,
    isDeleting,
    trainingOptions,
    trainingAssessmentThreshold,
    villageOptions,
    filters,
    pageSize,
    totalItems,
    currentPage,
  } = state;

  const {
    handleAddNew,
    setSearchQuery,
    handleOpenFilter,
    handleCloseFilter,
    handleDeleteCancel,
    handleDeleteConfirm,
    handlePageChange,
    handlePageSizeChange,
  } = action;

  // Helper function to get filter label
  const getFilterLabel = (filterType: string, filterValue: string) => {
    switch (filterType) {
      case 'trainingType':
        const trainingType = trainingTypeOptions.find(
          (type) => type.value === filterValue
        );
        return `Training Type: ${trainingType?.label || filterValue}`;
      case 'village':
        const village = villageOptions.find(
          (village) => village.value === filterValue
        );
        return `Village: ${village?.label || filterValue}`;
      case 'startDate':
        return `Start Date: ${new Date(filterValue).toLocaleDateString()}`;
      case 'endDate':
        return `End Date: ${new Date(filterValue).toLocaleDateString()}`;
      default:
        return filterValue;
    }
  };

  // You'll need to get removeFilter and clearFilters from your store
  // Add these to your useTrainingPageImpl hook or destructure them here
  const { removeFilter, clearFilters } = useTrainingStore();

  // Helper function to remove individual filter
  const handleRemoveFilter = (filterKey: string) => {
    removeFilter(filterKey as keyof typeof filters);
  };

  // Get active filters for display
  const getActiveFilters = () => {
    const activeFilters: Array<{ key: string; value: string; label: string }> =
      [];

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        activeFilters.push({
          key,
          value,
          label: getFilterLabel(key, value),
        });
      }
    });

    return activeFilters;
  };

  const activeFilters = getActiveFilters();

  // Only show error if there's an actual error and we're not loading
  if (error && !isLoading) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Failed to load training data. Please try again.
      </Alert>
    );
  }

  if (page === PageEnum.DETAIL) {
    return <DetailTrainingPage />;
  }

  if (page === PageEnum.ADD) {
    return (
      <AddTrainingPage
        trainingOptions={trainingOptions}
        trainingAssessmentThreshold={
          trainingAssessmentThreshold as number | null
        }
        villageOptions={villageOptions}
      />
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '16px' }}>
      {/* Header Section */}
      <Box sx={{ padding: '28px' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: '#374151',
              }}
            >
              Training Data
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: '#6B7280',
                fontSize: '18px',
              }}
            >
              This page shows a list of training programs.{' '}
              {isLoading ? 'Loading...' : `${totalItems} trainings found`}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              gap: '20px',
              alignItems: 'center',
              flexGrow: 1,
            }}
          >
            <TextField
              placeholder="Search trainings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                minWidth: 480,
                height: 60,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            <>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={
                  <TuneOutlined
                    sx={{
                      rotate: '90deg',
                    }}
                  />
                }
                onClick={handleOpenFilter}
                sx={{
                  minWidth: 120,
                  height: 54,
                  transform: 'translateY(-2px)',
                  '&.MuiButton-root': {
                    borderRadius: '12px',
                  },
                }}
              >
                Filter
              </Button>
            </>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddNew}
            startIcon={<AddIcon />}
            size="large"
            sx={{
              minWidth: 120,
              height: 54,
              transform: 'translateY(-2px)',
              '&.MuiButton-root': {
                borderRadius: '12px',
              },
            }}
          >
            Add New
          </Button>
        </Box>

        {/* Filter Chips Section */}
        {activeFilters.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography
              variant="body2"
              sx={{
                color: '#6B7280',
                mb: 1.5,
                fontWeight: 500,
              }}
            >
              Applied Filters:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {activeFilters.map((filter) => (
                <Chip
                  key={filter.key}
                  label={filter.label}
                  onDelete={() => handleRemoveFilter(filter.key)}
                  deleteIcon={<CloseIcon />}
                  sx={{
                    backgroundColor: '#EEF2FF',
                    color: '#3730A3',
                    border: '1px solid #C7D2FE',
                    borderRadius: '8px',
                    '& .MuiChip-deleteIcon': {
                      color: '#6366F1',
                      '&:hover': {
                        color: '#4F46E5',
                      },
                    },
                    '&:hover': {
                      backgroundColor: '#E0E7FF',
                    },
                  }}
                />
              ))}
              {activeFilters.length > 1 && (
                <Chip
                  label="Clear all"
                  onClick={() => clearFilters()}
                  sx={{
                    backgroundColor: '#FEF2F2',
                    color: '#991B1B',
                    border: '1px solid #FECACA',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#FEE2E2',
                    },
                  }}
                />
              )}
            </Box>
          </Box>
        )}
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DataTable<TrainingTable>
          data={trainings}
          columns={columns}
          title="Training Data"
          searchable={false}
          filterable={false}
          loading={isLoading}
          pageSize={pageSize}
          pageSizeOptions={[5, 10, 25, 50]}
          stickyHeader={true}
          maxHeight={600}
          manualPagination={true}
          totalItems={totalItems}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      {/* Filter Modal */}
      <FilterModal
        open={isFilterModalOpen}
        onClose={handleCloseFilter}
        trainingTypes={trainingTypeOptions}
        villages={villageOptions}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={showDeleteModal}
        onClose={handleDeleteCancel}
        onSecondaryButtonClick={handleDeleteCancel}
        onPrimaryButtonClick={handleDeleteConfirm}
        title="Delete Training?"
        message={`Are you sure you want to delete "${trainingToDelete?.trainingName}"? This action cannot be undone.`}
        primaryButtonText={isDeleting ? 'Deleting...' : 'Delete'}
        secondaryButtonText="Cancel"
      />
    </Paper>
  );
};

export default TrainingPage;
