'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useState } from 'react';
import { villageCategoryOptions } from '../constants';

interface CategorySelectionModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (category: string) => void;
}

export const CategorySelectionModal = ({
  open,
  onClose,
  onConfirm,
}: CategorySelectionModalProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const handleConfirm = () => {
    if (selectedCategory) {
      onConfirm(selectedCategory);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedCategory('');
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
            Choose Village Category
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: '#9CA3AF' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ padding: '24px' }}>
        <RadioGroup
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {villageCategoryOptions.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={
                <Radio
                  sx={{
                    '&.Mui-checked': {
                      color: '#3B82F6',
                    },
                  }}
                />
              }
              label={
                <Box sx={{ padding: '8px 0' }}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {option.label}
                  </Typography>
                </Box>
              }
              sx={{
                margin: '8px 0',
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                backgroundColor:
                  selectedCategory === option.value ? '#EBF4FF' : '#fff',
                '&:hover': {
                  backgroundColor: '#F9FAFB',
                },
                ...(selectedCategory === option.value && {
                  borderColor: '#3B82F6',
                  backgroundColor: '#EBF4FF',
                }),
              }}
            />
          ))}
        </RadioGroup>
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
          onClick={handleConfirm}
          variant="contained"
          disabled={!selectedCategory}
          sx={{
            borderRadius: '12px',
            minWidth: 120,
            height: 48,
            backgroundColor: selectedCategory ? 'primary.main' : '#D1D5DB',
            '&:hover': {
              backgroundColor: selectedCategory ? 'primary.main' : '#D1D5DB',
            },
          }}
        >
          Choose Category
        </Button>
      </DialogActions>
    </Dialog>
  );
};
