import React from 'react';
import { CustomBreadcrumbs } from '@/components';
import { BreadcrumbItem } from '@/stores/demositeStore';
import { DemositeData } from '@/types/demosite';
import { Box, Chip, IconButton, Typography } from '@mui/material';
import { CaretLeftIcon } from '@phosphor-icons/react';

export const Header = ({
  breadcrumbs,
  demositeData,
  handleBack,
}: {
  breadcrumbs: BreadcrumbItem[];
  demositeData: DemositeData;
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
            {demositeData?.title || 'Demosite Detail'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            label={demositeData?.type || 'Unknown'}
            variant="outlined"
            size="small"
            sx={{
              backgroundColor: '#E1F6FD',
              color: '#0092D1',
              border: '1px solid #0092D1',
            }}
          />
          {demositeData?.isTop10 && (
            <Chip
              label="Top 10"
              size="small"
              sx={{
                backgroundColor: '#FFF3CD',
                color: '#856404',
                border: '1px solid #FFEAA7',
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};
