import React from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import {
  Close as CloseIcon,
  Download as DownloadIcon,
  ZoomIn as ZoomInIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';

interface ImagePreviewModalProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  open,
  onClose,
  imageUrl,
  title,
}) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // Create a temporary anchor element to trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Extract filename from URL or use a default name
      const urlParts = imageUrl.split('/');
      const filename =
        urlParts[urlParts.length - 1] || `${title.replace(/\s+/g, '_')}.jpg`;
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the object URL
      window.URL.revokeObjectURL(url);

      toast.success('Image downloaded successfully!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download image. Please try again.');
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    toast.error('Failed to load image');
    console.error('Image load error:', e);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '900px',
          maxHeight: '90vh',
          backgroundColor: '#FFFFFF',
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 3,
            }}
          >
            <Box sx={{ flex: 1, mr: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  color: '#374151',
                  mb: 1,
                }}
              >
                {title}
              </Typography>
              <Typography variant="body2" sx={{ color: '#6B7280' }}>
                Click and drag to pan • Scroll to zoom
              </Typography>
            </Box>
            <IconButton
              onClick={onClose}
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

          {/* Image Preview */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 400,
              maxHeight: 600,
              backgroundColor: '#F9FAFB',
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
              overflow: 'hidden',
              position: 'relative',
              mb: 3,
            }}
          >
            <img
              src={imageUrl}
              alt={title}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                borderRadius: '8px',
                transition: 'transform 0.2s ease-in-out',
                cursor: 'zoom-in',
              }}
              onError={handleImageError}
              onClick={(e) => {
                // Simple zoom on click
                const img = e.currentTarget;
                if (img.style.transform === 'scale(2)') {
                  img.style.transform = 'scale(1)';
                  img.style.cursor = 'zoom-in';
                } else {
                  img.style.transform = 'scale(2)';
                  img.style.cursor = 'zoom-out';
                }
              }}
            />
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'flex-end',
            }}
          >
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{
                borderRadius: '12px',
                minWidth: 100,
                height: 48,
                borderColor: '#D1D5DB',
                color: '#6B7280',
                '&:hover': {
                  borderColor: '#9CA3AF',
                  backgroundColor: '#F9FAFB',
                },
              }}
            >
              Close
            </Button>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              sx={{
                borderRadius: '12px',
                minWidth: 120,
                height: 48,
                backgroundColor: '#0EA5E9',
                '&:hover': {
                  backgroundColor: '#0284C7',
                },
              }}
            >
              Download
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
