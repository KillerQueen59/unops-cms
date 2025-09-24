'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { DisplayIncomeData } from './IncomeReport';
import { IncomeModal } from './IncomeModal';
import { ConfirmationModal } from '@/components';
import CurrencyInputField from '@/components/CurrencyInputField';

interface MonthlyIncomeModalProps {
  open: boolean;
  onClose: () => void;
  monthData: {
    month: string;
    rawMonth: string;
    totalAmount: number;
    entries: DisplayIncomeData[];
    villagerCount: number;
  } | null;
  villageId: string;
  onUpdate: (
    incomeId: string,
    data: { villagerId: string; month: string; income: number }
  ) => void;
  onDelete: (incomeId: string) => void;
  onAdd: (data: {
    month: string;
    year: string;
    entries: { villagerId: string; villagerName: string; amount: number }[];
  }) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

interface EditIncomeModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { villagerId: string; amount: number }) => void;
  incomeData: DisplayIncomeData | null;
  isSubmitting: boolean;
}

const EditIncomeModal = ({
  open,
  onClose,
  onSave,
  incomeData,
  isSubmitting,
}: EditIncomeModalProps) => {
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (open && incomeData) {
      setAmount(incomeData.amount.toString());
    }
  }, [open, incomeData]);

  const handleSave = () => {
    if (!incomeData || !amount) return;

    const numericAmount = parseFloat(amount.replace(/[^\d]/g, '')) || 0;
    onSave({
      villagerId: incomeData.villagerId || '',
      amount: numericAmount,
    });
  };

  const handleClose = () => {
    setAmount('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          padding: '8px',
          zIndex: 1500,
        },
      }}
    >
      <DialogTitle sx={{ padding: '24px 24px 0px 24px' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 'bold', color: '#374151' }}
          >
            Edit Income for {incomeData?.villagerName}
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: '#9CA3AF' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ padding: '24px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography variant="body2" sx={{ color: '#6B7280' }}>
            Month: {incomeData?.month}
          </Typography>

          <CurrencyInputField
            value={amount}
            onChange={setAmount}
            label="Income Amount"
            currency="IDR"
            locale="id-ID"
            debounceDelay={0}
            fullWidth
          />
        </Box>

        <Box
          sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}
        >
          <Button
            onClick={handleClose}
            variant="outlined"
            disabled={isSubmitting}
            sx={{
              borderRadius: '12px',
              minWidth: 120,
              height: 48,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!amount || isSubmitting}
            sx={{
              borderRadius: '12px',
              minWidth: 120,
              height: 48,
              backgroundColor: '#3B82F6',
              '&:hover': {
                backgroundColor: '#2563EB',
              },
            }}
          >
            {isSubmitting ? 'Updating...' : 'Update Income'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export const MonthlyIncomeModal = ({
  open,
  onClose,
  monthData,
  villageId,
  onUpdate,
  onDelete,
  onAdd,
  isUpdating,
  isDeleting,
}: MonthlyIncomeModalProps) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedIncome, setSelectedIncome] =
    useState<DisplayIncomeData | null>(null);

  const handleAddIncome = () => {
    setShowAddModal(true);
  };

  const handleEditIncome = (income: DisplayIncomeData) => {
    setSelectedIncome(income);
    setShowEditModal(true);
  };

  const handleDeleteIncome = (income: DisplayIncomeData) => {
    setSelectedIncome(income);
    setShowDeleteModal(true);
  };

  const handleSaveNewIncome = (data: {
    month: string;
    year: string;
    entries: { villagerId: string; villagerName: string; amount: number }[];
  }) => {
    handleClose();
    onAdd(data);
    setShowAddModal(false);
  };

  const handleSaveEditIncome = (data: {
    villagerId: string;
    amount: number;
  }) => {
    if (!selectedIncome?._id || !monthData) return;

    const [monthName, year] = monthData.month.split(' ');
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
    const monthNum = (monthNames.indexOf(monthName) + 1)
      .toString()
      .padStart(2, '0');
    const monthString = `${monthNum}-${year}`;

    onUpdate(selectedIncome._id, {
      villagerId: data.villagerId,
      month: monthString,
      income: data.amount,
    });
    handleClose();
    setShowEditModal(false);
    setSelectedIncome(null);
  };

  const handleDeleteConfirm = () => {
    if (selectedIncome?._id) {
      onDelete(selectedIncome._id);
      setShowDeleteModal(false);
      setSelectedIncome(null);
      handleClose();
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setSelectedIncome(null);
  };

  const handleClose = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedIncome(null);
    onClose();
  };

  const formatCurrency = (amount: number) => {
    return `IDR ${amount.toLocaleString('id-ID')}`;
  };

  if (!monthData) return null;

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            padding: '8px',
            minHeight: '600px',
          },
        }}
      >
        <DialogTitle sx={{ padding: '24px 24px 0px 24px' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 'bold', color: '#374151' }}
              >
                Income Data - {monthData.month}
              </Typography>
              <Typography variant="body2" sx={{ color: '#6B7280', mt: 1 }}>
                Total: {formatCurrency(monthData.totalAmount)} •{' '}
                {monthData.villagerCount} villager
                {monthData.villagerCount !== 1 ? 's' : ''}
              </Typography>
            </Box>
            <IconButton onClick={handleClose} sx={{ color: '#9CA3AF' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ padding: '24px' }}>
          {/* Header Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddIncome}
              sx={{
                backgroundColor: '#0EA5E9',
                '&:hover': {
                  backgroundColor: '#0284C7',
                },
                minWidth: 150,
                height: 48,
                borderRadius: '12px',
              }}
            >
              Add Income
            </Button>
          </Box>

          {/* Income Table */}
          <TableContainer component={Paper} sx={{ borderRadius: '12px' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
                  <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>
                    Villager
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>
                    Amount
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>
                    Date Added
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {monthData.entries.map((income) => (
                  <TableRow key={income._id}>
                    <TableCell>
                      <Chip
                        icon={<PersonIcon />}
                        label={income.villagerName}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{
                          borderRadius: '8px',
                          fontSize: '12px',
                          height: '28px',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: '#1F2937' }}
                      >
                        {formatCurrency(income.amount)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ color: '#6B7280', fontSize: '12px' }}
                      >
                        {income.date}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          onClick={() => handleEditIncome(income)}
                          disabled={isUpdating || isDeleting}
                          sx={{
                            border: '1.5px solid #E5E7EB',
                            borderRadius: '8px',
                            background: '#F7F8FA',
                            width: 32,
                            height: 32,
                            color: '#6B7280',
                            '&:hover': {
                              background: '#E5E7EB',
                              color: '#0092D1',
                              borderColor: '#0092D1',
                            },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteIncome(income)}
                          disabled={isUpdating || isDeleting}
                          sx={{
                            border: '1.5px solid #FECACA',
                            borderRadius: '8px',
                            background: '#FFF1F2',
                            width: 32,
                            height: 32,
                            color: '#DC2626',
                            '&:hover': {
                              background: '#FECACA',
                              color: '#B91C1C',
                              borderColor: '#B91C1C',
                            },
                          }}
                        >
                          {isDeleting ? (
                            <CircularProgress size={16} />
                          ) : (
                            <DeleteIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {monthData.entries.length === 0 && (
            <Box
              sx={{
                textAlign: 'center',
                py: 6,
                color: '#6B7280',
              }}
            >
              <Typography variant="body1">
                No income data for this month yet.
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Click Add Income to get started.
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Income Modal */}
      <IncomeModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveNewIncome}
        existingData={{
          id: 0,
          month: monthData.month.split(' ')[0],
          year: monthData.month.split(' ')[1],
        }}
        existingEntries={monthData.entries.map((entry) => ({
          month: monthData.month.split(' ')[0],
          year: monthData.month.split(' ')[1],
          villagerId: entry.villagerId,
        }))}
        isEdit={false}
        villageId={villageId}
        parentMonth={monthData.month.split(' ')[0]}
        parentYear={monthData.month.split(' ')[1]}
      />

      {/* Edit Income Modal */}
      <EditIncomeModal
        open={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedIncome(null);
        }}
        onSave={handleSaveEditIncome}
        incomeData={selectedIncome}
        isSubmitting={isUpdating}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={showDeleteModal}
        onClose={handleDeleteCancel}
        onSecondaryButtonClick={handleDeleteCancel}
        onPrimaryButtonClick={handleDeleteConfirm}
        title="Delete Income Data?"
        message={`Are you sure you want to delete income data for ${selectedIncome?.villagerName}? This action cannot be undone.`}
        primaryButtonText={isDeleting ? 'Deleting...' : 'Delete'}
        secondaryButtonText="Cancel"
      />
    </>
  );
};
