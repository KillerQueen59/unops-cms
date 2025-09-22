'use client';

import DataTable from '@/components/DataTable/DataTable';
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
import { useActivityPageImpl } from './useActivityPageImpl';
import { ActivityTable } from '@/types/activity';
import { AddActivityPage } from './AddActivityPage/AddActivityPage';
import { DetailActivityPage } from './DetailActivityPage/DetailActivityPage';
import { FilterModal } from './components/FilterModal';
import { ConfirmationModal } from '@/components';
import { PageEnum } from '@/constants/page';

export default function ActivityPage() {
  const { state, action } = useActivityPageImpl();

  const {
    searchQuery,
    page,
    columns,
    activities,
    error,
    isLoading,
    isFilterModalOpen,
    showDeleteModal,
    activityToDelete,
    isDeleting,
  } = state;

  const {
    handleAddNew,
    setSearchQuery,
    handleOpenFilter,
    handleCloseFilter,
    handleApplyFilter,
    handleClearFilter,
    handleDeleteConfirm,
    handleDeleteCancel,
  } = action;

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Failed to load activity data. Please try again.
      </Alert>
    );
  }

  if (page === PageEnum.DETAIL) {
    return <DetailActivityPage />;
  }

  if (page === PageEnum.ADD || page === PageEnum.EDIT) {
    return <AddActivityPage />;
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
              Activity Data
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: '#6B7280',
                fontSize: '18px',
              }}
            >
              This page shows a list of activity programs.{' '}
              {isLoading
                ? 'Loading...'
                : `${activities.length} activities found`}
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
              placeholder="Search activities..."
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
        <DataTable<ActivityTable>
          data={activities.filter((activity) => {
            if (!searchQuery) return true;
            return activity.activityName
              .toLowerCase()
              .includes(searchQuery.toLowerCase());
          })}
          columns={columns}
          title="Activity Data"
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
        onApplyFilter={handleApplyFilter}
        onClearFilter={handleClearFilter}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={showDeleteModal}
        onClose={handleDeleteCancel}
        onSecondaryButtonClick={handleDeleteCancel}
        onPrimaryButtonClick={handleDeleteConfirm}
        title="Delete Activity?"
        message={`Are you sure you want to delete "${activityToDelete?.activityName}"? This action cannot be undone.`}
        primaryButtonText={isDeleting ? 'Deleting...' : 'Delete'}
        secondaryButtonText="Cancel"
      />
    </Paper>
  );
}
