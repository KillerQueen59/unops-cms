'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  InputAdornment,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useState, useEffect } from 'react';

interface IncomeModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { month: string; year: string; amount: number }) => void;
  existingData?: {
    id?: number;
    month: string;
    year: string;
    amount: number;
  };
  existingEntries: Array<{ month: string; year: string }>;
  isEdit?: boolean;
}

export const IncomeModal = ({
  open,
  onClose,
  onSave,
  existingData,
  existingEntries,
  isEdit = false,
}: IncomeModalProps) => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [error, setError] = useState('');

  const months = [
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

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i + 1);

  useEffect(() => {
    if (existingData && isEdit) {
      setSelectedMonth(existingData.month);
      setSelectedYear(existingData.year);
      setAmount(existingData.amount);
    } else {
      setSelectedMonth('');
      setSelectedYear('');
      setAmount('');
    }
    setError('');
  }, [existingData, isEdit, open]);

  const handleSave = () => {
    if (!selectedMonth || !selectedYear || amount === '') {
      setError('Please fill in all fields');
      return;
    }

    const isDuplicate = existingEntries.some((entry) => {
      const isSameMonthYear =
        entry.month === selectedMonth && entry.year === selectedYear;
      if (isEdit && existingData) {
        const [existingMonth, existingYear] = existingData.month.split(' ');
        return (
          isSameMonthYear &&
          !(existingMonth === selectedMonth && existingYear === selectedYear)
        );
      }
      return isSameMonthYear;
    });

    if (isDuplicate) {
      setError('Entry for this month and year has already been recorded.');
      return;
    }

    onSave({
      month: selectedMonth,
      year: selectedYear,
      amount: Number(amount),
    });

    handleClose();
  };

  const handleClose = () => {
    setSelectedMonth('');
    setSelectedYear('');
    setAmount('');
    setError('');
    onClose();
  };

  const formatNumber = (value: string) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9]/g, '');
    return numericValue;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatNumber(e.target.value);
    setAmount(value === '' ? '' : Number(value));
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
            {isEdit ? 'Edit' : 'New'} Monthly Income Report
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: '#9CA3AF' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ padding: '24px' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Month</InputLabel>
            <Select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              label="Month"
              sx={{ borderRadius: '12px' }}
            >
              {months.map((month) => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Year</InputLabel>
            <Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              label="Year"
              sx={{ borderRadius: '12px' }}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year.toString()}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <TextField
          fullWidth
          label="Income Amount"
          type="text"
          value={amount === '' ? '' : amount.toLocaleString('id-ID')}
          onChange={handleAmountChange}
          placeholder="Input income amount..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">IDR</InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
            },
          }}
        />
      </DialogContent>

      <DialogActions sx={{ padding: '0px 24px 24px 24px', gap: 2 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
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
          disabled={!selectedMonth || !selectedYear || amount === ''}
          sx={{
            borderRadius: '12px',
            minWidth: 120,
            height: 48,
            backgroundColor:
              selectedMonth && selectedYear && amount !== ''
                ? '#3B82F6'
                : '#D1D5DB',
            '&:hover': {
              backgroundColor:
                selectedMonth && selectedYear && amount !== ''
                  ? '#2563EB'
                  : '#D1D5DB',
            },
          }}
        >
          {isEdit ? 'Update Data' : 'Add New Data'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
