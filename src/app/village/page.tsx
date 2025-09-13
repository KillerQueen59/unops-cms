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
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import React from 'react';
import { useVillagePageImpl } from './useVillagePageImpl';
import { AddVillagePage } from './AddVillagePage/AddVillagePage';
import { DetailVillagePage } from './DetailVillagePage/DetailVillagePage';
import { CategorySelectionModal } from './components/CategorySelectionModal';
import { VillageTable } from '@/types/village';
import { PageEnum } from '@/constants/page';

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
  } = state;

  const {
    handleAddNew,
    setSearchQuery,
    handleCategorySelect,
    handleCloseCategoryModal,
  } = action;

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

  if (page === PageEnum.ADD) {
    return <AddVillagePage />;
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
        <DataTable<VillageTable>
          data={villages.filter((village) => {
            if (!searchQuery) return true;
            return (
              village.villageName
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              village.villageCode
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            );
          })}
          columns={columns}
          title="Village Data"
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

      {/* Category Selection Modal */}
      <CategorySelectionModal
        open={showCategoryModal}
        onClose={handleCloseCategoryModal}
        onConfirm={handleCategorySelect}
      />
    </Paper>
  );
}
