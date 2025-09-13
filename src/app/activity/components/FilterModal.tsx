import React, { useState } from 'react';
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

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  onApplyFilter: (filters: ActivityFilters) => void;
  onClearFilter: () => void;
}

export interface ActivityFilters {
  category: string;
  status: string;
  startDate: string;
  endDate: string;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  open,
  onClose,
  onApplyFilter,
  onClearFilter,
}) => {
  const [filters, setFilters] = useState<ActivityFilters>({
    category: '',
    status: '',
    startDate: '',
    endDate: '',
  });

  const categoryOptions = ['Category 1', 'Category 2', 'Category 3'];

  const statusOptions = ['Not Started', 'In Progress', 'Completed', 'On Hold'];

  const handleApplyFilter = () => {
    onApplyFilter(filters);
    onClose();
  };

  const handleClearFilter = () => {
    setFilters({
      category: '',
      status: '',
      startDate: '',
      endDate: '',
    });
    onClearFilter();
  };

  const handleFilterChange = (field: keyof ActivityFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          padding: '8px',
        },
      }}
    >
      <DialogContent sx={{ padding: '32px' }}>
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
            onClick={onClose}
            sx={{
              color: '#EF4444',
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Filter Form */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Category and Status Row */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Box>
              <Typography
                variant="body2"
                sx={{ color: '#6B7280', mb: 1, fontWeight: 500 }}
              >
                Category
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange('category', e.target.value)
                  }
                  displayEmpty
                  sx={{
                    borderRadius: '8px',
                    '& .MuiSelect-select': {
                      padding: '12px 16px',
                    },
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  {categoryOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Typography
                variant="body2"
                sx={{ color: '#6B7280', mb: 1, fontWeight: 500 }}
              >
                Status
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  displayEmpty
                  sx={{
                    borderRadius: '8px',
                    '& .MuiSelect-select': {
                      padding: '12px 16px',
                    },
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  {statusOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Start Date Row */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Box>
              <Typography
                variant="body2"
                sx={{ color: '#6B7280', mb: 1, fontWeight: 500 }}
              >
                Start Date
              </Typography>
              <TextField
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  handleFilterChange('startDate', e.target.value)
                }
                placeholder="All"
                fullWidth
                InputProps={{
                  sx: {
                    borderRadius: '8px',
                    '& input': {
                      padding: '12px 16px',
                    },
                  },
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>

            <Box>
              <Typography
                variant="body2"
                sx={{ color: '#6B7280', mb: 1, fontWeight: 500 }}
              >
                End Date
              </Typography>
              <TextField
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                placeholder="All"
                fullWidth
                InputProps={{
                  sx: {
                    borderRadius: '8px',
                    '& input': {
                      padding: '12px 16px',
                    },
                  },
                }}
                InputLabelProps={{
                  shrink: true,
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
          }}
        >
          <Button
            variant="outlined"
            onClick={handleClearFilter}
            sx={{
              flex: 1,
              borderColor: '#D1D5DB',
              color: '#6B7280',
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              height: '48px',
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
              flex: 1,
              backgroundColor: '#0EA5E9',
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              height: '48px',
              '&:hover': {
                backgroundColor: '#0284C7',
              },
            }}
          >
            Apply Filter
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
