import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import {
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { File } from '@phosphor-icons/react';
import { ControlledFieldContainer, TextAreaFieldContainer } from '@/components';
import { DemositeType } from '@/types/demosite';
import { DemositeFormData } from '@/types/demositeForm';
import { useDemositeStore, DemositePageEnum } from '@/stores/demositeStore';
import { useForm, Controller } from 'react-hook-form';

export const Form = () => {
  const { setPage, updateBreadcrumbs } = useDemositeStore();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<DemositeFormData>({
    defaultValues: {
      title: '',
      description: '',
      type: DemositeType.LocalHeroes,
      locationName: '',
      story: '',
      isTop10: false,
      images: [],
    },
  });

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      const validFiles = files.filter((file) => {
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const maxSize = 5 * 1024 * 1024; // 5MB
        return validTypes.includes(file.type) && file.size <= maxSize;
      });

      setUploadedFiles((prev) => [...prev, ...validFiles]);
      setValue('images', [...uploadedFiles, ...validFiles]);
    },
    [setValue, uploadedFiles]
  );

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
          const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
          const maxSize = 5 * 1024 * 1024; // 5MB
          return validTypes.includes(file.type) && file.size <= maxSize;
        });

        setUploadedFiles((prev) => [...prev, ...validFiles]);
        setValue('images', [...uploadedFiles, ...validFiles]);
      }
    },
    [setValue, uploadedFiles]
  );

  const removeFile = useCallback(
    (index: number) => {
      const newFiles = uploadedFiles.filter((_, i) => i !== index);
      setUploadedFiles(newFiles);
      setValue('images', newFiles);
    },
    [uploadedFiles, setValue]
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) {
      return <File size={24} color="#F59E0B" weight="fill" />;
    }
    return <File size={24} color="#6B7280" weight="fill" />;
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

  const onSubmit = (data: DemositeFormData) => {
    console.log('Form data:', data);
    // Handle form submission
    setPage(DemositePageEnum.LIST);
    updateBreadcrumbs(DemositePageEnum.LIST);
  };

  const handleBack = () => {
    setPage(DemositePageEnum.LIST);
    updateBreadcrumbs(DemositePageEnum.LIST);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Detail Demosite Section */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: '#374151',
              mb: 3,
            }}
          >
            Detail Demosite
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Title */}
            <Box>
              <ControlledFieldContainer
                label="Title"
                name="title"
                control={control}
                placeholder="Masukkan judul..."
                required
                error={errors.title}
              />
            </Box>

            {/* Description */}
            <Box>
              <TextAreaFieldContainer
                label="Description"
                name="description"
                control={control}
                placeholder="Deskripsi singkat dari..."
                required
                rows={3}
                error={errors.description}
              />
            </Box>

            {/* Location Name and Type Row */}
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <ControlledFieldContainer
                label="Location Name"
                name="locationName"
                control={control}
                required
                error={errors.locationName}
              >
                <Controller
                  name="locationName"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.locationName}>
                      <Select
                        {...field}
                        displayEmpty
                        sx={{
                          borderRadius: '12px',
                        }}
                      >
                        <MenuItem value="" disabled>
                          <span style={{ color: '#9CA3AF' }}>
                            Pilih lokasi nama...
                          </span>
                        </MenuItem>
                        <MenuItem value="Desa Gemilang">Desa Gemilang</MenuItem>
                        <MenuItem value="Desa Maju">Desa Maju</MenuItem>
                        <MenuItem value="Desa Sejahtera">
                          Desa Sejahtera
                        </MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </ControlledFieldContainer>

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
                        sx={{
                          borderRadius: '12px',
                        }}
                      >
                        <MenuItem value={DemositeType.LocalHeroes}>
                          Local Heroes
                        </MenuItem>
                        <MenuItem value={DemositeType.StoryOfVillage}>
                          Story of Village
                        </MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </ControlledFieldContainer>
            </Box>

            {/* Story */}
            <Box>
              <TextAreaFieldContainer
                label="Story"
                name="story"
                control={control}
                placeholder="Integrated with Digital Marketing..."
                required
                rows={4}
                error={errors.story}
              />
            </Box>

            {/* Integrated with Digital Marketing Radio */}
            <Box>
              <FormLabel
                component="legend"
                sx={{ mb: 1, fontWeight: 'medium' }}
              >
                Integrated with Digital Marketing
              </FormLabel>
              <Controller
                name="isTop10"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    row
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value === 'true')}
                  >
                    <FormControlLabel
                      value={true}
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                )}
              />
            </Box>
          </Box>
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
          {uploadedFiles.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <List sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
                {uploadedFiles.map((file, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      mb: 1,
                      '&:last-child': { mb: 0 },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {getFileIcon(file.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 'medium' }}
                        >
                          {file.name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {formatFileSize(file.size)} • {formatDate(new Date())}
                        </Typography>
                      }
                    />
                    <IconButton
                      onClick={() => removeFile(index)}
                      size="small"
                      sx={{ color: '#EF4444' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
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
              accept=".jpg,.jpeg,.png"
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
              JPG, PNG max 5mb
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
            borderTop: '1px solid #E5E7EB',
          }}
        >
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={isSubmitting}
            sx={{
              borderRadius: '12px',
              minWidth: 120,
              height: 48,
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{
              borderRadius: '12px',
              minWidth: 120,
              height: 48,
            }}
          >
            {isSubmitting ? 'Saving...' : 'Submit'}
          </Button>
        </Box>
      </Box>
    </form>
  );
};
