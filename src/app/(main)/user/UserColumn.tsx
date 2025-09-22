import { User, UserStatus } from '@/types/user';
import { Box, IconButton, Typography, Chip } from '@mui/material';
import { ColumnDef } from '@tanstack/react-table';
import {
  FileMagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
} from '@phosphor-icons/react';

interface UserColumnProps {
  onView?: (user: User) => void;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
}

export const createUserColumns = ({
  onView,
  onEdit,
  onDelete,
}: UserColumnProps): ColumnDef<User>[] => [
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => (
      <Typography variant="body2" sx={{ color: '#374151', fontWeight: 500 }}>
        {row.original.email}
      </Typography>
    ),
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => (
      <Typography variant="body2" sx={{ color: '#6B7280' }}>
        {row.original.role}
      </Typography>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Chip
        label={row.original.status}
        size="small"
        sx={{
          backgroundColor:
            row.original.status === UserStatus.ACTIVE ? '#D1FAE5' : '#FEF3C7',
          color:
            row.original.status === UserStatus.ACTIVE ? '#065F46' : '#92400E',
          border: `1px solid ${row.original.status === UserStatus.ACTIVE ? '#10B981' : '#F59E0B'}`,
          fontWeight: 500,
          fontSize: '12px',
          '& .MuiChip-label': {
            px: 1.5,
          },
        }}
      />
    ),
  },
  {
    accessorKey: 'lastLogin',
    header: 'Last Login',
    cell: ({ row }) => (
      <Box>
        <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '14px' }}>
          {row.original.lastLogin === 'Never'
            ? 'Never'
            : new Date(row.original.lastLogin).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
        </Typography>
        {row.original.lastLogin !== 'Never' && (
          <Typography
            variant="caption"
            sx={{ color: '#9CA3AF', fontSize: '12px' }}
          >
            {new Date(row.original.lastLogin).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Typography>
        )}
      </Box>
    ),
  },
  {
    id: 'actions',
    header: 'Action',
    cell: ({ row }) => (
      <Box sx={{ display: 'flex', gap: 1 }}>
        {/* <IconButton
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
            },
          }}
        >
          <FileMagnifyingGlassIcon size={16} />
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
            },
          }}
        >
          <PencilIcon size={16} />
        </IconButton> */}
        <IconButton
          size="small"
          onClick={() => onDelete?.(row.original)}
          sx={{
            border: '1.5px solid #FEE2E2',
            borderRadius: '8px',
            background: '#FEF2F2',
            width: 32,
            height: 32,
            color: '#DC2626',
            transition: 'background 0.2s',
            '&:hover': {
              background: '#FEE2E2',
            },
          }}
        >
          <TrashIcon size={16} />
        </IconButton>
      </Box>
    ),
  },
];
