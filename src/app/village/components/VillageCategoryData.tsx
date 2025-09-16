import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {
  useUnsustainableLandData,
  useAddUnsustainableLandData,
  useUpdateUnsustainableLandData,
  useDeleteUnsustainableLandData,
  useIncomeTrackingData,
  useAddIncomeTrackingData,
  useUpdateIncomeTrackingData,
  useDeleteIncomeTrackingData,
} from '@/hooks/useVillageData';
import { UnsustainableLandData, IncomeTrackingData } from '@/services/villageService';

interface VillageCategoryDataProps {
  villageId: string;
  category: string; // 'Category 1' or 'Category 2'
}

const months = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

export const VillageCategoryData: React.FC<VillageCategoryDataProps> = ({
  villageId,
  category,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<UnsustainableLandData | IncomeTrackingData | null>(null);
  const [formData, setFormData] = useState({
    month: 1,
    year: new Date().getFullYear(),
    value: 0,
  });

  const isCategory1 = category === 'Category 1';
  const isCategory2 = category === 'Category 2';

  // Category 1: Unsustainable Land Data hooks
  const {
    data: unsustainableLandData = [],
    isLoading: loadingUnsustainable,
    error: unsustainableError,
  } = useUnsustainableLandData();

  const addUnsustainableMutation = useAddUnsustainableLandData();
  const updateUnsustainableMutation = useUpdateUnsustainableLandData();
  const deleteUnsustainableMutation = useDeleteUnsustainableLandData();

  // Category 2: Income Tracking Data hooks
  const {
    data: incomeData = [],
    isLoading: loadingIncome,
    error: incomeError,
  } = useIncomeTrackingData();

  const addIncomeMutation = useAddIncomeTrackingData();
  const updateIncomeMutation = useUpdateIncomeTrackingData();
  const deleteIncomeMutation = useDeleteIncomeTrackingData();

  // Handlers for Unsustainable Land Data (Category 1)
  const handleAddUnsustainableData = async () => {
    if (!isCategory1) return;

    const newData: UnsustainableLandData = {
      villageId,
      month: formData.month,
      year: formData.year,
      unsustainableLand: formData.value,
    };

    try {
      await addUnsustainableMutation.mutateAsync(newData);
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to add unsustainable land data:', error);
    }
  };

  const handleUpdateUnsustainableData = async () => {
    if (!isCategory1 || !editingItem) return;

    const updatedData = {
      unsustainableLand: formData.value,
    };

    if (!editingItem.id) return;
    
    try {
      await updateUnsustainableMutation.mutateAsync({
        unsustainableLandId: editingItem.id,
        data: updatedData,
      });
      setEditingItem(null);
      resetForm();
    } catch (error) {
      console.error('Failed to update unsustainable land data:', error);
    }
  };

  const handleDeleteUnsustainableData = async (itemId: string) => {
    if (!isCategory1) return;

    try {
      await deleteUnsustainableMutation.mutateAsync(itemId);
    } catch (error) {
      console.error('Failed to delete unsustainable land data:', error);
    }
  };

  // Handlers for Income Tracking Data (Category 2)
  const handleAddIncomeData = async () => {
    if (!isCategory2) return;

    const newData: IncomeTrackingData = {
      villageId,
      month: formData.month,
      year: formData.year,
      income: formData.value,
    };

    try {
      await addIncomeMutation.mutateAsync(newData);
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to add income data:', error);
    }
  };

  const handleUpdateIncomeData = async () => {
    if (!isCategory2 || !editingItem) return;

    const updatedData = {
      income: formData.value,
    };

    if (!editingItem.id) return;
    
    try {
      await updateIncomeMutation.mutateAsync({
        incomeId: editingItem.id,
        data: updatedData,
      });
      setEditingItem(null);
      resetForm();
    } catch (error) {
      console.error('Failed to update income data:', error);
    }
  };

  const handleDeleteIncomeData = async (itemId: string) => {
    if (!isCategory2) return;

    try {
      await deleteIncomeMutation.mutateAsync(itemId);
    } catch (error) {
      console.error('Failed to delete income data:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      month: 1,
      year: new Date().getFullYear(),
      value: 0,
    });
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (item: UnsustainableLandData | IncomeTrackingData) => {
    setEditingItem(item);
    setFormData({
      month: item.month,
      year: item.year,
      value: isCategory1 ? (item as UnsustainableLandData).unsustainableLand : (item as IncomeTrackingData).income,
    });
  };

  const handleSave = () => {
    if (editingItem) {
      if (isCategory1) {
        handleUpdateUnsustainableData();
      } else {
        handleUpdateIncomeData();
      }
    } else {
      if (isCategory1) {
        handleAddUnsustainableData();
      } else {
        handleAddIncomeData();
      }
    }
  };

  // Loading states
  if (loadingUnsustainable || loadingIncome) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  // Error states
  if (unsustainableError || incomeError) {
    return (
      <Alert severity="error">
        Failed to load data: {unsustainableError?.message || incomeError?.message}
      </Alert>
    );
  }

  const currentData = isCategory1 ? unsustainableLandData : incomeData;
  const title = isCategory1 ? '🌱 Monthly Unsustainable Land Clearings' : '💰 Monthly Income Tracking';

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">{title}</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openAddModal}
          disabled={addUnsustainableMutation.isPending || addIncomeMutation.isPending}
        >
          Add New Data
        </Button>
      </Box>

      <Grid container spacing={2}>
        {currentData.map((item: UnsustainableLandData | IncomeTrackingData, index: number) => {
          const monthLabel = months.find(m => m.value === item.month)?.label || `Month ${item.month}`;
          const value = isCategory1 ? (item as UnsustainableLandData).unsustainableLand : (item as IncomeTrackingData).income;
          const unit = isCategory1 ? 'hectares' : 'Rp';
          const displayValue = isCategory1 ? value : value.toLocaleString();
          
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id || index}>
              <Card>
                <CardContent>
                  <Typography variant="h6">
                    {monthLabel} {item.year}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {isCategory1 ? 'Land Clearings' : 'Income'}: {unit} {displayValue}
                  </Typography>
                  <Chip 
                    label={
                      isCategory1 
                        ? (value > 0 ? 'Action Needed' : 'Good')
                        : (value > 1000000 ? 'Good Income' : 'Low Income')
                    } 
                    color={
                      isCategory1
                        ? (value > 0 ? 'error' : 'success')
                        : (value > 1000000 ? 'success' : 'warning')
                    } 
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => openEditModal(item)}
                    disabled={updateUnsustainableMutation.isPending || updateIncomeMutation.isPending}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => item.id && (isCategory1 ? handleDeleteUnsustainableData(item.id) : handleDeleteIncomeData(item.id))}
                    disabled={deleteUnsustainableMutation.isPending || deleteIncomeMutation.isPending}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {currentData.length === 0 && (
        <Alert severity="info">
          No {isCategory1 ? 'unsustainable land' : 'income tracking'} data recorded yet. Click &quot;Add New Data&quot; to get started.
        </Alert>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={showAddModal || !!editingItem} onClose={() => { setShowAddModal(false); setEditingItem(null); }} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingItem ? 'Edit' : 'Add New'} {isCategory1 ? 'Unsustainable Land' : 'Income'} Data
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              select
              label="Month"
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: Number(e.target.value) })}
              fullWidth
            >
              {months.map((month) => (
                <MenuItem key={month.value} value={month.value}>
                  {month.label}
                </MenuItem>
              ))}
            </TextField>
            
            <TextField
              label="Year"
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
              fullWidth
            />
            
            <TextField
              label={isCategory1 ? 'Unsustainable Land (hectares)' : 'Income (Rupiah)'}
              type="number"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setShowAddModal(false); setEditingItem(null); }}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained"
            disabled={addUnsustainableMutation.isPending || addIncomeMutation.isPending || updateUnsustainableMutation.isPending || updateIncomeMutation.isPending}
          >
            {editingItem ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
