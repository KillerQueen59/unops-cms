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
            backgroundImage:
              'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
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
          Kegiatan ini bertujuan untuk merencanakan pelatihan budidaya ternak
          lele di desa. Dalam pertemuan persiapan ini, panitia dan pihak terkait
          akan membahas kebutuhan, jadwal, serta materi pelatihan agar
          pelaksanaan berjalan lancar dan sesuai dengan kebutuhan masyarakat.
        </Typography>

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
          Kegiatan ini bertujuan untuk merencanakan pelatihan budidaya ternak
          lele di desa. Dalam pertemuan persiapan ini, panitia dan pihak terkait
          akan membahas kebutuhan, jadwal, serta materi pelatihan agar
          pelaksanaan berjalan lancar dan sesuai dengan kebutuhan masyarakat.
        </Typography>

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
          Kegiatan ini bertujuan untuk merencanakan pelatihan budidaya ternak
          lele di desa. Dalam pertemuan persiapan ini, panitia dan pihak terkait
          akan membahas kebutuhan, jadwal, serta materi pelatihan agar
          pelaksanaan berjalan lancar dan sesuai dengan kebutuhan masyarakat.
        </Typography>

        <Typography
          variant="body1"
          sx={{
            lineHeight: 1.8,
            mb: 4,
            color: '#374151',
            textAlign: 'justify',
            fontSize: '16px',
          }}
        >
          Kegiatan ini bertujuan untuk merencanakan pelatihan budidaya ternak
          lele di desa. Dalam pertemuan persiapan ini, panitia dan pihak terkait
          akan membahas kebutuhan, jadwal, serta materi pelatihan agar
          pelaksanaan berjalan lancar dan sesuai dengan kebutuhan masyarakat.
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
            fontSize: '18px',
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
          {[
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1571501679680-de32f1e7aad4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          ].map((imageUrl, index) => (
            <Box
              key={index}
              sx={{
                borderRadius: '12px',
                overflow: 'hidden',
                aspectRatio: '4/3',
                position: 'relative',
                backgroundImage: `url(${imageUrl})`,
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
