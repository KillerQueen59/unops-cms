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
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Box
                sx={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#D97706',
                }}
              />
              In Progress
            </Box>
          }
          sx={{
            border: '1px solid #D97706',
            color: '#D97706',
            fontWeight: 500,
            height: '32px',
          }}
          variant="outlined"
        />
      </Box>

      {/* Training Info */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 4,
          mb: 4,
          px: 2,
        }}
      >
        {/* Training Type */}
        <Box>
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
        <Box>
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
        <Box>
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
        <Box>
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
