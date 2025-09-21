import { DataFile } from '@/types/data';
import { Box, IconButton, Typography } from '@mui/material';
import { ColumnDef } from '@tanstack/react-table';
import {
  FileMagnifyingGlassIcon,
  DownloadIcon,
  TrashIcon,
} from '@phosphor-icons/react';
import { southSumatraRegencies } from '../village/constants';

interface DataColumnProps {
  onView?: (data: DataFile) => void;
  onDownload?: (data: DataFile) => void;
  onDelete?: (data: DataFile) => void;
}

export const createDataColumns = ({
  onView,
  onDownload,
  onDelete,
}: DataColumnProps): ColumnDef<DataFile, unknown>[] => [
  {
    accessorKey: 'documentName',
    header: 'Document Name',
    cell: ({ row }) => (
      <Box>
        <Typography
          variant="body2"
          sx={{ fontWeight: 'medium', color: '#374151' }}
        >
          {row.original.documentName}
        </Typography>
        <Typography variant="caption" sx={{ color: '#6B7280' }}>
          {row.original.fileName}
        </Typography>
      </Box>
    ),
  },
  {
    accessorKey: 'createdDate',
    header: 'Created Date',
    cell: ({ row }) => (
      <Typography variant="body2" sx={{ color: '#6B7280' }}>
        {new Date(row.original.createdDate).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </Typography>
    ),
  },
  {
    accessorKey: 'regency',
    header: 'Regency',
    cell: ({ row }) => {
      console.log(row.original.regency, southSumatraRegencies);
      return (
        <Typography variant="body2" sx={{ color: '#6B7280' }}>
          {row.original.regency
            ? southSumatraRegencies.find(
                (reg) => reg.code == row.original.regency
              )?.name || 'Other'
            : 'Other'}
        </Typography>
      );
    },
  },
  {
    id: 'actions',
    header: 'Action',
    cell: ({ row }) => (
      <Box sx={{ display: 'flex', gap: 1 }}>
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
          onClick={() => onDownload?.(row.original)}
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
          <DownloadIcon size={20} />
        </IconButton>
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
