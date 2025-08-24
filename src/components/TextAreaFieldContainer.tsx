import React from 'react';
import { Box, Typography, TextField } from '@mui/material';
import {
  Control,
  Controller,
  FieldError,
  FieldValues,
  Path,
} from 'react-hook-form';

import { TextFieldProps } from '@mui/material';

interface TextAreaFieldContainerProps<T extends FieldValues = FieldValues> {
  label?: string;
  name: Path<T>;
  control: Control<T>;
  required?: boolean;
  sx?: object;
  error?: FieldError;
  placeholder?: string;
  rows?: number;
  InputProps?: TextFieldProps['InputProps'];
}

export const TextAreaFieldContainer = <T extends FieldValues = FieldValues>(
  props: TextAreaFieldContainerProps<T>
) => {
  const {
    label,
    name,
    control,
    required = false,
    sx,
    error,
    placeholder,
    rows = 4,
    InputProps,
  } = props;

  return (
    <Box sx={{ flex: '1 1 100%', minWidth: '100%', ...sx }}>
      {label && (
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
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            multiline
            rows={rows}
            placeholder={placeholder}
            error={!!error}
            helperText={error?.message}
            InputProps={InputProps}
            sx={{
              backgroundColor: '#fff',
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: '#fff',
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#9CA3AF',
                opacity: 1,
              },
              '& .MuiInputBase-root': {
                alignItems: 'flex-start',
              },
            }}
          />
        )}
      />
    </Box>
  );
};
