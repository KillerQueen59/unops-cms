import React from 'react';
import { Box, Typography } from '@mui/material';
import { useDemositeStore } from '@/stores/demositeStore';

export const Content = () => {
  const { selectedDemosite } = useDemositeStore();

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
            backgroundColor: '#F3F4F6',
            backgroundImage: `url("${selectedDemosite.header}")` || 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
          }}
        />
      </Box>

      {/* Description Section */}
      <Box sx={{ mb: 4 }}>
        {/* Default description paragraphs as shown in the design */}
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
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 2,
            maxWidth: '600px',
          }}
        >
          {/* Use placeholder mountain/village images similar to the design */}
          {selectedDemosite.photos.map((imageUrl, index) => (
            <Box
              key={index}
              sx={{
                borderRadius: '12px',
                overflow: 'hidden',
                aspectRatio: '4/3',
                position: 'relative',
                backgroundImage: `url(${imageUrl})` || 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};
