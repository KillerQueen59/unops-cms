'use client';

import {
  Typography,
  Box,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useVillageStore } from '@/stores/villageStore';
import { IncomeModal } from './IncomeModal';
import { useState } from 'react';
import {
  useIncomeTrackingData,
  useAddIncomeTrackingData,
  useUpdateIncomeTrackingData,
  useDeleteIncomeTrackingData,
} from '@/hooks/useVillageData';
import {
  IncomeTrackingData,
  CreateIncomeRequest,
} from '@/services/villageService';

interface DisplayIncomeData {
  _id?: string;
  id: undefined;
  villageId: string;
  month: string;
  date: string;
  amount: number;
  trend: string;
}
import { ConfirmationModal } from '@/components';

const IncomeReport = ({
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
    amount: number;
  } | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DisplayIncomeData | null>(
    null
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // API queries and mutations
  const {
    data: apiResponse,
    isLoading,
    error,
  } = useIncomeTrackingData({
    page: 1,
    pageSize: 10,
    search: selectedVillage?.villageCode,
    sortBy: 'month',
  });

  const addMutation = useAddIncomeTrackingData();
  const updateMutation = useUpdateIncomeTrackingData();
  const deleteMutation = useDeleteIncomeTrackingData();

  // Transform API data to display format
  const incomeData =
    apiResponse?.data.incomes?.map((item: IncomeTrackingData) => {
      // Convert "MM-YYYY" format to "Month YYYY" format for display
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
        id: undefined, // Keep for compatibility
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
        amount: item.count,
        trend: 'up',
      };
    }) || [];

  const handleAddData = () => {
    setIsEditMode(false);
    setEditingData(null);
    setShowModal(true);
  };

  const handleEditData = (data: {
    _id?: string;
    month: string;
    amount: number;
  }) => {
    // Transform display data to modal format
    const [monthName, year] = data.month.split(' ');
    setEditingData({
      id: data._id,
      month: monthName,
      year: year,
      amount: data.amount,
    });
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleDeleteData = (data: DisplayIncomeData) => {
    setSelectedItem(data);
    setShowDeleteModal(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setSelectedItem(null);
  };

  const handleDeleteConfirm = () => {
    if (selectedItem?._id) {
      deleteMutation.mutate(selectedItem._id);
      setShowDeleteModal(false);
      setSelectedItem(null);
    }
  };

  const handleSaveData = (data: {
    month: string;
    year: string;
    amount: number;
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

    const payload: CreateIncomeRequest = {
      villageId: selectedVillage.villageCode,
      month: monthString,
      income: data.amount,
    };

    if (isEditMode && editingData?.id) {
      updateMutation.mutate({
        incomeId: editingData.id,
        data: payload,
      });
    } else {
      addMutation.mutate(payload);
    }

    setShowModal(false);
  };

  const getExistingEntries = () => {
    return incomeData.map((item) => {
      const [month, year] = item.month.split(' ');
      return { month, year };
    });
  };

  const filteredData = incomeData.filter((item) =>
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
        <Alert severity="error">Failed to load income data</Alert>
      </Box>
    );
  }

  const formatCurrency = (amount: number) => {
    return `IDR ${amount.toLocaleString('id-ID')}`;
  };

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
        Monthly Income Report
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
              <Typography
                variant="body2"
                sx={{
                  color: '#6B7280',
                  fontSize: '14px',
                }}
              >
                {item.date}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: '#3B82F6',
                  fontSize: '24px',
                }}
              >
                {formatCurrency(item?.amount ?? 0)}
              </Typography>
              <Box
                sx={{
                  color: item.trend === 'up' ? '#10B981' : '#EF4444',
                  fontSize: '16px',
                }}
              >
                {item.trend === 'up' ? '↗' : '↘'}
              </Box>
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
                  onClick={() => handleDeleteData(item)}
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

      {/* Income Modal */}
      <IncomeModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveData}
        existingData={
          editingData
            ? {
                id: 0, // Convert string id to number for modal compatibility
                month: editingData.month,
                year: editingData.year,
                amount: editingData.amount,
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
        onPrimaryButtonClick={handleDeleteConfirm}
        title="Delete Income Data?"
        message={`Are you sure you want to delete income data for ${selectedItem?.month}? This action cannot be undone.`}
        primaryButtonText={'Delete'}
        secondaryButtonText="Cancel"
      />
    </>
  );
};

export default IncomeReport;
