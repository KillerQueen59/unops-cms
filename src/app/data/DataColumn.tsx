import { DataFile } from '@/types/data';
import { Box, IconButton, Typography } from '@mui/material';
import { ColumnDef } from '@tanstack/react-table';
import {
  FileMagnifyingGlassIcon,
  DownloadIcon,
  TrashIcon,
} from '@phosphor-icons/react';

interface DataColumnProps {
  onView?: (data: DataFile) => void;
  onDownload?: (data: DataFile) => void;
  onDelete?: (data: DataFile) => void;
}

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper function to get file type display name
const getFileTypeDisplay = (fileType: string): string => {
  const typeMap: { [key: string]: string } = {
    'application/pdf': 'PDF',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      'Word',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      'Excel',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      'PowerPoint',
    'image/jpeg': 'JPEG',
    'image/jpg': 'JPG',
    'image/png': 'PNG',
    'application/zip': 'ZIP',
    'text/csv': 'CSV',
    'application/vnd.google-earth.kml+xml': 'KML',
  };

  return (
    typeMap[fileType] || fileType.split('/')[1]?.toUpperCase() || 'Unknown'
  );
};

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
    accessorKey: 'fileType',
    header: 'Type',
    cell: ({ row }) => (
      <Typography
        variant="body2"
        sx={{
          backgroundColor: '#F3F4F6',
          color: '#374151',
          px: 2,
          py: 0.5,
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: 'medium',
          textAlign: 'center',
          minWidth: 'fit-content',
        }}
      >
        {getFileTypeDisplay(row.original.fileType)}
      </Typography>
    ),
  },
  {
    accessorKey: 'fileSize',
    header: 'Size',
    cell: ({ row }) => (
      <Typography variant="body2" sx={{ color: '#6B7280' }}>
        {formatFileSize(row.original.fileSize)}
      </Typography>
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
