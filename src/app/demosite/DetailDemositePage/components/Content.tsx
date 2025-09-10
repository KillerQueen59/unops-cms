import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
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
      {/* Title and Badges */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            mb: 2,
            fontSize: '2rem',
            color: '#1F2937',
          }}
        >
          {selectedDemosite.title}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          <Chip
            label={selectedDemosite.type}
            size="small"
            sx={{
              backgroundColor: '#E1F6FD',
              color: '#0092D1',
              border: '1px solid #0092D1',
              fontWeight: 'medium',
            }}
          />
          {selectedDemosite.isTop10 && (
            <Chip
              label="Top 10"
              size="small"
              sx={{
                backgroundColor: '#FFF3CD',
                color: '#856404',
                border: '1px solid #FFEAA7',
                fontWeight: 'medium',
              }}
            />
          )}
        </Box>
      </Box>

      {/* Description */}
      <Typography
        variant="body1"
        sx={{
          mb: 3,
          lineHeight: 1.6,
          color: '#6B7280',
          fontSize: '1rem',
        }}
      >
        {selectedDemosite.description}
      </Typography>

      {/* Location */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" sx={{ color: '#374151' }}>
          <strong>Location:</strong> {selectedDemosite.name}
        </Typography>
      </Box>

      {/* Story Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            mb: 2,
            color: '#1F2937',
            fontSize: '1.25rem',
          }}
        >
          Story
        </Typography>
        {/* Split story into paragraphs */}
        {selectedDemosite.story ? (
          selectedDemosite.story.split('\n').map((paragraph, index) => (
            <Typography
              key={index}
              variant="body1"
              sx={{
                lineHeight: 1.6,
                mb: 2,
                color: '#374151',
                textAlign: 'justify',
              }}
            >
              {paragraph ||
                'Kegiatan ini bertujuan untuk merencanakan pelatihan budidaya ternak lele di desa. Dalam pertemuan persiapan ini, panitia dan pihak terkait akan membahas kebutuhan, jadwal, serta materi pelatihan agar pelaksanaan berjalan lancar dan sesuai dengan kebutuhan masyarakat.'}
            </Typography>
          ))
        ) : (
          // Default story paragraphs as shown in the design
          <>
            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.6,
                mb: 2,
                color: '#374151',
                textAlign: 'justify',
              }}
            >
              Kegiatan ini bertujuan untuk merencanakan pelatihan budidaya
              ternak lele di desa. Dalam pertemuan persiapan ini, panitia dan
              pihak terkait akan membahas kebutuhan, jadwal, serta materi
              pelatihan agar pelaksanaan berjalan lancar dan sesuai dengan
              kebutuhan masyarakat.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.6,
                mb: 2,
                color: '#374151',
                textAlign: 'justify',
              }}
            >
              Kegiatan ini bertujuan untuk merencanakan pelatihan budidaya
              ternak lele di desa. Dalam pertemuan persiapan ini, panitia dan
              pihak terkait akan membahas kebutuhan, jadwal, serta materi
              pelatihan agar pelaksanaan berjalan lancar dan sesuai dengan
              kebutuhan masyarakat.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.6,
                mb: 2,
                color: '#374151',
                textAlign: 'justify',
              }}
            >
              Kegiatan ini bertujuan untuk merencanakan pelatihan budidaya
              ternak lele di desa. Dalam pertemuan persiapan ini, panitia dan
              pihak terkait akan membahas kebutuhan, jadwal, serta materi
              pelatihan agar pelaksanaan berjalan lancar dan sesuai dengan
              kebutuhan masyarakat.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.6,
                mb: 2,
                color: '#374151',
                textAlign: 'justify',
              }}
            >
              Kegiatan ini bertujuan untuk merencanakan pelatihan budidaya
              ternak lele di desa. Dalam pertemuan persiapan ini, panitia dan
              pihak terkait akan membahas kebutuhan, jadwal, serta materi
              pelatihan agar pelaksanaan berjalan lancar dan sesuai dengan
              kebutuhan masyarakat.
            </Typography>
          </>
        )}
      </Box>

      {/* Documentation Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            mb: 3,
            color: '#1F2937',
            fontSize: '1.25rem',
          }}
        >
          Documentation
        </Typography>
        {selectedDemosite.photos && selectedDemosite.photos.length > 0 ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 2,
              maxWidth: '600px',
            }}
          >
            {selectedDemosite.photos.slice(0, 3).map((photo, index) => (
              <Box
                key={index}
                sx={{
                  borderRadius: '8px',
                  overflow: 'hidden',
                  aspectRatio: '4/3',
                  position: 'relative',
                }}
              >
                <img
                  src={photo}
                  alt={`Documentation ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            ))}
          </Box>
        ) : (
          // Default placeholder images as shown in design
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 2,
              maxWidth: '600px',
            }}
          >
            {[1, 2, 3].map((index) => (
              <Box
                key={index}
                sx={{
                  borderRadius: '8px',
                  overflow: 'hidden',
                  aspectRatio: '4/3',
                  position: 'relative',
                  backgroundColor: '#F3F4F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Documentation {index}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Metadata Section */}
      <Box
        sx={{
          borderTop: '1px solid #E5E7EB',
          pt: 3,
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 3,
          maxWidth: '500px',
        }}
      >
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Created At
          </Typography>
          <Typography variant="body1" sx={{ color: '#374151' }}>
            {selectedDemosite.createdAt
              ? new Date(selectedDemosite.createdAt).toLocaleDateString(
                  'en-US',
                  {
                    month: 'numeric',
                    day: 'numeric',
                    year: 'numeric',
                  }
                )
              : '8/1/2025'}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Updated At
          </Typography>
          <Typography variant="body1" sx={{ color: '#374151' }}>
            {selectedDemosite.updatedAt
              ? new Date(selectedDemosite.updatedAt).toLocaleDateString(
                  'en-US',
                  {
                    month: 'numeric',
                    day: 'numeric',
                    year: 'numeric',
                  }
                )
              : '9/1/2025'}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Created By
          </Typography>
          <Typography variant="body1" sx={{ color: '#374151' }}>
            {selectedDemosite.createdBy || 'admin_user_01'}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Updated By
          </Typography>
          <Typography variant="body1" sx={{ color: '#374151' }}>
            {selectedDemosite.updatedBy || 'admin_user_02'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
