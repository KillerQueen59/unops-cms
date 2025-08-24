import { Box, Chip, IconButton } from '@mui/material';
import { ColumnDef } from '@tanstack/react-table';
import {
  FileMagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
} from '@phosphor-icons/react';
import { ActivityData } from '@/types/activity';

interface ActivityColumnProps {
  onView?: (data: ActivityData) => void;
  onEdit?: (data: ActivityData) => void;
  onDelete?: (data: ActivityData) => void;
}

export const createActivityColumns = ({
  onView,
  onEdit,
  onDelete,
}: ActivityColumnProps): ColumnDef<ActivityData, unknown>[] => [
  {
    accessorKey: 'activityName',
    header: 'Activity Name',
  },
  {
    accessorKey: 'activityCategory',
    header: 'Category',
  },
  {
    accessorKey: 'startDate',
    header: 'Start Date',
  },
  {
    accessorKey: 'endDate',
    header: 'End Date',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;

      const getStatusColors = (status: string) => {
        switch (status) {
          case 'active':
            return {
              backgroundColor: '#D1FAE5',
              color: '#059669',
            };
          case 'inactive':
            return {
              backgroundColor: '#FEE2E2',
              color: '#DC2626',
            };
          default:
            return {
              backgroundColor: '#F3F4F6',
              color: '#6B7280',
            };
        }
      };

      const colors = getStatusColors(status);

      return (
        <Chip
          label={status}
          sx={{
            backgroundColor: colors.backgroundColor,
            color: colors.color,
            fontWeight: 500,
            borderRadius: '8px',
            height: '32px',
            textTransform: 'capitalize',
          }}
        />
      );
    },
  },
  {
    id: 'actions',
    header: 'Action',
    cell: ({ row }) => (
      <Box sx={{ display: 'flex', gap: 2 }}>
        <IconButton
          size="small"
          onClick={() => onView?.(row.original)}
          sx={{
            border: '1.5px solid #E5E7EB',
            borderRadius: '8px',
            background: '#F7F8FA',
            width: 32,
            height: 32,
            color: '#6B7280',
            transition: 'background 0.2s',
            '&:hover': {
              background: '#E5E7EB',
              color: '#0092D1',
              borderColor: '#0092D1',
            },
          }}
        >
          <FileMagnifyingGlassIcon size={20} />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onEdit?.(row.original)}
          sx={{
            border: '1.5px solid #E5E7EB',
            borderRadius: '8px',
            background: '#F7F8FA',
            width: 32,
            height: 32,
            color: '#6B7280',
            transition: 'background 0.2s',
            '&:hover': {
              background: '#E5E7EB',
              color: '#0092D1',
              borderColor: '#0092D1',
            },
          }}
        >
          <PencilIcon size={20} />
        </IconButton>
        {/* Guard for superadmin only */}
        <IconButton
          size="small"
          onClick={() => onDelete?.(row.original)}
          sx={{
            border: '1.5px solid #FECACA',
            borderRadius: '8px',
            background: '#FFF1F2',
            width: 32,
            height: 32,
            color: '#DC2626',
            transition: 'background 0.2s',
            '&:hover': {
              background: '#FECACA',
              color: '#B91C1C',
              borderColor: '#B91C1C',
            },
          }}
        >
          <TrashIcon size={20} />
        </IconButton>
      </Box>
    ),
    enableSorting: false,
    enableColumnFilter: false,
  },
];
