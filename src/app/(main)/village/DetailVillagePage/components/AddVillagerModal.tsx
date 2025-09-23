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
  Alert,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useState, useEffect } from 'react';

interface AddVillagerModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { name: string; nik: string }) => void;
  villageId: string;
  isSubmitting?: boolean;
}

export const AddVillagerModal = ({
  open,
  onClose,
  onSave,
  villageId,
  isSubmitting = false,
}: AddVillagerModalProps) => {
  const [name, setName] = useState('');
  const [nik, setNik] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setName('');
      setNik('');
      setError('');
    }
  }, [open]);

  const handleSave = () => {
    if (!name.trim() || !nik.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (nik.length < 6) {
      setError('NIK must be at least 6 characters');
      return;
    }

    onSave({
      name: name.trim(),
      nik: nik.trim(),
    });
  };

  const handleClose = () => {
    setName('');
    setNik('');
    setError('');
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
            Add New Villager
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

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            fullWidth
            label="Villager Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter villager name..."
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              },
            }}
          />

          <TextField
            fullWidth
            label="NIK (Identity Number)"
            value={nik}
            onChange={(e) => setNik(e.target.value)}
            placeholder="Enter NIK..."
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              },
            }}
          />

          <TextField
            fullWidth
            label="Village ID"
            value={villageId}
            disabled
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: '#F9FAFB',
              },
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ padding: '0px 24px 24px 24px', gap: 2 }}>
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
          disabled={!name.trim() || !nik.trim() || isSubmitting}
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
          {isSubmitting ? 'Adding...' : 'Add Villager'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
