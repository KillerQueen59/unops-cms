import React from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Close as CloseIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import Image from 'next/image';
import { DataFile } from '@/types/data';
import { useDownloadFile } from '@/hooks/useDocumentData';

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  file: DataFile | null;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  open,
  onClose,
  file,
}) => {
  const downloadMutation = useDownloadFile();

  if (!file) return null;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeDisplay = (fileType: string): string => {
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
      typeMap[fileType] || fileType.split('/')[1]?.toUpperCase() || 'Unknown'
    );
  };

  const handleDownload = async () => {
    try {
      await downloadMutation.mutateAsync(file);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const renderPreview = () => {
    if (file.fileType.startsWith('image/')) {
      // For images, show preview if it's an uploaded file
      if (file.file) {
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
            <Image
              src={URL.createObjectURL(file.file)}
              alt={file.documentName}
              width={500}
              height={400}
              style={{
                maxWidth: '100%',
                maxHeight: '400px',
                objectFit: 'contain',
                borderRadius: '8px',
              }}
            />
          </Box>
        );
      } else {
        // For mock files, show placeholder
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
              Image Preview
            </Typography>
            <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
              Preview not available for this image
            </Typography>
          </Box>
        );
      }
    } else if (file.fileType === 'application/pdf') {
      // For PDFs, show iframe if it's an uploaded file
      if (file.file) {
        return (
          <Box
            sx={{
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
              overflow: 'hidden',
            }}
          >
            <iframe
              src={URL.createObjectURL(file.file)}
              width="100%"
              height="400px"
              style={{ border: 'none' }}
              title={file.documentName}
            />
          </Box>
        );
      } else {
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
              PDF Document
            </Typography>
            <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
              Preview not available for this PDF
            </Typography>
          </Box>
        );
      }
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
            {getFileTypeDisplay(file.fileType)} File
          </Typography>
          <Typography variant="body2" sx={{ color: '#9CA3AF', mb: 2 }}>
            Preview not available for this file type
          </Typography>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            disabled={downloadMutation.isPending}
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
                {file.documentName}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Chip
                  label={getFileTypeDisplay(file.fileType)}
                  size="small"
                  sx={{
                    backgroundColor: '#F3F4F6',
                    color: '#374151',
                    fontWeight: 'medium',
                  }}
                />
                <Chip
                  label={formatFileSize(file.fileSize)}
                  size="small"
                  sx={{
                    backgroundColor: '#EFF6FF',
                    color: '#1D4ED8',
                    fontWeight: 'medium',
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ color: '#6B7280', mb: 1 }}>
                <strong>File Name:</strong> {file.fileName}
              </Typography>
              <Typography variant="body2" sx={{ color: '#6B7280', mb: 1 }}>
                <strong>Created:</strong>{' '}
                {new Date(file.createdDate).toLocaleDateString('id-ID', {
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
              onClick={handleDownload}
              disabled={downloadMutation.isPending}
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
