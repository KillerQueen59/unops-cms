import { CustomBreadcrumbs } from '@/components';
import { BreadcrumbItem } from '@/stores/trainingStore';
import { ActivityData } from '@/types/activity';
import { Box, Chip, IconButton, Typography } from '@mui/material';
import { CaretLeftIcon } from '@phosphor-icons/react';

export const Header = ({
  breadcrumbs,
  activityData,
  handleBack,
}: {
  breadcrumbs: BreadcrumbItem[];
  activityData: ActivityData;
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
            {activityData.activityName}
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

      {/* Activity Info */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 4,
          mb: 4,
          px: 2,
        }}
      >
        <Box>
          <Typography
            variant="body2"
            sx={{ color: '#6B7280', fontSize: '13px', mb: 0.5 }}
          >
            Category
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#1F2937', fontWeight: 600, fontSize: '16px' }}
          >
            {activityData.activityCategory}
          </Typography>
        </Box>

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
            {activityData.startDate}
          </Typography>
        </Box>

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
            {activityData.endDate}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="body2"
            sx={{ color: '#6B7280', fontSize: '13px', mb: 0.5 }}
          >
            Progress (%)
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#1F2937', fontWeight: 600, fontSize: '16px' }}
          >
            {activityData.progress}%
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(1, 1fr)',
          gap: 4,
          mb: 4,
          px: 2,
        }}
      >
        <Box>
          <Typography
            variant="body2"
            sx={{ color: '#6B7280', fontSize: '13px', mb: 0.5 }}
          >
            Description
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#1F2937', fontWeight: 600, fontSize: '16px' }}
          >
            {activityData.description}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
