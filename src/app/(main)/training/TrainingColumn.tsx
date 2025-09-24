import { TrainingData } from '@/types/training';
import { Box, IconButton } from '@mui/material';
import { ColumnDef } from '@tanstack/react-table';
import {
  FileMagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
} from '@phosphor-icons/react';
import { trainingTypeOptions } from './constants';

interface TrainingColumnProps {
  onView?: (data: TrainingData) => void;
  onEdit?: (data: TrainingData) => void;
  onDelete?: (data: TrainingData) => void;
  villageOptions?: { label: string; value: string }[];
}

export const createTrainingColumns = ({
  onView,
  onEdit,
  onDelete,
  villageOptions,
}: TrainingColumnProps): ColumnDef<TrainingData, unknown>[] => [
  {
    accessorKey: 'trainingName',
    header: 'Training Name',
  },
  {
    accessorKey: 'trainingType',
    header: 'Training Type',
    cell: ({ row }) => {
      const trainingType = trainingTypeOptions.find(
        (option) => option.value === row.original.trainingType
      );
      return (
        <span className="capitalize">
          {trainingType?.label || trainingType?.value}
        </span>
      );
    },
  },
  {
    accessorKey: 'date',
    header: 'Date',
  },
  {
    accessorKey: 'village',
    header: 'Village Id',
  },
  {
    accessorKey: 'villageName',
    header: 'Village Name',
    cell: ({ row }) => {
      const village = villageOptions?.find(
        (option) => option.value === row.original.village
      );
      return <span>{village ? village.label : 'N/A'}</span>;
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
