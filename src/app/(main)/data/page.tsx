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
  ToggleButton,
  ToggleButtonGroup,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  CloudUpload as CloudUploadIcon,
  Tune as FilterIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import React, { useState } from 'react';
import { useDataPageImpl } from './useDataPageImpl';
import { DataTable as DataTableType } from '@/types/data';
import { UploadModal } from './components/UploadModal';
import { PreviewModal } from './components/PreviewModal';
import { FilterModal } from './components/FilterModal'; // Import the FilterModal
import { ConfirmationModal } from '@/components';
import { useDataStore } from '@/stores/dataStore';

export default function DataPage() {
  const { state, action } = useDataPageImpl();
  const { filters, clearFilters, removeFilter } = useDataStore();

  // Local state for FilterModal
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const {
    searchQuery,
    columns,
    dataFiles,
    error,
    isLoading,
    isUploadModalOpen,
    isPreviewModalOpen,
    previewFile,
    groupBy,
    isGrouped,
    isDeleting,
    showDeleteModal,
    selectedData,
  } = state;

  const {
    handleUpload,
    setSearchQuery,
    setIsGrouped,
    closeUploadModal,
    closePreviewModal,
    handleDeleteConfirm,
    handleDeleteCancel,
    handleDownload,
  } = action;

  // Check if we have any active filters
  const hasActiveFilters = filters.area;

  // Create active filter labels
  const getActiveFilterLabels = () => {
    const labels = [];

    if (filters.area === 'others') {
      labels.push({ key: 'area', label: 'Others' });
    } else {
      labels.push({ key: 'area', label: `Area: ${filters.area}` });
    }

    return labels;
  };

  const handleRemoveFilter = () => {
    removeFilter('area');
  };

  const handleClearAllFilters = () => {
    clearFilters();
    setIsGrouped(false);
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Failed to load data files. Please try again.
      </Alert>
    );
  }

  return (
    <>
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
                File Download
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  color: '#6B7280',
                  fontSize: '18px',
                }}
              >
                {isLoading ? (
                  'Loading...'
                ) : (
                  <>
                    This page shows {dataFiles.length} files
                    {isGrouped &&
                      ` (${groupBy === 'regency' ? 'Regency' : 'Other'} files only)`}
                  </>
                )}
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
                placeholder="Search files..."
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

              {/* Advanced Filter Button */}
              <Button
                variant="outlined"
                onClick={() => setIsFilterModalOpen(true)}
                startIcon={<FilterIcon />}
                sx={{
                  height: 54,
                  minWidth: 140,
                  borderColor: '#D1D5DB',
                  color: '#374151',
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    borderColor: '#9CA3AF',
                    backgroundColor: '#F9FAFB',
                  },
                }}
              >
                Filter
              </Button>
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              startIcon={<CloudUploadIcon />}
              size="large"
              sx={{
                minWidth: 140,
                height: 54,
                transform: 'translateY(-2px)',
                '&.MuiButton-root': {
                  borderRadius: '12px',
                },
                backgroundColor: '#0EA5E9',
                '&:hover': {
                  backgroundColor: '#0284C7',
                },
              }}
            >
              Upload File
            </Button>
          </Box>

          {/* Active Filters Section */}
          {hasActiveFilters && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mt: 3,
                p: 2,
                backgroundColor: '#F8FAFC',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: '#475569',
                  minWidth: 'auto',
                }}
              >
                Active Filters:
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {getActiveFilterLabels().map((filter) => (
                  <Chip
                    key={filter.key}
                    label={filter.label}
                    onDelete={() => handleRemoveFilter()}
                    deleteIcon={<CloseIcon />}
                    size="small"
                    sx={{
                      backgroundColor: '#0EA5E9',
                      color: 'white',
                      fontWeight: 500,
                      '& .MuiChip-deleteIcon': {
                        color: 'white',
                        '&:hover': {
                          color: '#F1F5F9',
                        },
                      },
                    }}
                  />
                ))}
              </Box>

              <Button
                variant="text"
                onClick={handleClearAllFilters}
                sx={{
                  color: '#6B7280',
                  textTransform: 'none',
                  fontWeight: 500,
                  minWidth: 'auto',
                  p: 1,
                  '&:hover': {
                    backgroundColor: '#E2E8F0',
                  },
                }}
              >
                Clear All
              </Button>
            </Box>
          )}
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataTable<DataTableType>
            data={dataFiles}
            columns={columns}
            title="File Download"
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
      </Paper>

      {/* Filter Modal */}
      <FilterModal
        open={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />

      {/* Upload Modal */}
      <UploadModal open={isUploadModalOpen} onClose={closeUploadModal} />

      {/* Preview Modal */}
      <PreviewModal
        open={isPreviewModalOpen}
        onClose={closePreviewModal}
        file={previewFile}
        handleDownload={handleDownload}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={showDeleteModal}
        onClose={handleDeleteCancel}
        onSecondaryButtonClick={handleDeleteCancel}
        onPrimaryButtonClick={handleDeleteConfirm}
        title="Delete Document?"
        message={`Are you sure you want to delete "${selectedData?.documentName}"? This action cannot be undone.`}
        primaryButtonText={isDeleting ? 'Deleting...' : 'Delete'}
        secondaryButtonText="Cancel"
      />
    </>
  );
}
