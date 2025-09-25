'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  Row,
  PaginationState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Box,
  IconButton,
  Typography,
  Chip,
  InputAdornment,
  Button,
  Pagination,
  MenuItem as SelectMenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  UnfoldMore,
  ExpandLess,
  ExpandMore,
  TuneOutlined,
} from '@mui/icons-material';
import {
  CustomTableFooter,
  EmptyTableCell,
  FooterText,
  PaginationContainer,
  StyledTableCell,
} from './DataTable.stlyes';

export interface DataTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  title?: string;
  searchable?: boolean;
  filterable?: boolean;
  loading?: boolean;
  dense?: boolean;
  stickyHeader?: boolean;
  maxHeight?: number | string;
  pageSize?: number;
  pageSizeOptions?: number[];
  setExternalGlobalFilter?: (filter: string) => void;
  externalGlobalFilter?: string;
  // Server-side pagination props
  manualPagination?: boolean;
  totalItems?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

// Global filter function that searches across all columns
const globalFilterFn = <T,>(
  row: Row<T>,
  _columnId: string,
  value: string
): boolean => {
  const search = value.toLowerCase();

  // Get all cell values from the row
  const rowValues = Object.values(row.original as Record<string, unknown>)
    .join(' ')
    .toLowerCase();

  return rowValues.includes(search);
};

export default function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  loading = false,
  dense = false,
  stickyHeader = false,
  pageSize = 10,
  pageSizeOptions = [5, 10, 25, 50],
  setExternalGlobalFilter,
  externalGlobalFilter,
  // Server-side pagination props
  manualPagination = false,
  totalItems,
  currentPage = 1,
  onPageChange,
  onPageSizeChange,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize,
  });

  useEffect(() => {
    if (externalGlobalFilter !== undefined) {
      setGlobalFilter(externalGlobalFilter);
    }
  }, [externalGlobalFilter]);

  // Update pagination state when pageSize prop changes (for server-side pagination)
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      pageSize: pageSize,
    }));
  }, [pageSize]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn,
    manualPagination: manualPagination,
    pageCount: manualPagination
      ? Math.ceil((totalItems || 0) / pagination.pageSize)
      : -1,
  });

  // Use different logic based on pagination mode
  const actualTotalItems = manualPagination ? totalItems || 0 : data.length;
  const actualCurrentPage = manualPagination
    ? currentPage
    : table.getState().pagination.pageIndex + 1;
  const itemsPerPage = table.getState().pagination.pageSize;
  const actualTotalPages = Math.ceil(actualTotalItems / itemsPerPage);
  const startItem = (actualCurrentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(actualCurrentPage * itemsPerPage, actualTotalItems);

  const handleRowsPerPageChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<{ value: unknown }>
      | SelectChangeEvent<number>
  ) => {
    const value = event.target.value;
    const newPageSize = Number(value);

    if (manualPagination && onPageSizeChange) {
      onPageSizeChange(newPageSize);
    } else {
      setPagination({
        pageIndex: 0,
        pageSize: newPageSize,
      });
    }
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    if (manualPagination && onPageChange) {
      onPageChange(newPage);
    } else {
      setPagination((prev) => ({ ...prev, pageIndex: newPage - 1 }));
    }
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '16px' }}>
      {/* Table Section */}
      <Paper sx={{ overflow: 'hidden', padding: '0px 28px' }}>
        <TableContainer
          sx={{
            borderRadius: '16px 16px 0 0',
            overflow: 'hidden',
          }}
        >
          <Table stickyHeader={stickyHeader} size={dense ? 'small' : 'medium'}>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <StyledTableCell
                      key={header.id}
                      sx={{
                        cursor: header.column.getCanSort()
                          ? 'pointer'
                          : 'default',
                      }}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <Typography>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </Typography>

                        {header.column.getCanSort() && (
                          <Box
                            sx={{ display: 'flex', flexDirection: 'column' }}
                          >
                            {header.column.getIsSorted() !== 'asc' &&
                              header.column.getIsSorted() !== 'desc' && (
                                <UnfoldMore fontSize="small" />
                              )}
                            {header.column.getIsSorted() === 'asc' && (
                              <ExpandLess fontSize="small" />
                            )}
                            {header.column.getIsSorted() === 'desc' && (
                              <ExpandMore fontSize="small" />
                            )}
                          </Box>
                        )}
                      </Box>
                    </StyledTableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <EmptyTableCell colSpan={columns.length} align="center">
                    <Typography>Loading...</Typography>
                  </EmptyTableCell>
                </TableRow>
              ) : table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <EmptyTableCell colSpan={columns.length} align="center">
                    <Typography color="text.secondary">
                      No data available
                    </Typography>
                  </EmptyTableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <StyledTableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </StyledTableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Custom Footer */}
        <CustomTableFooter>
          <FooterText>
            <Typography variant="body2">
              Showing{' '}
              <Box
                component="span"
                sx={{ color: 'primary.main', fontWeight: 'bold' }}
              >
                {startItem} to {endItem}
              </Box>{' '}
              of {actualTotalItems} items.
            </Typography>
            <FormControl size="small" variant="outlined">
              <InputLabel>Rows per page</InputLabel>
              <Select
                value={pagination.pageSize}
                onChange={handleRowsPerPageChange}
                label="Rows per page"
                sx={{ minWidth: 120 }}
              >
                {pageSizeOptions.map((option) => (
                  <SelectMenuItem key={option} value={option}>
                    {option}
                  </SelectMenuItem>
                ))}
              </Select>
            </FormControl>
          </FooterText>
          <PaginationContainer>
            <Pagination
              count={actualTotalPages}
              page={actualCurrentPage}
              onChange={handlePageChange}
              shape="rounded"
              color="primary"
              siblingCount={1}
              boundaryCount={1}
              disabled={loading || actualTotalPages <= 1}
            />
          </PaginationContainer>
        </CustomTableFooter>
      </Paper>
    </Paper>
  );
}
