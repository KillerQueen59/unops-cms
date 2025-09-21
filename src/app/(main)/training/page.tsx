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
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  TuneOutlined,
} from '@mui/icons-material';
import React from 'react';
import { AddTrainingPage } from './AddTrainingPage/AddTrainingPage';
import { useTrainingPageImpl } from './useTrainingPageImpl';
import { DetailTrainingPage } from './DetailTrainingPage/DetailTrainingPage';
import { FilterModal } from './components/FilterModal';
import { PageEnum } from '@/constants/page';
import { trainingTypeOptions } from './constants';
import { ConfirmationModal } from '@/components';

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
  } = state;

  const {
    handleAddNew,
    setSearchQuery,
    handleOpenFilter,
    handleCloseFilter,
    handleDeleteCancel,
    handleDeleteConfirm,
  } = action;

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
    return <AddTrainingPage />;
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
              {isLoading ? 'Loading...' : `${trainings.length} trainings found`}
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
          searchable={true}
          filterable={true}
          pageSize={10}
          pageSizeOptions={[5, 10, 25, 50]}
          stickyHeader={true}
          maxHeight={600}
          externalGlobalFilter={searchQuery}
          setExternalGlobalFilter={setSearchQuery}
        />
      )}

      {/* Filter Modal */}
      <FilterModal
        open={isFilterModalOpen}
        onClose={handleCloseFilter}
        trainingTypes={trainingTypeOptions.map((option) => option.label)}
        villages={[]}
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
