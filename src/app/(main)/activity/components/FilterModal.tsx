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
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useActivityStore } from '@/stores/activityStore';

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  villages: {
    label: string;
    value: string;
  }[];
}

export const FilterModal: React.FC<FilterModalProps> = ({
  open,
  onClose,
  villages,
}) => {
  const { filters, setFilters, clearFilters } = useActivityStore();

  const statusOptions = [
    {
      label: 'Ongoing',
      value: 'ongoing',
    },
    {
      label: 'Completed',
      value: 'completed',
    },
    {
      label: 'Not Yet',
      value: 'not yet',
    },
  ];
  const typeOptions = [
    {
      label: 'Training',
      value: 'training',
    },
    {
      label: 'Demo Site',
      value: 'demosite',
    },
    {
      label: 'Workshop',
      value: 'workshop',
    },
    {
      label: 'Meeting',
      value: 'meeting',
    },
    {
      label: 'Field Visit',
      value: 'field_visit',
    },
    {
      label: 'FGD',
      value: 'fgd',
    },
  ];

  // Local state for form values
  const [localFilters, setLocalFilters] = useState({
    type: '',
    village: '',
    status: '',
    startDate: '',
    endDate: '',
  });

  // Initialize local filters when modal opens or filters change
  useEffect(() => {
    if (open) {
      setLocalFilters(filters);
    }
  }, [open, filters]);

  const handleApplyFilter = () => {
    // Only set filters when Apply button is clicked
    setFilters(localFilters);
    onClose();
  };

  const handleClearFilter = () => {
    // Clear both local and store filters
    const clearedFilters = {
      type: '',
      village: '',
      status: '',
      startDate: '',
      endDate: '',
    };
    setLocalFilters(clearedFilters);
    clearFilters();
  };

  const handleLocalFilterChange = (field: string, value: string) => {
    // Update local state only
    setLocalFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    // Reset local filters to current store values when canceling
    setLocalFilters(filters);
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
            {/* Category and Status Row */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#374151',
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  Status
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={localFilters.status}
                    onChange={(e) =>
                      handleLocalFilterChange('status', e.target.value)
                    }
                    displayEmpty
                    sx={{
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#D1D5DB',
                      },
                    }}
                  >
                    <MenuItem value="">All</MenuItem>
                    {statusOptions.map((status) => (
                      <MenuItem key={status.value} value={status.value}>
                        {status.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ flex: 1 }}>
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
                    value={localFilters.type}
                    onChange={(e) =>
                      handleLocalFilterChange('type', e.target.value)
                    }
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
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  color: '#374151',
                  fontWeight: 500,
                  mb: 1,
                }}
              >
                Village
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={localFilters.village}
                  onChange={(e) =>
                    handleLocalFilterChange('village', e.target.value)
                  }
                  displayEmpty
                  sx={{
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#D1D5DB',
                    },
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  {villages.map((village) => (
                    <MenuItem key={village.value} value={village.value}>
                      {village.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Date Range Row */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#374151',
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  Start Date
                </Typography>
                <TextField
                  type="date"
                  fullWidth
                  value={localFilters.startDate}
                  onChange={(e) =>
                    handleLocalFilterChange('startDate', e.target.value)
                  }
                  onClick={(e) => {
                    const input = e.currentTarget.querySelector(
                      'input[type="date"]'
                    ) as HTMLInputElement;
                    if (input) {
                      input.showPicker();
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      cursor: 'pointer',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#D1D5DB',
                    },
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    style: { cursor: 'pointer' },
                  }}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#374151',
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  End Date
                </Typography>
                <TextField
                  type="date"
                  fullWidth
                  value={localFilters.endDate}
                  onChange={(e) =>
                    handleLocalFilterChange('endDate', e.target.value)
                  }
                  onClick={(e) => {
                    const input = e.currentTarget.querySelector(
                      'input[type="date"]'
                    ) as HTMLInputElement;
                    if (input) {
                      input.showPicker();
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      cursor: 'pointer',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#D1D5DB',
                    },
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    style: { cursor: 'pointer' },
                  }}
                />
              </Box>
            </Box>
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
