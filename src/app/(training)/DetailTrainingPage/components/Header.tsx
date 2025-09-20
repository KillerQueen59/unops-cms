import { CustomBreadcrumbs } from '@/components';
import { BreadcrumbItem } from '@/types/common';
import { TrainingData } from '@/types/training';
import { Box, IconButton, Typography, Chip, Button } from '@mui/material';
import { CaretLeftIcon } from '@phosphor-icons/react';
import { TrashIcon } from '@phosphor-icons/react/dist/ssr';
import { EditIcon } from 'lucide-react';
export const Header = ({
  breadcrumbs,
  trainingData,
  handleBack,
  handleDelete,
  handleEdit,
}: {
  breadcrumbs: BreadcrumbItem[];
  trainingData: TrainingData;
  handleBack: () => void;
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

        {/* Date */}
        <Box>
          <Typography
            variant="body2"
            sx={{ color: '#6B7280', fontSize: '13px', mb: 0.5 }}
          >
            Date
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#1F2937', fontWeight: 600, fontSize: '16px' }}
          >
            {trainingData.date}
          </Typography>
        </Box>
      </Box>
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
