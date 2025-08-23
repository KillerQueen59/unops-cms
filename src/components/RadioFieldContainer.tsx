import React from 'react';
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from '@mui/material';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface RadioFieldContainerProps<T extends FieldValues = FieldValues> {
  label: string;
  name: Path<T>;
  control: Control<T>;
  options: { value: string; label: string }[];
  required?: boolean;
  sx?: object;
}

export const RadioFieldContainer = <T extends FieldValues = FieldValues>(props: RadioFieldContainerProps<T>) => {
  const {
    label,
    name,
    control,
    options,
    required = false,
    sx,
  } = props;
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
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <FormControl component="fieldset">
            <RadioGroup
              {...field}
              row
              sx={{
                gap: 3,
              }}
            >
              {options.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
          </FormControl>
        )}
      />
    </Box>
  );
};
