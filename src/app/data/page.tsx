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
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import React from 'react';
import { useDataPageImpl } from './useDataPageImpl';
import { DataTable as DataTableType } from '@/types/data';
import { UploadModal } from './components/UploadModal';
import { PreviewModal } from './components/PreviewModal';

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
  } = state;

  const { handleUpload, setSearchQuery, closeUploadModal, closePreviewModal } =
    action;

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
                This page shows a list of{' '}
                {isLoading ? 'Loading...' : `${dataFiles.length} files found`}
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
    </>
  );
}
