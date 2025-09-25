import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useDemositeStore } from '@/stores/demositeStore';
import { ImagePreviewModal } from './ImagePreviewModal';
import { Image as ImageIcon } from '@phosphor-icons/react';

export const Content = () => {
  const { selectedDemosite } = useDemositeStore();
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>('');
  const [selectedImageTitle, setSelectedImageTitle] = useState<string>('');
  const [headerImageError, setHeaderImageError] = useState(false);
  const [documentationImageErrors, setDocumentationImageErrors] = useState<Record<number, boolean>>({});

  const handleImageClick = (imageUrl: string, title?: string) => {
    const fullUrl = imageUrl.startsWith('http') ? imageUrl : `${imageUrl}`;
    setSelectedImageUrl(fullUrl);
    setSelectedImageTitle(title || 'Image Preview');
    setPreviewModalOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewModalOpen(false);
    setSelectedImageUrl('');
    setSelectedImageTitle('');
  };

  if (!selectedDemosite) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No demosite data available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '100%' }}>
      {/* Header Photo Section */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            width: '100%',
            height: '300px',
            borderRadius: '12px',
            overflow: 'hidden',
            position: 'relative',
            cursor: (selectedDemosite.header && !headerImageError) ? 'pointer' : 'default',
            boxShadow:
              '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: (selectedDemosite.header && !headerImageError) ? 'translateY(-2px)' : 'none',
              boxShadow: (selectedDemosite.header && !headerImageError)
                ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            },
          }}
          onClick={() =>
            selectedDemosite.header && !headerImageError &&
            handleImageClick(selectedDemosite.header, selectedDemosite.title)
          }
        >
          {selectedDemosite.header && !headerImageError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={selectedDemosite.header}
              alt={selectedDemosite.title || 'Demosite header'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              onError={() => setHeaderImageError(true)}
            />
          ) : (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                backgroundColor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #e0e0e0',
              }}
            >
              <ImageIcon size={64} color="#9e9e9e" weight="light" />
            </Box>
          )}
        </Box>
      </Box>

      {/* Description Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="body1"
          sx={{
            lineHeight: 1.8,
            mb: 3,
            color: '#374151',
            textAlign: 'justify',
            fontSize: '16px',
          }}
        >
          {selectedDemosite.story || 'No story available for this demosite.'}
        </Typography>
      </Box>

      {/* Documentation Section */}
      {selectedDemosite.photos && selectedDemosite.photos.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              mb: 3,
              color: '#1F2937',
              fontSize: '24px',
            }}
          >
            Documentation
          </Typography>

          {/* Documentation Images Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 2,
            }}
          >
            {selectedDemosite.photos.map((imageUrl, index) => (
              <Box
                key={index}
                sx={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  aspectRatio: '4/3',
                  position: 'relative',
                  cursor: !documentationImageErrors[index] ? 'pointer' : 'default',
                  boxShadow:
                    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: !documentationImageErrors[index] ? 'translateY(-2px)' : 'none',
                    boxShadow: !documentationImageErrors[index]
                      ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                      : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  },
                }}
                onClick={() =>
                  !documentationImageErrors[index] &&
                  handleImageClick(imageUrl, `Documentation Image ${index + 1}`)
                }
              >
                {!documentationImageErrors[index] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt={`Documentation Image ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    onError={() => {
                      setDocumentationImageErrors(prev => ({ ...prev, [index]: true }));
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#f5f5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid #e0e0e0',
                    }}
                  >
                    <ImageIcon size={32} color="#9e9e9e" weight="light" />
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Image Preview Modal */}
      <ImagePreviewModal
        open={previewModalOpen}
        onClose={handleClosePreview}
        imageUrl={selectedImageUrl}
        title={selectedImageTitle}
      />
    </Box>
  );
};
