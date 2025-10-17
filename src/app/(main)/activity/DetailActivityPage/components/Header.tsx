import { CustomBreadcrumbs } from '@/components';
import { BreadcrumbItem } from '@/types/common';
import { ActivityData } from '@/types/activity';
import { Box, Button, Chip, IconButton, Typography } from '@mui/material';
import { CaretLeftIcon, TrashIcon } from '@phosphor-icons/react';
import { EditIcon } from 'lucide-react';
import {
  VillageCategory,
  VillageCategoryLabel,
} from '@/app/(main)/village/constants';
import dayjs from 'dayjs';
import { getLocationName } from '../../helper';

export const Header = ({
  breadcrumbs,
  activityData,
  category,
  handleBack,
  handleDelete,
  handleEdit,
}: {
  breadcrumbs: BreadcrumbItem[];
  activityData: ActivityData;
  category: string;
  handleBack: () => void;
  handleDelete: () => void;
  handleEdit: () => void;
}) => {
  const getStatusColors = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          backgroundColor: '#D1FAE5',
          color: '#059669',
        };
      case 'not yet':
        return {
          backgroundColor: '#FEE2E2',
          color: '#DC2626',
        };
      case 'ongoing':
        return {
          backgroundColor: '#FEF3C7',
          color: '#D97706',
        };
      default:
        return {
          backgroundColor: '#F3F4F6',
          color: '#6B7280',
        };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'not yet':
        return 'Not Yet';
      case 'ongoing':
        return 'Ongoing';
      default:
        return 'Unknown';
    }
  };

  const statusColors = getStatusColors(activityData.status);
  const statusLabel = getStatusLabel(activityData.status);

  const locationName = getLocationName(activityData.villageId);
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

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Chip
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Box
                  sx={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: statusColors.color,
                  }}
                />
                {statusLabel}
              </Box>
            }
            sx={{
              border: `1px solid ${statusColors.color}`,
              color: statusColors.color,
              backgroundColor: '#fff',
              fontWeight: 500,
              height: '32px',
            }}
          />
        </Box>
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
            {category === VillageCategory.Category1
              ? VillageCategoryLabel.Category1
              : VillageCategoryLabel.Category2}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="body2"
            sx={{ color: '#6B7280', fontSize: '13px', mb: 0.5 }}
          >
            Location Name
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#1F2937', fontWeight: 600, fontSize: '16px' }}
          >
            {locationName}
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
            {dayjs(activityData.startDate).format('DD MMM YYYY')}
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
            {dayjs(activityData.endDate).format('DD MMM YYYY')}
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
            {activityData.percentage}%
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
            Remarks
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#1F2937', fontWeight: 600, fontSize: '16px' }}
          >
            {activityData.remarks || '-'}
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

      {/* Action Buttons */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
          mb: 4,
          px: 2,
        }}
      >
        <Button
          variant="outlined"
          color="error"
          startIcon={<TrashIcon />}
          onClick={handleDelete}
          sx={{
            borderRadius: '12px',
            width: '180px',
            minHeight: '50px',
            px: 3,
          }}
        >
          Delete Activity
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<EditIcon />}
          onClick={handleEdit}
          sx={{
            borderRadius: '12px',
            width: '180px',
            minHeight: '50px',
            px: 3,
          }}
        >
          Edit Activity
        </Button>
      </Box>
    </Box>
  );
};
