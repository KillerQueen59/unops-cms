import React from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  Avatar,
} from '@mui/material';
import { HelpOutline } from '@mui/icons-material';
import Image from 'next/image';

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onPrimaryButtonClick: () => void;
  onSecondaryButtonClick?: () => void;
  title: string;
  message: string;
  primaryButtonText: string;
  secondaryButtonText?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'submit' | 'leave';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  onPrimaryButtonClick,
  title,
  message,
  primaryButtonText,
  secondaryButtonText = 'Cancel',
  onSecondaryButtonClick,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '400px',
        },
      }}
    >
      <DialogContent sx={{ padding: 0, textAlign: 'center' }}>
        <Box sx={{ mb: 3 }}>
          <Image
            src="/modal_icon.svg"
            alt="Confirmation"
            width={179}
            height={140}
          />

          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: '#1F2937',
              mb: 2,
              fontSize: '18px',
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: '#6B7280',
              fontSize: '14px',
              lineHeight: 1.5,
              mb: 4,
            }}
          >
            {message}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'center',
          }}
        >
          {onSecondaryButtonClick && (
            <Button
              variant="outlined"
              onClick={onSecondaryButtonClick}
              sx={{
                borderRadius: '8px',
                minWidth: '120px',
                height: '44px',
                borderColor: '#D1D5DB',
                color: '#6B7280',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  borderColor: '#9CA3AF',
                  backgroundColor: '#F9FAFB',
                },
              }}
            >
              {secondaryButtonText ?? 'Back'}
            </Button>
          )}

          <Button
            variant="contained"
            onClick={onPrimaryButtonClick}
            sx={{
              borderRadius: '8px',
              minWidth: '120px',
              height: '44px',
              backgroundColor: '#0891B2',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: '#0E7490',
              },
            }}
          >
            {primaryButtonText}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
