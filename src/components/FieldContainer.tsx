import React from 'react';
import { Box, Typography } from '@mui/material';

interface FieldContainerProps {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  sx?: object;
}

export const FieldContainer: React.FC<FieldContainerProps> = ({
  label,
  children,
  required = false,
  sx,
}) => {
  return (
    <Box sx={{ flex: '1 1 300px', minWidth: '300px', ...sx }}>
      <Typography
        variant="body2"
        sx={{
          color: '#374151',
          fontWeight: 500,
          mb: 1,
        }}
      >
        {label}
        {required && (
          <span style={{ color: '#EF4444', marginLeft: '4px' }}>*</span>
        )}
      </Typography>
      {children}
    </Box>
  );
};
