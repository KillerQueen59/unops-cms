import React from 'react';
import { CustomBreadcrumbs } from '@/components';
import { BreadcrumbItem } from '@/stores/demositeStore';
import { DemositeData } from '@/types/demosite';
import { Box, Button, Chip, IconButton, Typography } from '@mui/material';
import { CaretLeftIcon, PencilIcon, TrashIcon } from '@phosphor-icons/react';

export const Header = ({
  breadcrumbs,
  demositeData,
  handleBack,
  handleEdit,
}: {
  breadcrumbs: BreadcrumbItem[];
  demositeData: DemositeData;
  handleBack: () => void;
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
            {demositeData?.title || 'Demosite Detail'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<TrashIcon size={16} />}
              sx={{
                borderColor: '#EF4444',
                color: '#EF4444',
                '&:hover': {
                  borderColor: '#DC2626',
                  backgroundColor: 'rgba(239, 68, 68, 0.04)',
                },
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                minWidth: '140px',
                height: '40px',
              }}
            >
              Delete
            </Button>
            <Button
              variant="outlined"
              startIcon={<PencilIcon size={16} />}
              onClick={handleEdit}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                minWidth: '140px',
                height: '40px',
              }}
            >
              Edit
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
