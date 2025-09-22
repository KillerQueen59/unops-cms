/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { ControlledFieldContainer, TextAreaFieldContainer } from '@/components';
import { ActivityFormData } from '@/types/activityForm';
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  Autocomplete,
} from '@mui/material';
import { File as FileIcon, Trash } from '@phosphor-icons/react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { useCallback, useState, useEffect } from 'react';
import Image from 'next/image';

interface ApiFile {
  url: string;
  title: string;
  mimetype: string;
}

interface FileWithMetadata extends File {
  isExisting?: false;
}

interface ApiFileWithMetadata extends ApiFile {
  isExisting: true;
}

type UnifiedFile = FileWithMetadata | ApiFileWithMetadata;

export const Form = ({
  control,
  errors,
  isSubmitting,
  handleFormSubmit,
  villageOptions,
  watch,
  setValue,
  isLoadingVillage,
  initialFiles = [],
}: {
  control: Control<ActivityFormData>;
  errors: FieldErrors<ActivityFormData>;
  isSubmitting: boolean;
  handleFormSubmit: () => void;
  villageOptions: {
    label: string;
    value: string;
    category: string | undefined;
  }[];
  watch: (names?: string | string[]) => any;
  setValue: (
    name: keyof ActivityFormData,
    value: any,
    options?: object
  ) => void;
  isLoadingVillage: boolean;
  initialFiles?: UnifiedFile[];
}) => {
  const [allFiles, setAllFiles] = useState<UnifiedFile[]>(initialFiles);

  const [isDragOver, setIsDragOver] = useState(false);
  const selectedVillage = watch('villageId');
  const currentStatus = watch('status');
  const startDate = watch('startDate');
  const endDate = watch('endDate');

  // Helper functions
  const isApiFile = (file: UnifiedFile): file is ApiFileWithMetadata => {
    return 'isExisting' in file && file.isExisting === true;
  };

  const isFileObject = (file: UnifiedFile): file is FileWithMetadata => {
    return file instanceof File;
  };

  const getFileTitle = (file: UnifiedFile): string => {
    return isApiFile(file) ? file.title : file.name;
  };

  const getFileMimetype = (file: UnifiedFile): string => {
    return isApiFile(file) ? file.mimetype : file.type;
  };

  const getFileSize = (file: UnifiedFile): number => {
    return isFileObject(file) ? file.size : 0;
  };

  const getFileDate = (file: UnifiedFile): Date => {
    return isFileObject(file) ? new Date(file.lastModified) : new Date();
  };

  const getFileId = (file: UnifiedFile, index: number): string => {
    if (isApiFile(file)) {
      return file.title;
    } else {
      return `${file.name}-${file.lastModified}-${index}`;
    }
  };

  // Sync files with form whenever allFiles changes
  useEffect(() => {
    setValue('files', allFiles, { shouldValidate: true });
  }, [allFiles, setValue]);

  // Effect to handle percentage changes based on status
  useEffect(() => {
    if (currentStatus === 'not yet') {
      setValue('percentage', '0', { shouldValidate: true });
    } else if (currentStatus === 'completed') {
      setValue('percentage', '100', { shouldValidate: true });
    }
  }, [currentStatus, setValue]);

  // Effect to handle date validation when start date changes
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start > end) {
        setValue('endDate', '', { shouldValidate: true });
      }
    }
  }, [startDate, endDate, setValue]);

  // Effect to handle date validation when end date changes
  useEffect(() => {
    if (endDate && startDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (end < start) {
        setValue('startDate', '', { shouldValidate: true });
      }
    }
  }, [endDate, startDate, setValue]);

  // Function to determine if percentage field should be disabled
  const isPercentageDisabled = () => {
    return currentStatus === 'not yet' || currentStatus === 'completed';
  };

  // Function to get percentage value based on status
  const getPercentageValue = () => {
    if (currentStatus === 'not yet') return '0';
    if (currentStatus === 'completed') return '100';
    const currentPercentage = watch('percentage');
    return currentPercentage ? String(currentPercentage) : '';
  };

  // Function to get minimum date for end date
  const getMinEndDate = () => {
    if (startDate) {
      const start = new Date(startDate);
      start.setDate(start.getDate() + 1);
      return start.toISOString().split('T')[0];
    }
    return undefined;
  };

  const getMaxStartDate = () => {
    if (endDate) {
      const end = new Date(endDate);
      end.setDate(end.getDate() - 1);
      return end.toISOString().split('T')[0];
    }
    return undefined;
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter((file) => {
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024;
      return validTypes.includes(file.type) && file.size <= maxSize;
    });

    const newFiles: FileWithMetadata[] = validFiles.map((file) => {
      return {
        ...file,
        name: file.name,
        type: file.type,
        isExisting: false,
      } as FileWithMetadata;
    });

    setAllFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const files = Array.from(e.target.files);
        const validFiles = files.filter((file) => {
          const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
          const maxSize = 5 * 1024 * 1024; // 5MB
          return validTypes.includes(file.type) && file.size <= maxSize;
        });

        setAllFiles((prev) => [...prev, ...validFiles]);
      }
    },
    []
  );

  const removeFile = useCallback((index: number) => {
    setAllFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) {
      return <FileIcon size={24} color="#F59E0B" weight="fill" />;
    } else if (fileType.includes('pdf')) {
      return <FileIcon size={24} color="#EF4444" weight="fill" />;
    }
    return <FileIcon size={24} color="#6B7280" weight="fill" />;
  };

  const formatDate = (date: Date) => {
    return (
      date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }) +
      ' • ' +
      date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      })
    );
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleFormSubmit();
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Activity Name and Village */}
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <ControlledFieldContainer
            label="Activity Name"
            name="activityName"
            control={control}
            placeholder="Masukkan activity name..."
            required
            error={errors.activityName}
          />
          <ControlledFieldContainer
            label="Village"
            name="villageId"
            control={control}
            required
            error={errors.villageId}
          >
            <Autocomplete
              options={villageOptions}
              getOptionLabel={(option) => option.label}
              value={
                villageOptions.find(
                  (village) => village.value === selectedVillage
                ) || null
              }
              onChange={(event, newValue) => {
                setValue('villageId', newValue?.value || '');
                const category = newValue?.category || '';
                if (category) {
                  setValue('category', category);
                }
              }}
              disabled={isLoadingVillage}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={'Search village..'}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: '#fff',
                    },
                  }}
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props} key={option.value}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {option.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6B7280' }}>
                      Code: {option.value}
                    </Typography>
                  </Box>
                </Box>
              )}
              noOptionsText={'No villages found'}
              sx={{
                '& .MuiAutocomplete-inputRoot': {
                  borderRadius: '12px',
                },
              }}
            />
          </ControlledFieldContainer>
        </Box>

        {/* Start Date and End Date */}
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <ControlledFieldContainer
            label="Start Date"
            name="startDate"
            control={control}
            type="date"
            placeholder="Pilih tanggal..."
            required
            error={errors.startDate}
            sx={{ flex: 1, minWidth: '300px' }}
            InputProps={{
              inputProps: {
                max: getMaxStartDate(),
              },
            }}
          />
          <ControlledFieldContainer
            label="End Date"
            name="endDate"
            control={control}
            type="date"
            placeholder="Pilih tanggal..."
            required
            error={errors.endDate}
            sx={{ flex: 1, minWidth: '300px' }}
            InputProps={{
              inputProps: {
                min: getMinEndDate(),
              },
            }}
          />
        </Box>

        {/* Status and Progress */}
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <ControlledFieldContainer
            label="Status"
            name="status"
            control={control}
            required
            error={errors.status}
          >
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.status}>
                  <Select
                    {...field}
                    displayEmpty
                    sx={{
                      borderRadius: '12px',
                    }}
                  >
                    <MenuItem value="" disabled>
                      <span style={{ color: '#9CA3AF' }}>Choose Status...</span>
                    </MenuItem>
                    <MenuItem value="not yet">Not Yet</MenuItem>
                    <MenuItem value="ongoing">Ongoing</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </ControlledFieldContainer>

          <ControlledFieldContainer
            label="Current Progress"
            name="percentage"
            control={control}
            placeholder="Choose current progress..."
            required
            error={errors.percentage}
            disabled={isPercentageDisabled()}
            InputProps={{
              inputProps: {
                min: 0,
                max: 100,
                style: {
                  backgroundColor: isPercentageDisabled()
                    ? '#F3F4F6'
                    : 'transparent',
                  color: isPercentageDisabled() ? '#6B7280' : 'inherit',
                },
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: isPercentageDisabled()
                  ? '#F3F4F6'
                  : 'transparent',
                '&.Mui-disabled': {
                  backgroundColor: '#F3F4F6',
                },
              },
            }}
          >
            <Controller
              name="percentage"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  disabled={isPercentageDisabled()}
                  value={getPercentageValue()}
                  onChange={(e) => {
                    if (!isPercentageDisabled()) {
                      const value = e.target.value;
                      const numValue = parseInt(value) || 0;
                      if (numValue >= 0 && numValue <= 100) {
                        field.onChange(value);
                      }
                    }
                  }}
                  placeholder="Choose current progress..."
                  inputProps={{ min: 0, max: 100 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: isPercentageDisabled()
                        ? '#F3F4F6'
                        : 'transparent',
                      '&.Mui-disabled': {
                        backgroundColor: '#F3F4F6',
                      },
                    },
                  }}
                />
              )}
            />
          </ControlledFieldContainer>
        </Box>

        {/* Type */}
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <ControlledFieldContainer
            label="Type"
            name="type"
            control={control}
            required
            error={errors.type}
          >
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.type}>
                  <Select
                    {...field}
                    displayEmpty
                    sx={{
                      borderRadius: '12px',
                    }}
                  >
                    <MenuItem value="" disabled>
                      <span style={{ color: '#9CA3AF' }}>Choose Type...</span>
                    </MenuItem>
                    <MenuItem value="training">Training</MenuItem>
                    <MenuItem value="workshop">Workshop</MenuItem>
                    <MenuItem value="demosite">Demo Site</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </ControlledFieldContainer>
        </Box>

        {/* Description */}
        <Box>
          <TextAreaFieldContainer
            label="Description"
            name="description"
            control={control}
            placeholder="Masukkan description..."
            required
            rows={4}
            error={errors.description}
          />
        </Box>

        {/* Documentation Section */}
        <Box>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 'medium',
              color: '#374151',
              mb: 2,
            }}
          >
            Documentation
          </Typography>

          {/* Show uploaded files list */}
          {allFiles.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <List sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
                {allFiles.map((file, index) => (
                  <ListItem
                    key={getFileId(file, index)}
                    sx={{
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      mb: 1,
                      '&:last-child': { mb: 0 },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {getFileIcon(getFileMimetype(file))}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 'medium' }}
                          >
                            {getFileTitle(file)}
                          </Typography>
                          {isApiFile(file) && (
                            <Box
                              sx={{
                                px: 1,
                                py: 0.25,
                                bgcolor: '#E0F2FE',
                                color: '#0369A1',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                fontWeight: 500,
                              }}
                            >
                              Existing
                            </Box>
                          )}
                        </Box>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(getFileDate(file))}
                          {getFileSize(file) > 0 &&
                            ` • ${formatFileSize(getFileSize(file))}`}
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => removeFile(index)}
                        sx={{ color: '#EF4444' }}
                      >
                        <Trash size={20} />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {/* File upload area */}
          <Box
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => document.getElementById('file-input')?.click()}
            sx={{
              border: '2px dashed #0EA5E9',
              borderRadius: '12px',
              padding: '40px',
              textAlign: 'center',
              backgroundColor: '#F0F9FF',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: '#9CA3AF',
                backgroundColor: '#F3F4F6',
              },
            }}
          >
            <input
              id="file-input"
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileInput}
              style={{ display: 'none' }}
            />
            <Image
              src="/cloud.svg"
              alt="Upload"
              width={80}
              height={59}
              style={{ marginBottom: 16 }}
            />
            <Typography
              variant="body1"
              color={isDragOver ? '#0EA5E9' : '#6B7280'}
              sx={{ mb: 1 }}
            >
              Drag and drop or{' '}
              <Typography
                component="span"
                color="primary"
                sx={{ textDecoration: 'underline' }}
              >
                browse
              </Typography>{' '}
              your file here
            </Typography>
            <Typography variant="body2" color="#9CA3AF">
              JPG, PNG, PDF max 5mb
            </Typography>
          </Box>
        </Box>

        {/* Submit Button */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'flex-end',
            mt: 4,
            pt: 3,
          }}
        >
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{
              borderRadius: '12px',
              minWidth: 120,
              height: 48,
              backgroundColor: '#0EA5E9',
              '&:hover': {
                backgroundColor: '#0284C7',
              },
            }}
          >
            {isSubmitting ? 'Saving...' : 'Submit'}
          </Button>
        </Box>
      </Box>
    </form>
  );
};
