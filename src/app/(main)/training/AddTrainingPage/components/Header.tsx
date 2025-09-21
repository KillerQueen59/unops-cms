import { CustomBreadcrumbs } from '@/components';
import { BreadcrumbItem } from '@/types/common';
import { Box, IconButton, Typography } from '@mui/material';
import { CaretLeftIcon } from '@phosphor-icons/react';

export const Header = ({
  breadcrumbs,
  isEditMode,
  handleBack,
}: {
  breadcrumbs: BreadcrumbItem[];
  isEditMode: boolean;
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
          justifyItems: 'center',
          gap: '12px',
          mb: 3,
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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              color: '#374151',
            }}
          >
            {isEditMode ? 'Edit Training' : 'Add New Training'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
