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
  helperText?: string | React.ReactNode;
  disabled?: boolean;
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
    helperText,
    disabled = false,
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

            // Special handling for date inputs
            const isDateInput = type === 'date';

            return (
              <TextField
                {...field}
                fullWidth
                placeholder={placeholder}
                type={type}
                error={!!error}
                disabled={disabled} // Pass disabled prop to TextField
                helperText={error?.message || helperText} // Show error message first, then helper text
                InputProps={{
                  ...inputProps,
                  // Make the entire date input clickable
                  ...(isDateInput &&
                    !disabled && {
                      // Only apply date styles when not disabled
                      readOnly: false,
                      style: {
                        cursor: 'pointer',
                      },
                    }),
                }}
                InputLabelProps={{
                  shrink: isDateInput ? true : undefined,
                }}
                sx={{
                  backgroundColor: disabled ? '#f9fafb' : '#fff', // Different background when disabled
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: disabled ? '#f9fafb' : '#fff',
                    // Override browser autofill styles
                    '& input:-webkit-autofill': {
                      WebkitBoxShadow: '0 0 0 1000px #fff inset !important',
                      WebkitTextFillColor: '#000 !important',
                      backgroundColor: '#fff !important',
                    },
                    '& input:-webkit-autofill:hover': {
                      WebkitBoxShadow: '0 0 0 1000px #fff inset !important',
                      WebkitTextFillColor: '#000 !important',
                      backgroundColor: '#fff !important',
                    },
                    '& input:-webkit-autofill:focus': {
                      WebkitBoxShadow: '0 0 0 1000px #fff inset !important',
                      WebkitTextFillColor: '#000 !important',
                      backgroundColor: '#fff !important',
                    },
                    '& input:-webkit-autofill:active': {
                      WebkitBoxShadow: '0 0 0 1000px #fff inset !important',
                      WebkitTextFillColor: '#000 !important',
                      backgroundColor: '#fff !important',
                    },
                    ...(disabled && {
                      '& fieldset': {
                        borderColor: '#e5e7eb', // Lighter border when disabled
                      },
                      '&:hover fieldset': {
                        borderColor: '#e5e7eb', // Prevent hover effect when disabled
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#e5e7eb', // Prevent focus effect when disabled
                      },
                      // Override autofill for disabled state
                      '& input:-webkit-autofill': {
                        WebkitBoxShadow:
                          '0 0 0 1000px #f9fafb inset !important',
                        WebkitTextFillColor: '#9CA3AF !important',
                        backgroundColor: '#f9fafb !important',
                      },
                      '& input:-webkit-autofill:hover': {
                        WebkitBoxShadow:
                          '0 0 0 1000px #f9fafb inset !important',
                        WebkitTextFillColor: '#9CA3AF !important',
                        backgroundColor: '#f9fafb !important',
                      },
                      '& input:-webkit-autofill:focus': {
                        WebkitBoxShadow:
                          '0 0 0 1000px #f9fafb inset !important',
                        WebkitTextFillColor: '#9CA3AF !important',
                        backgroundColor: '#f9fafb !important',
                      },
                      '& input:-webkit-autofill:active': {
                        WebkitBoxShadow:
                          '0 0 0 1000px #f9fafb inset !important',
                        WebkitTextFillColor: '#9CA3AF !important',
                        backgroundColor: '#f9fafb !important',
                      },
                    }),
                    ...(!disabled &&
                      isDateInput && {
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: '#f9fafb',
                        },
                        // Make the entire input area clickable for date inputs
                        '& input[type="date"]': {
                          cursor: 'pointer',
                          '&::-webkit-calendar-picker-indicator': {
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            width: 'auto',
                            height: 'auto',
                            color: 'transparent',
                            background: 'transparent',
                            cursor: 'pointer',
                          },
                        },
                      }),
                  },
                  '& .MuiInputBase-input': {
                    color: disabled ? '#9CA3AF' : 'inherit', // Muted text when disabled
                    backgroundColor: 'transparent !important', // Ensure background stays transparent
                    ...(!disabled &&
                      isDateInput && {
                        cursor: 'pointer',
                      }),
                    // Additional autofill overrides at input level
                    '&:-webkit-autofill': {
                      WebkitBoxShadow: disabled
                        ? '0 0 0 1000px #f9fafb inset !important'
                        : '0 0 0 1000px #fff inset !important',
                      WebkitTextFillColor: disabled
                        ? '#9CA3AF !important'
                        : '#000 !important',
                    },
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: disabled ? '#d1d5db' : '#9CA3AF', // More muted placeholder when disabled
                    opacity: 1,
                  },
                  '& .MuiFormHelperText-root': {
                    color: disabled ? '#9CA3AF' : 'inherit', // Muted helper text when disabled
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
