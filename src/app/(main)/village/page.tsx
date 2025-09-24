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
  Chip,
} from '@mui/material';
import { ConfirmationModal } from '@/components';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Close as CloseIcon,
  TuneOutlined,
} from '@mui/icons-material';
import React from 'react';
import { useVillagePageImpl } from './useVillagePageImpl';
import { AddVillagePage } from './AddVillagePage/AddVillagePage';
import { DetailVillagePage } from './DetailVillagePage/DetailVillagePage';
import { CategorySelectionModal } from './components/CategorySelectionModal';
import { VillageTable } from '@/types/village';
import { PageEnum } from '@/constants/page';
import { useVillageStore } from '@/stores/villageStore';
import {
  VillageCategory,
  VillageCategoryLabel,
  villageCategoryOptions,
} from './constants';
import { FilterModal } from './components/FilterModal';

export default function VillagePage() {
  const { state, action } = useVillagePageImpl();

  const {
    searchQuery,
    page,
    columns,
    villages,
    error,
    isLoading,
    showCategoryModal,
    showDeleteModal,
    villageToDelete,
    isDeleting,
    totalItems,
    currentPage,
    pageSize,
    isFilterModalOpen,
    villageCategories,
  } = state;

  const {
    handleAddNew,
    setSearchQuery,
    handleCategorySelect,
    handleCloseCategoryModal,
    handleDeleteConfirm,
    handleDeleteCancel,
    handlePageChange,
    handlePageSizeChange,
    handleOpenFilter,
    handleCloseFilter,
  } = action;

  const { removeFilter, clearFilters } = useVillageStore();

  const getFilterLabel = (filterType: string, filterValue: string) => {
    switch (filterType) {
      case 'categoryId':
        return `Category: ${
          filterValue === VillageCategory.Category1
            ? VillageCategoryLabel.Category1
            : VillageCategoryLabel.Category2
        }`;

      default:
        return filterValue;
    }
  };

  // Helper function to remove individual filter
  const handleRemoveFilter = (filterKey: string) => {
    removeFilter(filterKey as 'categoryId');
  };

  // Get active filters for display
  const getActiveFilters = () => {
    const activeFilters: Array<{ key: string; value: string; label: string }> =
      [];

    Object.entries(state.filters || {}).forEach(([key, value]) => {
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

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Failed to load village data. Please try again.
      </Alert>
    );
  }

  if (page === PageEnum.DETAIL) {
    return <DetailVillagePage />;
  }

  if (page === PageEnum.ADD && villageCategories) {
    return <AddVillagePage villageCategories={villageCategories} />;
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
              Village Data
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: '#6B7280',
                fontSize: '18px',
              }}
            >
              This page shows a list of village programs.{' '}
              {isLoading ? 'Loading...' : `${villages.length} villages found`}
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
              placeholder="Search villages..."
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
        <DataTable<VillageTable>
          data={villages || []}
          columns={columns}
          title="Village Data"
          searchable={true}
          filterable={true}
          pageSize={pageSize}
          pageSizeOptions={[5, 10, 25, 50]}
          stickyHeader={true}
          maxHeight={600}
          externalGlobalFilter={searchQuery}
          setExternalGlobalFilter={setSearchQuery}
          // Server-side pagination props
          manualPagination={true}
          totalItems={totalItems}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          loading={isLoading}
        />
      )}

      {/* Category Selection Modal */}
      <CategorySelectionModal
        open={showCategoryModal}
        onClose={handleCloseCategoryModal}
        onConfirm={handleCategorySelect}
      />

      {/* Filter Modal */}
      <FilterModal open={isFilterModalOpen} onClose={handleCloseFilter} />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={showDeleteModal}
        onClose={handleDeleteCancel}
        onSecondaryButtonClick={handleDeleteCancel}
        onPrimaryButtonClick={handleDeleteConfirm}
        title="Delete Village?"
        message={`Are you sure you want to delete "${villageToDelete?.villageName}"? This action cannot be undone.`}
        primaryButtonText={isDeleting ? 'Deleting...' : 'Delete'}
        secondaryButtonText="Cancel"
      />
    </Paper>
  );
}
