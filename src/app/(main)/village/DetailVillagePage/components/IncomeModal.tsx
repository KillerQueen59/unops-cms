'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { DynamicIncomeList } from './DynamicIncomeList';
import { Villager } from '@/services/villagerService';
import toast from 'react-hot-toast';

interface IncomeEntry {
  id: string;
  villager: Villager | null;
  amount: number | '';
}

interface IncomeModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    month: string;
    year: string;
    entries: Array<{
      villagerId: string;
      villagerName: string;
      amount: number;
    }>;
  }) => void;
  existingData?: {
    id?: number;
    month: string;
    year: string;
    entries?: IncomeEntry[];
  };
  existingEntries: Array<{ month: string; year: string; villagerId?: string }>;
  isEdit?: boolean;
  villageId: string;
  parentMonth?: string;
  parentYear?: string;
}

export const IncomeModal = ({
  open,
  onClose,
  onSave,
  existingData,
  existingEntries,
  isEdit = false,
  villageId,
  parentMonth,
  parentYear,
}: IncomeModalProps) => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [incomeEntries, setIncomeEntries] = useState<IncomeEntry[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (parentMonth) {
      setSelectedMonth(parentMonth);
    }
    if (parentYear) {
      setSelectedYear(parentYear);
    }
  }, [parentMonth, parentYear]);

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
    if (parentMonth && parentYear) {
      return;
    }
    if (existingData && isEdit) {
      setSelectedMonth(existingData.month);
      setSelectedYear(existingData.year);
      setIncomeEntries(existingData.entries || []);
    } else {
      setSelectedMonth('');
      setSelectedYear('');
      setIncomeEntries([]);
    }
    setError('');
  }, [existingData, isEdit, open, parentMonth, parentYear]);

  const handleSave = () => {
    if (!selectedMonth || !selectedYear) {
      setError('Please select month and year');
      return;
    }

    // Validate income entries
    const validEntries = incomeEntries.filter(
      (entry) =>
        entry.villager && entry.amount !== '' && Number(entry.amount) > 0
    );

    if (validEntries.length === 0) {
      setError('Please add at least one valid income entry');
      return;
    }

    // Check for duplicate villagers in the same entry
    const villagerIds = validEntries.map((entry) => entry.villager!._id);
    const uniqueVillagerIds = new Set(villagerIds);

    if (villagerIds.length !== uniqueVillagerIds.size) {
      setError(
        'Cannot add multiple entries for the same villager in one submission'
      );
      return;
    }

    // Check for existing entries (same month, year, and villager combination)
    const duplicates = validEntries.some((entry) => {
      return existingEntries.some((existing) => {
        const isSameMonthYear =
          existing.month === selectedMonth && existing.year === selectedYear;
        const isSameVillager = existing.villagerId === entry.villager!._id;

        if (isEdit && existingData) {
          const [existingMonth, existingYear] = existingData.month.split(' ');
          return (
            isSameMonthYear &&
            isSameVillager &&
            !(existingMonth === selectedMonth && existingYear === selectedYear)
          );
        }
        return isSameMonthYear && isSameVillager;
      });
    });

    if (duplicates) {
      toast.error(
        'Some entries already exist for the selected month and year.'
      );
      return;
    }

    // Prepare data for saving
    const formattedEntries = validEntries.map((entry) => ({
      villagerId: entry.villager!._id,
      villagerName: entry.villager!.name,
      amount: Number(entry.amount),
    }));

    onSave({
      month: selectedMonth,
      year: selectedYear,
      entries: formattedEntries,
    });

    handleClose();
  };

  const handleClose = () => {
    setSelectedMonth('');
    setSelectedYear('');
    setIncomeEntries([]);
    setError('');
    onClose();
  };

  const handleEntriesChange = (entries: IncomeEntry[]) => {
    setIncomeEntries(entries);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          padding: '8px',
          maxHeight: '90vh',
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

      <DialogContent
        sx={{ padding: '24px', maxHeight: '60vh', overflowY: 'auto' }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
            {error}
          </Alert>
        )}

        {/* Month and Year Selection */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, mt: 2 }}>
          <FormControl fullWidth disabled={parentMonth !== undefined}>
            <InputLabel>Month</InputLabel>
            <Select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              label="Month"
              sx={{ borderRadius: '12px' }}
              disabled={parentMonth !== undefined}
            >
              {months.map((month) => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth disabled={parentYear !== undefined}>
            <InputLabel>Year</InputLabel>
            <Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              label="Year"
              sx={{ borderRadius: '12px' }}
              disabled={parentYear !== undefined}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year.toString()}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Dynamic Income Entries List */}
        <DynamicIncomeList
          villageId={villageId}
          onEntriesChange={handleEntriesChange}
          initialEntries={incomeEntries}
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
          disabled={
            !selectedMonth ||
            !selectedYear ||
            incomeEntries.length === 0 ||
            incomeEntries.filter(
              (entry) =>
                entry.villager === null ||
                entry.amount === '' ||
                Number(entry.amount) <= 0
            ).length > 0
          }
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
          {isEdit ? 'Update Entries' : 'Add Entries'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
