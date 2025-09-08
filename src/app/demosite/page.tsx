'use client';

import {
  Paper,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  CircularProgress,
  Alert,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  TuneOutlined,
} from '@mui/icons-material';
import React, { useEffect } from 'react';

import { useDemositePageImpl } from './useDemositePageImpl';
import { ListCard } from './components/ListCard';
import { DemositePageEnum } from '@/stores/demositeStore';
import { AddDemositePage } from './AddDemositePage/AddDemositePage';
import { EditDemositePage } from './EditDemositePage/EditDemositePage';
import { DetailDemositePage } from './DetailDemositePage/DetailDemositePage';

export default function DemositePage() {
  const { state, action } = useDemositePageImpl();

  const {
    searchQuery,
    demosites,
    error,
    isLoading,
    currentPage,
    itemsPerPage,
    page,
  } = state;

  const {
    handleAddNew,
    handleView,
    handleEdit,
    handleDelete,
    setSearchQuery,
    setCurrentPage,
    setItemsPerPage,
  } = action;

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, setCurrentPage]);

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Failed to load demosite data. Please try again.
      </Alert>
    );
  }

  // Page navigation
  if (page === DemositePageEnum.ADD) {
    return <AddDemositePage />;
  }

  if (page === DemositePageEnum.EDIT) {
    return <EditDemositePage />;
  }

  if (page === DemositePageEnum.DETAIL) {
    return <DetailDemositePage />;
  }

  const filteredDemosites = demosites.filter((demosite) => {
    if (!searchQuery) return true;
    return (
      demosite.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      demosite.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      demosite.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Pagination calculations
  const totalItems = filteredDemosites.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDemosites = filteredDemosites.slice(startIndex, endIndex);

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
              Demosite Data
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: '#6B7280',
                fontSize: '18px',
              }}
            >
              This page shows a list of demosite programs.{' '}
              {isLoading
                ? 'Loading...'
                : `Showing ${Math.min(startIndex + 1, totalItems)} to ${Math.min(endIndex, totalItems)} of ${totalItems} demosites`}
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
              placeholder="Search demosites..."
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
                onClick={() => {
                  // Handle filter button click
                }}
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
            variant="outlined"
            color="primary"
            onClick={() => {
              console.log('Do Others');
            }}
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
            Pick Top 10
          </Button>
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

      {/* Grid Content */}
      <Box sx={{ padding: '0 28px 28px' }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
              gap: 3,
            }}
          >
            {paginatedDemosites.map((demosite) => (
              <ListCard
                key={demosite.id}
                demosite={demosite}
                handleView={handleView}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            ))}
          </Box>
        )}

        {/* Empty State */}
        {!isLoading && filteredDemosites.length === 0 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 8,
            }}
          >
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              No demosites found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchQuery
                ? 'Try adjusting your search criteria'
                : 'Start by adding your first demosite'}
            </Typography>
          </Box>
        )}

        {/* Custom Footer - Match DataTable Style */}
        {!isLoading && filteredDemosites.length > 0 && (
          <Box
            sx={{
              backgroundColor: 'common.white',
              padding: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              marginTop: '40px',
            }}
          >
            {/* Footer Text */}
            <Box
              sx={{
                fontSize: 14,
                height: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
              }}
            >
              <Typography variant="body2">
                Showing{' '}
                <Box
                  component="span"
                  sx={{ color: 'primary.main', fontWeight: 'bold' }}
                >
                  {Math.min(startIndex + 1, totalItems)} to{' '}
                  {Math.min(endIndex, totalItems)}
                </Box>{' '}
                of {totalItems} items.
              </Typography>
              <FormControl size="small" variant="outlined">
                <InputLabel>Rows per page</InputLabel>
                <Select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  label="Rows per page"
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value={8}>8</MenuItem>
                  <MenuItem value={12}>12</MenuItem>
                  <MenuItem value={16}>16</MenuItem>
                  <MenuItem value={24}>24</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Pagination Container */}
            <Box sx={{ padding: 1 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, page) => setCurrentPage(page)}
                shape="rounded"
                color="primary"
                siblingCount={1}
                boundaryCount={1}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
