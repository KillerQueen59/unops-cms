/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { TextField, InputAdornment, TextFieldProps } from '@mui/material';

interface CurrencyInputFieldProps
  extends Omit<TextFieldProps, 'value' | 'onChange'> {
  value: string | number;
  onChange: (value: string) => void;
  debounceDelay?: number;
  currency?: string;
  locale?: string;
  existingValues?: number[];
  showDuplicateWarning?: boolean;
  allowDuplicates?: boolean;
  onDuplicateDetected?: (isDuplicate: boolean) => void;
  maxValue?: number;
  minValue?: number;
  decimalPlaces?: number;
  allowNegative?: boolean;
}

/**
 * Enhanced Currency Input Field with debouncing and duplicate detection
 *
 * Features:
 * - Automatic number formatting with locale support
 * - Debounced onChange to prevent excessive calls
 * - Duplicate value detection and validation
 * - Min/Max value validation
 * - Decimal support
 * - Real-time input sanitization
 */
export const CurrencyInputField: React.FC<CurrencyInputFieldProps> = ({
  value,
  onChange,
  debounceDelay = 300,
  currency = 'IDR',
  locale = 'id-ID',
  existingValues = [],
  showDuplicateWarning = false,
  allowDuplicates = true,
  onDuplicateDetected,
  maxValue,
  minValue,
  decimalPlaces = 0,
  allowNegative = false,
  placeholder = 'Enter amount...',
  size = 'small',
  fullWidth = true,
  error: externalError,
  helperText: externalHelperText,
  sx,
  ...textFieldProps
}) => {
  const [displayValue, setDisplayValue] = useState('');
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isOutOfRange, setIsOutOfRange] = useState(false);
  const [internalError, setInternalError] = useState('');

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const lastValueRef = useRef<string>('');
  const isInitializedRef = useRef(false);

  // Initialize display value
  useEffect(() => {
    if (!isInitializedRef.current) {
      const formatted = formatDisplayValue(value);
      setDisplayValue(formatted);
      lastValueRef.current = String(value);
      isInitializedRef.current = true;
    }
  }, []);

  // Update display value when external value changes
  useEffect(() => {
    if (isInitializedRef.current && String(value) !== lastValueRef.current) {
      const formatted = formatDisplayValue(value);
      setDisplayValue(formatted);
      lastValueRef.current = String(value);
    }
  }, [value]);

  // Format value for display
  const formatDisplayValue = (val: string | number): string => {
    if (val === '' || val === null || val === undefined) return '';

    const numericValue =
      typeof val === 'string' ? parseFloat(val.replace(/[^\d.-]/g, '')) : val;
    if (isNaN(numericValue)) return '';

    try {
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimalPlaces,
      }).format(numericValue);
    } catch {
      return String(numericValue);
    }
  };

  // Parse display value to numeric value
  const parseNumericValue = (displayVal: string): number => {
    if (!displayVal) return 0;

    // Remove all formatting characters except digits, decimal separator, and minus sign
    const cleanValue = displayVal.replace(/[^\d.,-]/g, '');

    // Handle different decimal separators based on locale
    let normalizedValue = cleanValue;
    if (locale.startsWith('id')) {
      // Indonesian uses comma as decimal separator
      normalizedValue = cleanValue.replace(/\./g, '').replace(/,/g, '.');
    } else {
      // Most other locales use dot as decimal separator
      normalizedValue = cleanValue.replace(/,/g, '');
    }

    const parsed = parseFloat(normalizedValue);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Validate value
  const validateValue = useCallback(
    (numericValue: number): { isValid: boolean; error: string } => {
      // Check range
      if (minValue !== undefined && numericValue < minValue) {
        return {
          isValid: false,
          error: `Minimum value is ${minValue.toLocaleString(locale)}`,
        };
      }
      if (maxValue !== undefined && numericValue > maxValue) {
        return {
          isValid: false,
          error: `Maximum value is ${maxValue.toLocaleString(locale)}`,
        };
      }

      // Check negative values
      if (!allowNegative && numericValue < 0) {
        return { isValid: false, error: 'Negative values are not allowed' };
      }

      return { isValid: true, error: '' };
    },
    [minValue, maxValue, allowNegative, locale]
  );

  // Check for duplicates
  const checkDuplicates = useCallback(
    (numericValue: number): boolean => {
      if (!showDuplicateWarning || existingValues.length === 0) return false;
      return existingValues.includes(numericValue);
    },
    [showDuplicateWarning, existingValues]
  );

  // Debounced change handler
  const debouncedOnChange = useCallback(
    (rawValue: string, numericValue: number) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        if (lastValueRef.current !== rawValue) {
          onChange(rawValue);
          lastValueRef.current = rawValue;
        }
      }, debounceDelay);
    },
    [onChange, debounceDelay]
  );

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Allow empty input
    if (inputValue === '') {
      setDisplayValue('');
      setIsDuplicate(false);
      setIsOutOfRange(false);
      setInternalError('');
      debouncedOnChange('', 0);
      return;
    }

    // Basic input sanitization
    const sanitized = inputValue.replace(/[^\d.,-]/g, '');
    if (!sanitized) return;

    // Parse numeric value
    const numericValue = parseNumericValue(sanitized);

    // Validate value
    const validation = validateValue(numericValue);
    setIsOutOfRange(!validation.isValid);
    setInternalError(validation.error);

    // Check duplicates
    const isDuplicateValue = checkDuplicates(numericValue);
    setIsDuplicate(isDuplicateValue);
    onDuplicateDetected?.(isDuplicateValue);

    // Format and set display value
    const formattedValue = formatDisplayValue(numericValue);
    setDisplayValue(formattedValue);

    // Trigger debounced change
    debouncedOnChange(sanitized, numericValue);
  };

  // Handle blur to ensure final formatting
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const numericValue = parseNumericValue(displayValue);
    const formattedValue = formatDisplayValue(numericValue);
    setDisplayValue(formattedValue);

    // Call external onBlur if provided
    textFieldProps.onBlur?.(e);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Determine error state and helper text
  const hasError = externalError || isDuplicate || isOutOfRange;
  const errorHelperText =
    internalError ||
    (isDuplicate && !allowDuplicates ? 'This amount already exists' : '') ||
    externalHelperText;

  return (
    <TextField
      {...textFieldProps}
      fullWidth={fullWidth}
      size={size}
      type="text"
      value={displayValue}
      onChange={handleInputChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      error={hasError}
      helperText={errorHelperText}
      InputProps={{
        startAdornment: currency ? (
          <InputAdornment position="start">{currency}</InputAdornment>
        ) : undefined,
        ...textFieldProps.InputProps,
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
        },
        ...sx,
      }}
    />
  );
};

// Hook for managing multiple currency inputs with global duplicate detection
export const useCurrencyInputs = (initialEntries: any[] = []) => {
  const [entries, setEntries] = useState(initialEntries);

  const updateEntry = useCallback((entryId: string | number, value: string) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === entryId ? { ...entry, amount: value } : entry
      )
    );
  }, []);

  const getExistingValues = useCallback(
    (excludeId?: string | number): number[] => {
      return entries
        .filter((entry) => entry.id !== excludeId && entry.amount)
        .map((entry) => {
          const numericValue =
            typeof entry.amount === 'string'
              ? parseFloat(entry.amount.replace(/[^\d.-]/g, ''))
              : entry.amount;
          return isNaN(numericValue) ? 0 : numericValue;
        })
        .filter((value) => value > 0);
    },
    [entries]
  );

  const addEntry = useCallback((newEntry: any) => {
    setEntries((prev) => [...prev, newEntry]);
  }, []);

  const removeEntry = useCallback((entryId: string | number) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== entryId));
  }, []);

  return {
    entries,
    setEntries,
    updateEntry,
    getExistingValues,
    addEntry,
    removeEntry,
  };
};

export default CurrencyInputField;
