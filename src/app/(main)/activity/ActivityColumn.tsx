import { Box, Chip, IconButton } from '@mui/material';
import { ColumnDef } from '@tanstack/react-table';
import {
  FileMagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
} from '@phosphor-icons/react';
import dayjs from 'dayjs';
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
    accessorKey: 'villageId',
    header: 'Village ID',
  },
  {
    accessorKey: 'startDate',
    header: 'Start Date',
    cell: ({ row }) => {
      const startDate = row.original.startDate;
      if (!startDate) return '-';
      return dayjs(startDate).format('DD MMM YYYY');
    },
  },
  {
    accessorKey: 'endDate',
    header: 'End Date',
    cell: ({ row }) => {
      const endDate = row.original.endDate;
      if (!endDate) return '-';
      return dayjs(endDate).format('DD MMM YYYY');
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;

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

      const colors = getStatusColors(status);

      return (
        <Chip
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Box
                sx={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: colors.backgroundColor,
                }}
              />
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Box>
          }
          sx={{
            border: `1px solid ${colors.color}`,
            color: colors.color,
            fontWeight: 500,
            height: '32px',
          }}
          variant="outlined"
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
