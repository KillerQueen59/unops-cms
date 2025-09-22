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
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { DataFile } from '@/types/data';

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  file: DataFile | null;
  handleDownload: (file: DataFile) => Promise<void>;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  open,
  onClose,
  file,
  handleDownload,
}) => {
  if (!file) return null;

  const getFileTypeDisplay = (mimetype: string): string => {
    const typeMap: { [key: string]: string } = {
      'application/pdf': 'PDF',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        'Word',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        'Excel',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        'PowerPoint',
      'image/jpeg': 'JPEG',
      'image/jpg': 'JPG',
      'image/png': 'PNG',
      'application/zip': 'ZIP',
      'text/csv': 'CSV',
      'application/vnd.google-earth.kml+xml': 'KML',
    };

    return (
      typeMap[mimetype] || mimetype.split('/')[1]?.toUpperCase() || 'Unknown'
    );
  };

  const getFileName = () => {
    if (file.fileName) return file.fileName;
    // Extract filename from URL if available
    const urlParts = file.fileUrl.split('/');
    return urlParts[urlParts.length - 1] || file.title;
  };

  const renderPreview = () => {
    const fullUrl = file.fileUrl.startsWith('https')
      ? file.fileUrl.replace('https://', 'http://')
      : file.fileUrl.startsWith('http')
        ? file.fileUrl
        : `http://${file.fileUrl}`;

    if (file.mimetype.startsWith('image/')) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 300,
            backgroundColor: '#F9FAFB',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
          }}
        >
          <img
            src={fullUrl}
            alt={file.title}
            style={{
              maxWidth: '100%',
              maxHeight: '400px',
              objectFit: 'contain',
              borderRadius: '8px',
              zIndex: 1,
            }}
            onError={(e) => {
              // Fallback if image fails to load
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <Box
            className="hidden"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
            }}
          >
            <Typography variant="h6" sx={{ color: '#6B7280', mb: 1 }}>
              Image Preview
            </Typography>
            <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
              Preview not available for this image
            </Typography>
          </Box>
        </Box>
      );
    } else if (file.mimetype === 'application/pdf') {
      return (
        <Box
          sx={{
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            overflow: 'hidden',
          }}
        >
          <iframe
            src={fullUrl}
            width="100%"
            height="400px"
            style={{ border: 'none' }}
            title={file.title}
            onError={() => {
              toast.error('Failed to load PDF preview.');
            }}
          />
        </Box>
      );
    } else {
      // For other file types, show file info
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 300,
            backgroundColor: '#F9FAFB',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
          }}
        >
          <Typography variant="h6" sx={{ color: '#6B7280', mb: 1 }}>
            {getFileTypeDisplay(file.mimetype)} File
          </Typography>
          <Typography variant="body2" sx={{ color: '#9CA3AF', mb: 2 }}>
            Preview not available for this file type
          </Typography>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => handleDownload(file)}
            sx={{
              borderRadius: '8px',
              backgroundColor: '#0EA5E9',
              '&:hover': {
                backgroundColor: '#0284C7',
              },
            }}
          >
            Download to View
          </Button>
        </Box>
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '800px',
          maxHeight: '90vh',
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
                {file.title}
              </Typography>

              <Typography variant="body2" sx={{ color: '#6B7280', mb: 1 }}>
                <strong>File Name:</strong> {getFileName()}
              </Typography>
              <Typography variant="body2" sx={{ color: '#6B7280', mb: 1 }}>
                <strong>Created:</strong>{' '}
                {new Date(file.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </Typography>
              {file.uploadedBy && (
                <Typography variant="body2" sx={{ color: '#6B7280', mb: 1 }}>
                  <strong>Uploaded by:</strong> {file.uploadedBy}
                </Typography>
              )}
              {file.description && (
                <Typography variant="body2" sx={{ color: '#6B7280' }}>
                  <strong>Description:</strong> {file.description}
                </Typography>
              )}
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

          {/* Preview Content */}
          <Box sx={{ mb: 3 }}>{renderPreview()}</Box>

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
              }}
            >
              Close
            </Button>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => handleDownload(file)}
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
