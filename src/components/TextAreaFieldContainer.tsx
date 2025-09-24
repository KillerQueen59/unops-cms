import React, { useEffect, useRef } from 'react';
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
  autoResize?: boolean;
  minRows?: number;
  maxRows?: number;
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
    autoResize = false,
    minRows = 2,
    maxRows,
  } = props;

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = (textarea: HTMLTextAreaElement) => {
    if (!textarea) return;

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto';

    // Calculate new height
    let newHeight = textarea.scrollHeight;

    // Apply min/max constraints if provided
    if (minRows) {
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight, 10);
      const minHeight = lineHeight * minRows;
      newHeight = Math.max(newHeight, minHeight);
    }

    if (maxRows) {
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight, 10);
      const maxHeight = lineHeight * maxRows;
      newHeight = Math.min(newHeight, maxHeight);
    }

    textarea.style.height = `${newHeight}px`;
  };

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
            rows={autoResize ? undefined : rows}
            minRows={autoResize ? minRows : undefined}
            maxRows={autoResize ? maxRows : undefined}
            placeholder={placeholder}
            error={!!error}
            helperText={error?.message}
            inputRef={textareaRef}
            InputProps={InputProps}
            onChange={(e) => {
              field.onChange(e);
              if (autoResize && textareaRef.current) {
                adjustHeight(textareaRef.current);
              }
            }}
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
              ...(autoResize && {
                '& .MuiInputBase-input': {
                  resize: 'none',
                  overflow: 'hidden',
                },
              }),
            }}
          />
        )}
      />
    </Box>
  );
};
