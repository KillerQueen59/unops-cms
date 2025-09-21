import { CustomBreadcrumbs } from '@/components';
import { BreadcrumbItem } from '@/types/common';
import { ActivityData } from '@/types/activity';
import { Box, Button, Chip, IconButton, Typography } from '@mui/material';
import { CaretLeftIcon, PencilIcon, TrashIcon } from '@phosphor-icons/react';
import { EditIcon } from 'lucide-react';

export const Header = ({
  breadcrumbs,
  activityData,
  handleBack,
  villageName,
  category,
  handleDelete,
  handleEdit,
}: {
  breadcrumbs: BreadcrumbItem[];
  activityData: ActivityData;
  handleBack: () => void;
  villageName: string;
  category: string;
  handleDelete: () => void;
  handleEdit: () => void;
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

        <Box sx={{ display: 'flex', gap: 2 }}>
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
            {category}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="body2"
            sx={{ color: '#6B7280', fontSize: '13px', mb: 0.5 }}
          >
            Village Name
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#1F2937', fontWeight: 600, fontSize: '16px' }}
          >
            {villageName}
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
          Delete Village
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
          Edit Village
        </Button>
      </Box>
    </Box>
  );
};
