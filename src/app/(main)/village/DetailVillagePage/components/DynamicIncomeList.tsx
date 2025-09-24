/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  Box,
  Typography,
  TextField,
  Autocomplete,
  Button,
  IconButton,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useVillagers, useCreateVillager } from '@/hooks/useVillagerData';
import { Villager } from '@/services/villagerService';
import { AddVillagerModal } from './AddVillagerModal';
import CurrencyInputField from '@/components/CurrencyInputField';

interface IncomeEntry {
  id: string;
  villager: Villager | null;
  amount: number | '';
  isAddingNewVillager?: boolean;
  newVillagerName?: string;
}

interface DynamicIncomeListProps {
  villageId: string;
  onEntriesChange: (entries: IncomeEntry[]) => void;
  initialEntries?: IncomeEntry[];
}

export const DynamicIncomeList = ({
  villageId,
  onEntriesChange,
  initialEntries = [],
}: DynamicIncomeListProps) => {
  const [entries, setEntries] = useState<IncomeEntry[]>([
    { id: '1', villager: null, amount: '' },
  ]);

  // Fetch villagers for the selected village
  const {
    data: villagersResponse,
    isLoading: isLoadingVillagers,
    refetch: refetchVillagers,
  } = useVillagers({
    villageId,
    page: 1,
    pageSize: 100,
    sortBy: 'name',
  });

  const createVillagerMutation = useCreateVillager();
  const villagers = villagersResponse?.data || [];
  const [showAddVillagerModal, setShowAddVillagerModal] = useState(false);

  useEffect(() => {
    if (initialEntries.length > 0) {
      setEntries(initialEntries);
    }
  }, [initialEntries]);

  useEffect(() => {
    onEntriesChange(entries);
  }, [entries, onEntriesChange]);

  // Get selected villager IDs from all entries
  const getSelectedVillagerIds = () => {
    return entries
      .filter((entry) => entry.villager)
      .map((entry) => entry.villager!._id);
  };

  const addNewEntry = () => {
    const newEntry: IncomeEntry = {
      id: Date.now().toString(),
      villager: null,
      amount: '',
    };
    setEntries([...entries, newEntry]);
  };

  const removeEntry = (id: string) => {
    if (entries.length > 1) {
      setEntries(entries.filter((entry) => entry.id !== id));
    }
  };

  const updateEntry = (id: string, updates: Partial<IncomeEntry>) => {
    setEntries(
      entries.map((entry) =>
        entry.id === id ? { ...entry, ...updates } : entry
      )
    );
  };

  const handleVillagerChange = async (
    entryId: string,
    inputValue: string,
    selectedVillager: Villager | null
  ) => {
    if (selectedVillager) {
      // Existing villager selected
      updateEntry(entryId, {
        villager: selectedVillager,
        isAddingNewVillager: false,
        newVillagerName: undefined,
      });
    } else if (inputValue && inputValue.trim() !== '') {
      // New villager name entered
      const existingVillager = villagers.find(
        (v) => v.name.toLowerCase() === inputValue.toLowerCase()
      );

      if (!existingVillager) {
        updateEntry(entryId, {
          villager: null,
          isAddingNewVillager: true,
          newVillagerName: inputValue.trim(),
        });
      }
    } else {
      // Clear selection
      updateEntry(entryId, {
        villager: null,
        isAddingNewVillager: false,
        newVillagerName: undefined,
      });
    }
  };

  const formatNumber = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    return numericValue;
  };

  const handleAmountChange = (entryId: string, value: string) => {
    // Immediate update without debouncing to prevent maximum call stack
    const formattedValue = formatNumber(value);
    updateEntry(entryId, {
      amount: formattedValue === '' ? '' : Number(formattedValue),
    });
  };

  const getAutocompleteOptions = (
    inputValue: string,
    currentEntryId: string
  ) => {
    const selectedVillagerIds = getSelectedVillagerIds();
    const currentEntry = entries.find((entry) => entry.id === currentEntryId);

    // Filter out already selected villagers, but keep the current entry's villager
    const filteredVillagers = villagers.filter((villager) => {
      const matchesInput = villager.name
        .toLowerCase()
        .includes(inputValue.toLowerCase());
      const isCurrentlySelected = currentEntry?.villager?._id === villager._id;
      const isSelectedElsewhere =
        selectedVillagerIds.includes(villager._id) && !isCurrentlySelected;

      return matchesInput && !isSelectedElsewhere;
    });

    // Add "Add new villager" option if input doesn't match existing villagers
    if (
      inputValue &&
      inputValue.trim() !== '' &&
      !villagers.some((v) => v.name.toLowerCase() === inputValue.toLowerCase())
    ) {
      return [
        {
          _id: 'add-new',
          name: `Add "${inputValue}" as new villager`,
          nik: '',
          villageId: '',
          createdAt: '',
          updatedAt: '',
          isAddNew: true,
          originalName: inputValue.trim(),
        } as Villager & { isAddNew: boolean; originalName: string },
        ...filteredVillagers,
      ];
    }

    return filteredVillagers;
  };

  const handleAddNewVillager = () => {
    setShowAddVillagerModal(true);
  };

  const handleSaveNewVillager = async (villagerData: {
    name: string;
    nik: string;
  }) => {
    try {
      await createVillagerMutation.mutateAsync({
        ...villagerData,
        villageId,
      });

      setShowAddVillagerModal(false);

      // Refetch villagers to include the new one
      await refetchVillagers();
    } catch (error) {
      console.error('Failed to create villager:', error);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Typography variant="body2" sx={{ color: '#374151', fontWeight: 500 }}>
          Villager Income Entries
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddNewVillager}
            size="small"
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              borderColor: '#D1D5DB',
              color: '#6B7280',
              '&:hover': {
                borderColor: '#9CA3AF',
                backgroundColor: '#F9FAFB',
              },
            }}
          >
            Add Villager
          </Button>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addNewEntry}
            size="small"
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              borderColor: '#D1D5DB',
              color: '#6B7280',
              '&:hover': {
                borderColor: '#9CA3AF',
                backgroundColor: '#F9FAFB',
              },
            }}
          >
            Add Entry
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {entries.map((entry) => (
          <Box
            key={entry.id}
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'flex-start',
              p: 3,
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              backgroundColor: '#FAFAFA',
            }}
          >
            {/* Villager Selection */}
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  color: '#6B7280',
                  fontWeight: 500,
                  mb: 0.5,
                  display: 'block',
                }}
              >
                Select Villager
              </Typography>

              <Autocomplete
                fullWidth
                options={villagers}
                getOptionLabel={(option) => {
                  if ((option as any).isAddNew) {
                    return (option as any).originalName;
                  }
                  return option.name;
                }}
                getOptionDisabled={(option) => {
                  // Don't disable the "Add new" option
                  if ((option as any).isAddNew) {
                    return false;
                  }

                  const selectedVillagerIds = getSelectedVillagerIds();
                  const isCurrentlySelected =
                    entry.villager?._id === option._id;

                  // Disable if selected in another entry, but not if it's the current entry's selection
                  return (
                    selectedVillagerIds.includes(option._id) &&
                    !isCurrentlySelected
                  );
                }}
                value={entry.villager}
                onChange={(event, newValue) => {
                  handleVillagerChange(entry.id, '', newValue);
                }}
                onInputChange={(event, inputValue) => {
                  handleVillagerChange(entry.id, inputValue, null);
                }}
                loading={isLoadingVillagers || createVillagerMutation.isPending}
                filterOptions={(options, { inputValue }) =>
                  getAutocompleteOptions(inputValue, entry.id)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    placeholder={
                      isLoadingVillagers
                        ? 'Loading villagers...'
                        : 'Search or add villager...'
                    }
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                      },
                    }}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isLoadingVillagers ||
                          createVillagerMutation.isPending ? (
                            <CircularProgress color="inherit" size={16} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => {
                  if ((option as any).isAddNew) {
                    return (
                      <Box
                        component="li"
                        {...props}
                        key="add-new"
                        sx={{
                          borderTop: '1px solid #E5E7EB',
                          backgroundColor: '#F0F9FF',
                          '&:hover': {
                            backgroundColor: '#E0F2FE',
                          },
                        }}
                      >
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <PersonAddIcon
                            sx={{ color: '#3B82F6', fontSize: 18 }}
                          />
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 500, color: '#3B82F6' }}
                            >
                              {option.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: '#6B7280' }}
                            >
                              Click to add new villager
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    );
                  }

                  const selectedVillagerIds = getSelectedVillagerIds();
                  const isCurrentlySelected =
                    entry.villager?._id === option._id;
                  const isDisabled =
                    selectedVillagerIds.includes(option._id) &&
                    !isCurrentlySelected;

                  return (
                    <Box
                      component="li"
                      {...props}
                      key={option._id}
                      sx={{
                        opacity: isDisabled ? 0.5 : 1,
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          width: '100%',
                        }}
                      >
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {option.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: '#6B7280' }}
                          >
                            NIK: {option.nik}
                          </Typography>
                        </Box>
                        {isDisabled && (
                          <Chip
                            label="Selected"
                            size="small"
                            sx={{
                              backgroundColor: '#FEE2E2',
                              color: '#DC2626',
                              fontSize: '0.6875rem',
                              height: '20px',
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  );
                }}
                noOptionsText="No villagers found"
              />
            </Box>

            {/* Income Amount */}
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  color: '#6B7280',
                  fontWeight: 500,
                  mb: 0.5,
                  display: 'block',
                }}
              >
                Income Amount
              </Typography>

              <CurrencyInputField
                fullWidth
                size="small"
                value={entry.amount}
                onChange={(value) => handleAmountChange(entry.id, value)}
                placeholder="Enter amount..."
                currency="IDR"
                locale="id-ID"
                debounceDelay={0}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  },
                }}
              />
            </Box>

            {/* Delete Button */}
            <Box sx={{ mt: 2 }}>
              <IconButton
                onClick={() => removeEntry(entry.id)}
                disabled={entries.length <= 1}
                sx={{
                  color: entries.length <= 1 ? '#D1D5DB' : '#EF4444',
                  '&:hover': {
                    backgroundColor:
                      entries.length <= 1 ? 'transparent' : '#FEF2F2',
                  },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Add Villager Modal */}
      <AddVillagerModal
        open={showAddVillagerModal}
        onClose={() => setShowAddVillagerModal(false)}
        onSave={handleSaveNewVillager}
        villageId={villageId}
        isSubmitting={createVillagerMutation.isPending}
      />
    </Box>
  );
};
