import theme from '@/theme';
import styled from '@emotion/styled';
import { TableCell, tableCellClasses, Box } from '@mui/material';

export const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#E1F6FD',
    color: '#374151',
    height: 70,
    fontWeight: 'bold',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    height: 70,
  },
}));

export const EmptyTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    height: '50vh',
  },
}));

export const CustomTableFooter = styled(Box)(() => ({
  backgroundColor: theme.palette.common.white,
  padding: theme.spacing(1),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  marginTop: '40px',
}));

export const FooterText = styled(Box)(() => ({
  fontSize: 14,
  height: 50,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
}));

export const PaginationContainer = styled(Box)(() => ({
  padding: theme.spacing(1),
}));
