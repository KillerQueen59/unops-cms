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

interface ControlledFieldContainerProps<T extends FieldValues = FieldValues> {
  label?: string;
  name: Path<T>;
  control: Control<T>;
  children?: React.ReactNode;
  required?: boolean;
  sx?: object;
  error?: FieldError;
  placeholder?: string;
  type?: string;
  InputProps?: TextFieldProps['InputProps'];
}

export const ControlledFieldContainer = <T extends FieldValues = FieldValues>(
  props: ControlledFieldContainerProps<T>
) => {
  const {
    label,
    name,
    control,
    children,
    required = false,
    sx,
    error,
    placeholder,
    type = 'text',
    InputProps,
  } = props;
  return (
    <Box sx={{ flex: '1 1 300px', minWidth: '300px', ...sx }}>
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

      {children ? (
        children
      ) : (
        <Controller
          name={name}
          control={control}
          render={({ field }) => {
            // If startAdornment exists, clone it with a style for gap
            let inputProps = InputProps;
            if (InputProps && InputProps.startAdornment) {
              inputProps = {
                ...InputProps,
                startAdornment: (
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      paddingLeft: 4,
                      paddingRight: 16,
                    }}
                  >
                    {InputProps.startAdornment}
                  </span>
                ),
              };
            }
            return (
              <TextField
                {...field}
                fullWidth
                placeholder={placeholder}
                type={type}
                error={!!error}
                helperText={error?.message}
                InputProps={inputProps}
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
                }}
              />
            );
          }}
        />
      )}
    </Box>
  );
};
