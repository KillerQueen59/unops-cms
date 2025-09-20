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
} from '@mui/material';
import {
  Search as SearchIcon,
  CloudUpload as CloudUploadIcon,
  Tune as FilterIcon,
} from '@mui/icons-material';
import React from 'react';
import { useDataPageImpl } from './useDataPageImpl';
import { DataTable as DataTableType } from '@/types/data';
import { UploadModal } from './components/UploadModal';
import { PreviewModal } from './components/PreviewModal';
import { ConfirmationModal } from '@/components';

export default function DataPage() {
  const { state, action } = useDataPageImpl();

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
    setGroupBy,
    setIsGrouped,
    closeUploadModal,
    closePreviewModal,
    handleDeleteConfirm,
    handleDeleteCancel,
  } = action;

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

              {/* Category Filter Toggle */}
              <ToggleButtonGroup
                value={groupBy}
                exclusive
                onChange={(_, newValue) => {
                  if (newValue !== null) {
                    setGroupBy(newValue);
                    setIsGrouped(true);
                  }
                }}
                sx={{
                  height: 54,
                  '& .MuiToggleButton-root': {
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 500,
                    px: 3,
                    '&.Mui-selected': {
                      backgroundColor: '#0EA5E9',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#0284C7',
                      },
                    },
                  },
                }}
              >
                <ToggleButton
                  value="regency"
                  sx={{ borderRadius: '8px 0 0 8px !important' }}
                >
                  <FilterIcon sx={{ mr: 1 }} />
                  Regency
                </ToggleButton>
                <ToggleButton
                  value="other"
                  sx={{ borderRadius: '0 8px 8px 0 !important' }}
                >
                  Other
                </ToggleButton>
              </ToggleButtonGroup>

              {/* Show All Button */}
              <Button
                variant="outlined"
                onClick={() => setIsGrouped(false)}
                sx={{
                  height: 54,
                  minWidth: 100,
                  borderColor: '#D1D5DB',
                  color: '#6B7280',
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    borderColor: '#9CA3AF',
                    backgroundColor: '#F9FAFB',
                  },
                }}
              >
                Show All
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

      {/* Upload Modal */}
      <UploadModal open={isUploadModalOpen} onClose={closeUploadModal} />

      {/* Preview Modal */}
      <PreviewModal
        open={isPreviewModalOpen}
        onClose={closePreviewModal}
        file={previewFile}
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
