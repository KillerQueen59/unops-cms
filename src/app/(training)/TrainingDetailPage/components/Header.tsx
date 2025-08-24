import { CustomBreadcrumbs } from '@/components';
import { BreadcrumbItem } from '@/stores/trainingStore';
import { TrainingData } from '@/types/training';
import { Box, IconButton, Typography, Chip } from '@mui/material';
import { CaretLeftIcon } from '@phosphor-icons/react';

export const Header = ({
  breadcrumbs,
  trainingData,
  handleBack,
}: {
  breadcrumbs: BreadcrumbItem[];
  trainingData: TrainingData;
  handleBack: () => void;
}) => {
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <CustomBreadcrumbs breadcrumbs={breadcrumbs} />
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 4,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <IconButton
            onClick={handleBack}
            sx={{
              border: '1px solid #0092D1',
              borderRadius: '12px',
              width: 48,
              height: 48,
              color: '#0092D1',
            }}
          >
            <CaretLeftIcon />
          </IconButton>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              color: '#374151',
            }}
          >
            {trainingData.trainingName}
          </Typography>
        </Box>

        <Chip
          label="In Progress"
          sx={{
            backgroundColor: '#FEF3C7',
            color: '#D97706',
            fontWeight: 500,
            borderRadius: '8px',
            height: '32px',
          }}
        />
      </Box>

      {/* Training Info */}
      <Box
        sx={{
          display: 'flex',
          mb: 4,
          flexWrap: 'nowrap',
          justifyContent: 'flex-start',
          gap: 8,
          px: 2,
        }}
      >
        {/* Training Type */}
        <Box sx={{ minWidth: 180 }}>
          <Typography
            variant="body2"
            sx={{ color: '#6B7280', fontSize: '13px', mb: 0.5 }}
          >
            Training Type
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#1F2937', fontWeight: 600, fontSize: '16px' }}
          >
            {trainingData.trainingType}
          </Typography>
        </Box>

        {/* Desa */}
        <Box sx={{ minWidth: 220 }}>
          <Typography
            variant="body2"
            sx={{ color: '#6B7280', fontSize: '13px', mb: 0.5 }}
          >
            Desa
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#1F2937', fontWeight: 600, fontSize: '16px' }}
          >
            {trainingData.village}
          </Typography>
        </Box>

        {/* Start Date */}
        <Box sx={{ minWidth: 180 }}>
          <Typography
            variant="body2"
            sx={{ color: '#6B7280', fontSize: '13px', mb: 0.5 }}
          >
            Start Date
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#1F2937', fontWeight: 600, fontSize: '16px' }}
          >
            {trainingData.startDate}
          </Typography>
        </Box>

        {/* End Date */}
        <Box sx={{ minWidth: 180 }}>
          <Typography
            variant="body2"
            sx={{ color: '#6B7280', fontSize: '13px', mb: 0.5 }}
          >
            End Date
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#1F2937', fontWeight: 600, fontSize: '16px' }}
          >
            {trainingData.endDate && trainingData.endDate !== '-'
              ? trainingData.endDate
              : '-'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
