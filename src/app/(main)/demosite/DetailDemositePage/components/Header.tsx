import React from 'react';
import { CustomBreadcrumbs } from '@/components';
import { BreadcrumbItem } from '@/stores/demositeStore';
import { DemositeData } from '@/types/demosite';
import { Box, Button, Chip, IconButton, Typography } from '@mui/material';
import { CaretLeftIcon, PencilIcon, TrashIcon } from '@phosphor-icons/react';
import { EditIcon } from 'lucide-react';

export const Header = ({
  breadcrumbs,
  demositeData,
  handleBack,
  handleDelete,
  handleEdit,
}: {
  breadcrumbs: BreadcrumbItem[];
  demositeData: DemositeData;
  handleBack: () => void;
  handleDelete: () => void;
  handleEdit: () => void;
}) => {
  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <CustomBreadcrumbs breadcrumbs={breadcrumbs} />
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
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
          <div>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                color: '#374151',
                mb: 1,
                fontSize: { xs: '24px', md: '32px' },
              }}
            >
              {demositeData?.title || 'Demosite Detail'}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                flexWrap: 'wrap',
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: '#9CA3AF',
                  fontSize: '16px',
                }}
              >
                {demositeData?.name}
              </Typography>

              {demositeData?.name && demositeData?.type && (
                <Box
                  sx={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    backgroundColor: '#9CA3AF',
                  }}
                />
              )}

              <Typography
                variant="body1"
                sx={{
                  color: '#9CA3AF',
                  fontSize: '16px',
                }}
              >
                {demositeData?.type}
              </Typography>
            </Box>
          </div>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
              Delete
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
              Edit
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
