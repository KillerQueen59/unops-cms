import { DemositeData } from '@/types/demosite';
import { Box, CardMedia, Typography } from '@mui/material';
import { ArrowRightIcon } from '@phosphor-icons/react';

export const ListCard = ({
  demosite,
  handleView,
}: {
  demosite: DemositeData;
  handleView: (data: DemositeData) => void;
  handleEdit: (data: DemositeData) => void;
  handleDelete: (data: DemositeData) => void;
}) => {
  const placeholderUrl = 'https://via.placeholder.com/300x200?text=No+Image';

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = placeholderUrl;
  };

  // Ensure we have a valid image URL or fall back to placeholder
  const imageUrl =
    demosite.header && demosite.header.trim() !== ''
      ? `http://${demosite.header}`
      : placeholderUrl;

  return (
    <Box
      key={demosite.id}
      sx={{
        cursor: 'pointer',
        height: '380px',
      }}
      onClick={() => handleView(demosite)}
    >
      {/* Card Image */}
      <CardMedia
        component="img"
        height="180"
        image={imageUrl}
        alt={demosite.title || 'Demosite image'}
        onError={handleImageError}
        sx={{
          objectFit: 'cover',
          borderRadius: '16px',
          mb: '16px',
        }}
      />

      <Box>
        {/* Type Badge */}
        <Box
          sx={{
            mb: 1,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography fontSize={12} color="secondary.main" fontWeight={'bold'}>
            {demosite.type}
          </Typography>
          <Typography fontSize={12}>{demosite.createdAt}</Typography>
        </Box>

        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            fontSize: '16px',
            mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxHeight: '50px',
          }}
        >
          {demosite.title}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            fontSize: '14px',
            lineHeight: 1.4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxHeight: '60px',
            maxLines: 3,
            mb: 2,
            textAlign: 'justify',
          }}
        >
          {demosite.story}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="body2"
            color="primary.main"
            sx={{
              fontSize: '14px',
              lineHeight: 1.4,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              cursor: 'pointer',
              ':hover': { textDecoration: 'underline' },
            }}
          >
            Read more
          </Typography>
          <ArrowRightIcon size={16} color="#0092D1" />
        </Box>
      </Box>
    </Box>
  );
};
