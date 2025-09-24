import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  MenuItem,
  FormControl,
  Select,
  Autocomplete,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useDataStore } from '@/stores';
import { southSumatraRegencies } from '../../village/constants';

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({ open, onClose }) => {
  const { filters, setFilters, clearFilters } = useDataStore();

  const typeOptions = [
    {
      label: 'Others',
      value: 'others',
    },
    {
      label: 'Regency',
      value: 'regency',
    },
  ];

  // Local state for form values
  const [localFilters, setLocalFilters] = useState({
    area: '',
  });

  const [type, setType] = useState('');

  // Initialize local filters when modal opens or filters change
  useEffect(() => {
    if (open) {
      setLocalFilters({
        area: filters.area || '',
      });
    }
  }, [open, filters]);

  const handleApplyFilter = () => {
    const filtersToApply = {
      ...filters,
      area: type === 'regency' ? localFilters.area : 'others',
    };
    setFilters(filtersToApply);
    onClose();
  };

  const handleClearFilter = () => {
    // Clear both local and store filters
    const clearedFilters = {
      area: '',
    };
    setType('');
    setLocalFilters(clearedFilters);
    clearFilters();
  };

  const handleLocalFilterChange = (field: string, value: string) => {
    // Update local state only
    setLocalFilters((prev) => {
      const newFilters = { ...prev, [field]: value };

      // Clear area when type changes from regency to others
      if (field === 'type' && value !== 'regency') {
        newFilters.area = '';
      }

      return newFilters;
    });
  };

  const handleRegencyChange = (regencyCode: string) => {
    setLocalFilters((prev) => ({ ...prev, area: regencyCode }));
  };

  const handleCancel = () => {
    // Reset local filters to current store values when canceling
    setLocalFilters({
      area: filters.area || '',
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          p: 0,
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: '#374151',
              }}
            >
              Filter
            </Typography>
            <IconButton
              onClick={handleCancel}
              sx={{
                color: '#6B7280',
                '&:hover': {
                  backgroundColor: '#F3F4F6',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Filter Fields */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Type Selection */}
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: '#374151',
                  fontWeight: 500,
                  mb: 1,
                }}
              >
                Type
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={type}
                  onChange={(e) => {
                    const selectedType = e.target.value;
                    setType(selectedType);
                  }}
                  displayEmpty
                  sx={{
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#D1D5DB',
                    },
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  {typeOptions.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Regency/City - Conditional Render when type is 'regency' */}
            {type === 'regency' && (
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#374151',
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  Regency/City
                  <span style={{ color: '#EF4444', marginLeft: '4px' }}>*</span>
                </Typography>
                <Autocomplete
                  options={southSumatraRegencies}
                  getOptionLabel={(option) => option.name}
                  value={
                    southSumatraRegencies.find(
                      (reg) => reg.code === localFilters.area
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    handleRegencyChange(newValue?.code || '');
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Search regency/city..."
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                        },
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props} key={option.code}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {option.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#6B7280' }}>
                          Capital: {option.capital} •{' '}
                          {option.type === 'city' ? 'City' : 'Regency'}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  noOptionsText="No regency/city found"
                  sx={{
                    '& .MuiAutocomplete-inputRoot': {
                      borderRadius: '12px',
                    },
                  }}
                />
              </Box>
            )}
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mt: 4,
              justifyContent: 'center',
            }}
          >
            <Button
              variant="outlined"
              onClick={handleClearFilter}
              sx={{
                borderRadius: '8px',
                borderColor: '#D1D5DB',
                color: '#374151',
                width: '50%',
                height: 54,
                px: 3,
                py: 1,
                '&:hover': {
                  borderColor: '#9CA3AF',
                  backgroundColor: '#F9FAFB',
                },
              }}
            >
              Clear Filter
            </Button>
            <Button
              variant="contained"
              onClick={handleApplyFilter}
              sx={{
                borderRadius: '8px',
                color: 'white',
                width: '50%',
                height: 54,
                px: 3,
                py: 1,
                '&:hover': {
                  backgroundColor: '#2563EB',
                },
              }}
            >
              Apply Filter
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
