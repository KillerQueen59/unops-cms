import { Box, IconButton } from '@mui/material';
import { ColumnDef } from '@tanstack/react-table';
import {
  FileMagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
} from '@phosphor-icons/react';
import { VillageData } from '@/types/village';
import {
  southSumatraRegencies,
  VillageCategory,
  VillageCategoryLabel,
} from './constants';

interface VillageColumnProps {
  onView?: (data: VillageData) => void;
  onEdit?: (data: VillageData) => void;
  onDelete?: (data: VillageData) => void;
}

export const createVillageColumns = ({
  onView,
  onEdit,
  onDelete,
}: VillageColumnProps): ColumnDef<VillageData, unknown>[] => [
  {
    accessorKey: 'villageName',
    header: 'Village Name',
  },
  {
    accessorKey: 'villageCode',
    header: 'Village Code',
  },
  {
    accessorKey: 'villageCoordinate',
    header: 'Village Coordinate',
    cell: ({ row }) =>
      `${row.original.villageLat.toFixed(6) || '-'}, ${row.original.villageLng.toFixed(6) || '-'}`,
  },
  {
    accessorKey: 'villageRegency',
    header: 'Village Regency',
    cell: ({ row }) =>
      southSumatraRegencies.find(
        (regency) =>
          regency.code ===
          row.original.villageCode.split('.').splice(0, 2).join('.')
      )?.name || '-',
  },
  {
    accessorKey: 'categoryName',
    header: 'Village Category',
    cell: ({ row }) =>
      row.original.categoryName === VillageCategory.Category1
        ? VillageCategoryLabel.Category1
        : row.original.categoryName === VillageCategory.Category2
          ? VillageCategoryLabel.Category2
          : '-',
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
