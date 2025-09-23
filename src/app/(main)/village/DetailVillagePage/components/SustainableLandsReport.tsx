'use client';

import {
  Typography,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useState } from 'react';
import { SustainableLandsModal } from './SustainableLandsModal';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useVillageStore } from '@/stores/villageStore';
import {
  useUnsustainableLandData,
  useAddUnsustainableLandData,
  useUpdateUnsustainableLandData,
  useDeleteUnsustainableLandData,
} from '@/hooks/useVillageData';
import {
  CreateMonthlyDataRequest,
  MonthlyData,
} from '@/services/villageService';
import { ConfirmationModal } from '@/components';

const SustainableLandsReport = ({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}) => {
  const { selectedVillage } = useVillageStore();
  const [showModal, setShowModal] = useState(false);
  const [editingData, setEditingData] = useState<{
    id?: string;
    month: string;
    year: string;
    count: number;
  } | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MonthlyData | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // API queries and mutations
  const {
    data: apiResponse,
    isLoading,
    error,
  } = useUnsustainableLandData({
    page: 1,
    pageSize: 10,
    search: selectedVillage?.villageCode,
    sortBy: 'month',
  });

  const addMutation = useAddUnsustainableLandData();
  const updateMutation = useUpdateUnsustainableLandData();
  const deleteMutation = useDeleteUnsustainableLandData();

  // Transform API data to display format
  const sustainableLandsData: MonthlyData[] =
    apiResponse?.data.unsustainableLands?.map((item: MonthlyData) => {
      const [monthNum, year] = item.month.split('-');
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      const monthName = monthNames[parseInt(monthNum) - 1];

      return {
        _id: item._id,
        id: undefined,
        villageId: item.villageId,
        month: `${monthName} ${year}`,
        date: new Date()
          .toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
          .replace(/,/g, ''),
        count: item.count,
      };
    }) || [];

  const handleAddData = () => {
    setIsEditMode(false);
    setEditingData(null);
    setShowModal(true);
  };

  const handleEditData = (data: MonthlyData) => {
    const [monthName, year] = data.month.split(' ');
    setEditingData({
      id: data._id,
      month: monthName,
      year: year,
      count: data.count,
    });
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleDeleteData = (data: MonthlyData) => {
    if (data._id && confirm('Are you sure you want to delete this entry?')) {
      deleteMutation.mutate(data._id);
    }
  };

  const handleSaveData = (data: {
    month: string;
    year: string;
    count: number;
  }) => {
    if (!selectedVillage?.villageCode) return;

    // Convert month name to number
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const monthNum = (monthNames.indexOf(data.month) + 1)
      .toString()
      .padStart(2, '0');
    const monthString = `${monthNum}-${data.year}`;

    const payload: CreateMonthlyDataRequest = {
      villageId: selectedVillage.villageCode,
      month: monthString,
      count: data.count,
    };

    if (isEditMode && editingData?.id) {
      updateMutation.mutate({
        unsustainableLandId: editingData.id,
        data: payload,
      });
    } else {
      addMutation.mutate(payload);
    }

    setShowModal(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setSelectedItem(null);
  };

  const getExistingEntries = () => {
    return sustainableLandsData.map((item) => {
      const [month, year] = item.month.split(' ');
      return { month, year };
    });
  };

  const filteredData = sustainableLandsData.filter((item) =>
    item.month.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show loading state
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">Failed to load sustainable lands data</Alert>
      </Box>
    );
  }

  return (
    <>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: '#1F2937',
          mb: 3,
          fontSize: '18px',
        }}
      >
        Monthly Sustainable Lands Report
      </Typography>

      {/* Show mutation errors */}
      {(addMutation.error || updateMutation.error || deleteMutation.error) && (
        <Box sx={{ mb: 2 }}>
          <Alert severity="error">
            {addMutation.error?.message ||
              updateMutation.error?.message ||
              deleteMutation.error?.message ||
              'An error occurred'}
          </Alert>
        </Box>
      )}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <TextField
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: 300,
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon sx={{ color: '#9CA3AF' }} />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddData}
          disabled={addMutation.isPending}
          sx={{
            backgroundColor: '#0EA5E9',
            '&:hover': {
              backgroundColor: '#0284C7',
            },
            minWidth: 180,
            height: 54,
            borderRadius: '12px',
          }}
        >
          {addMutation.isPending ? 'Adding...' : 'Add Data for This Month'}
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filteredData.map((item) => (
          <Box
            key={item.id}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 3,
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              backgroundColor: '#FAFAFA',
              '&:hover': {
                backgroundColor: '#F3F4F6',
              },
            }}
          >
            <Box>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  color: '#1F2937',
                  mb: 0.5,
                }}
              >
                {item.month}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#3B82F6',
                  fontSize: '32px',
                }}
              >
                {item.count}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  onClick={() => handleEditData(item)}
                  disabled={
                    updateMutation.isPending || deleteMutation.isPending
                  }
                  sx={{
                    color: '#6B7280',
                    '&:hover': {
                      color: '#374151',
                      backgroundColor: '#F3F4F6',
                    },
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => {
                    setSelectedItem(item);
                    setShowDeleteModal(true);
                  }}
                  disabled={
                    updateMutation.isPending || deleteMutation.isPending
                  }
                  sx={{
                    color: '#6B7280',
                    '&:hover': {
                      color: '#EF4444',
                      backgroundColor: '#FEF2F2',
                    },
                  }}
                >
                  {deleteMutation.isPending &&
                  deleteMutation.variables === item._id ? (
                    <CircularProgress size={20} />
                  ) : (
                    <DeleteIcon />
                  )}
                </IconButton>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Sustainable Lands Modal */}
      <SustainableLandsModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveData}
        existingData={
          editingData
            ? {
                id: 0,
                month: editingData.month,
                year: editingData.year,
                count: editingData.count,
              }
            : undefined
        }
        existingEntries={getExistingEntries()}
        isEdit={isEditMode}
      />
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={showDeleteModal}
        onClose={handleDeleteCancel}
        onSecondaryButtonClick={handleDeleteCancel}
        onPrimaryButtonClick={() => {
          handleDeleteData(selectedItem!);
        }}
        title="Delete Unsustainable Data?"
        message={`Are you sure you want to delete data on ${selectedItem?.month}? This action cannot be undone.`}
        primaryButtonText={'Delete'}
        secondaryButtonText="Cancel"
      />
    </>
  );
};
export default SustainableLandsReport;
