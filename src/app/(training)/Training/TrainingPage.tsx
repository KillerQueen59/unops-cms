import DataTable from '@/components/DataTable/DataTable';
import { TrainingData, TrainingTable } from '@/types/training';
import { createTrainingColumns } from './TrainingColumn';
import { TrainingPageEnum, useTrainingStore } from '@/stores/trainingStore';
import { useTrainings } from '@/hooks/useTrainingData';
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
import React, { useEffect } from 'react';
import { AddTrainingPage } from './AddTrainingPage/AddTrainingPage';
import { TrainingDetailPage } from './TrainingDetailPage/TrainingDetailPage';

export const TrainingPage = () => {
  const {
    searchQuery,
    page,
    setSearchQuery,
    updateBreadcrumbs,
    setPage,
    navigateToDetail,
    navigateToEdit,
    resetTraining,
  } = useTrainingStore();

  // React Query for server state
  const { data: trainings = [], isLoading, error } = useTrainings();

  // Initialize breadcrumbs when component mounts
  useEffect(() => {
    if (page === TrainingPageEnum.LIST) {
      updateBreadcrumbs(TrainingPageEnum.LIST);
    }
  }, [page, updateBreadcrumbs]);

  const handleView = (data: TrainingData) => {
    navigateToDetail(data);
  };

  const handleEdit = (data: TrainingData) => {
    navigateToEdit(data);
  };

  const handleAddNew = () => {
    resetTraining();
    setPage(TrainingPageEnum.ADD);
    updateBreadcrumbs(TrainingPageEnum.ADD);
  };

  const handleDelete = (data: TrainingData) => {
    console.log('Delete:', data);
  };

  const columns = createTrainingColumns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Failed to load training data. Please try again.
      </Alert>
    );
  }

  if (page === TrainingPageEnum.DETAIL) {
    return <TrainingDetailPage />;
  }

  if (page === TrainingPageEnum.ADD) {
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
          data={trainings.filter((training) => {
            if (!searchQuery) return true;
            return (
              training.trainingName
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              training.trainingType
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              training.village.toLowerCase().includes(searchQuery.toLowerCase())
            );
          })}
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
    </Paper>
  );
};
