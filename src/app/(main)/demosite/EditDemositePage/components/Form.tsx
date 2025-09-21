'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import {
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Autocomplete,
  TextField,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { File } from '@phosphor-icons/react';
import { ControlledFieldContainer, TextAreaFieldContainer } from '@/components';
import { DemositeType } from '@/types/demosite';
import { DemositeFormData } from '@/types/demositeForm';
import { useDemositeStore, DemositePageEnum } from '@/stores/demositeStore';
import { useForm, Controller } from 'react-hook-form';
import { useUpdateDemosite } from '@/hooks/useDemositeData';
import { UpdateDemositeData } from '@/services/demositeService';

export const Form = ({
  villageOptions,
  isLoading,
}: {
  villageOptions: { label: string; value: string }[];
  isLoading: boolean;
}) => {
  const { selectedDemosite, setPage, updateBreadcrumbs } = useDemositeStore();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [headerPhoto, setHeaderPhoto] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    register,
    reset,
  } = useForm<DemositeFormData>({
    defaultValues: {
      title: '',
      type: DemositeType.LocalHeroes,
      name: '',
      story: '',
      link: '',
      header: undefined as unknown as File,
      photos: [],
    },
  });

  // Populate form with existing data
  useEffect(() => {
    if (selectedDemosite) {
      reset({
        title: selectedDemosite.title || '',
        type: selectedDemosite.type || DemositeType.LocalHeroes,
        name: selectedDemosite.name || '',
        story: selectedDemosite.story || '',
        link: selectedDemosite.link || '',
        header: undefined as unknown as File, // Will handle existing header separately
        photos: [],
      });

      // Load existing documentation photos (excluding header photo)
      if (selectedDemosite.photos && selectedDemosite.photos.length > 1) {
        const existingPhotoUrls = selectedDemosite.photos.slice(1); // Skip first photo (header)
        setExistingPhotos(existingPhotoUrls);
      } else {
        setExistingPhotos([]);
      }
    }
  }, [selectedDemosite, reset, setValue]);

  // Register header field with validation
  register('header', {
    validate: (file) => {
      // For edit mode, header is optional if there's an existing one
      if (!file && !selectedDemosite?.photos?.[0]) {
        return 'Header photo is required';
      }
      if (file) {
        if (
          typeof file !== 'object' ||
          !file.name ||
          !file.type ||
          !file.size
        ) {
          return 'Invalid header photo';
        }
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validTypes.includes(file.type))
          return 'Header photo must be JPG or PNG';
        if (file.size > 5 * 1024 * 1024)
          return 'Header photo must be less than 5MB';
      }
      return true;
    },
  });

  const name = watch('name');
  const type = watch('type');
  const updateMutation = useUpdateDemosite();

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, isHeaderDrop = false) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);

      if (isHeaderDrop) {
        // Handle header photo drop
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const validFiles = files.filter((file) => {
          const maxSize = 5 * 1024 * 1024; // 5MB
          return validTypes.includes(file.type) && file.size <= maxSize;
        });

        if (validFiles.length > 0) {
          const headerFile = validFiles[0]; // Only take the first file for header
          setHeaderPhoto(headerFile);
          setValue('header', headerFile); // Set in form data for validation
        }
      } else {
        // Handle documentation photos drop
        const validTypes = [
          'image/jpeg',
          'image/png',
          'image/jpg',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        const validFiles = files.filter((file) => {
          const maxSize = 5 * 1024 * 1024; // 5MB
          return validTypes.includes(file.type) && file.size <= maxSize;
        });

        setUploadedFiles((prev) => [...prev, ...validFiles]);
        setValue('photos', [...uploadedFiles, ...validFiles]);
      }
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
        const inputId = e.target.id;

        if (inputId === 'header-photo-input') {
          const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
          const validFiles = files.filter((file) => {
            const maxSize = 5 * 1024 * 1024; // 5MB
            return validTypes.includes(file.type) && file.size <= maxSize;
          });

          if (validFiles.length > 0) {
            const headerFile = validFiles[0]; // Only take the first file for header
            setHeaderPhoto(headerFile);
            setValue('header', headerFile); // Set in form data for validation
          }
        } else {
          const validTypes = [
            'image/jpeg',
            'image/png',
            'image/jpg',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          ];
          const validFiles = files.filter((file) => {
            const maxSize = 5 * 1024 * 1024; // 5MB
            return validTypes.includes(file.type) && file.size <= maxSize;
          });

          setUploadedFiles((prev) => [...prev, ...validFiles]);
          setValue('photos', [...uploadedFiles, ...validFiles]);
        }
      }
    },
    [setValue, uploadedFiles, setHeaderPhoto]
  );

  const removeFile = useCallback(
    (index: number) => {
      const newFiles = uploadedFiles.filter((_, i) => i !== index);
      setUploadedFiles(newFiles);
      setValue('photos', newFiles);
    },
    [uploadedFiles, setValue]
  );

  const removeExistingPhoto = useCallback(
    (index: number) => {
      const newExistingPhotos = existingPhotos.filter((_, i) => i !== index);
      setExistingPhotos(newExistingPhotos);
    },
    [existingPhotos]
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
    } else if (fileType.includes('pdf')) {
      return <File size={24} color="#EF4444" weight="fill" />;
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return <File size={24} color="#3B82F6" weight="fill" />;
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

  const handleBack = () => {
    setPage(DemositePageEnum.LIST);
    updateBreadcrumbs(DemositePageEnum.LIST);
  };

  const onSubmit = async (data: DemositeFormData) => {
    if (!selectedDemosite) return;

    try {
      // Combine existing photos with new uploaded files
      const allPhotos = [...data.photos]; // New files

      // Add existing photos that weren't removed
      const existingPhotoFiles = existingPhotos.map((photoUrl) => {
        // Create a reference to existing photos (these will be handled differently by the backend)
        return photoUrl as unknown as File; // Backend should handle URL strings vs File objects
      });

      const form: UpdateDemositeData = {
        id: selectedDemosite.id,
        header: data.header,
        title: data.title,
        type: data.type === DemositeType.LocalHeroes ? 'hero' : 'location',
        name: data.name,
        story: data.story,
        link: data.link,
        photos: [...existingPhotoFiles, ...allPhotos],
      };
      console.log('Updating form data:', form);
      await updateMutation.mutateAsync({ demositeData: form });
      handleBack();
    } catch (error) {
      handleBack();
      console.error('Update error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Title Section */}
        <Box>
          <ControlledFieldContainer
            label="Title"
            name="title"
            control={control}
            placeholder="Masukkan title..."
            required
            error={errors.title}
          />
        </Box>

        {/* Header Photo Section */}
        <Box>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 'medium',
              color: '#374151',
              mb: 2,
            }}
          >
            Header Photo
          </Typography>

          {/* Existing Header Photo Preview */}
          {selectedDemosite?.photos?.[0] && !headerPhoto && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Current header photo:
              </Typography>
              <Box
                sx={{
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <File size={24} color="#F59E0B" weight="fill" />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    Existing header photo
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selectedDemosite.photos[0]}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          {/* Header Photo Upload Area */}
          <Box
            onDrop={(e) => handleDrop(e, true)}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() =>
              document.getElementById('header-photo-input')?.click()
            }
            sx={{
              border: '2px dashed #0EA5E9',
              borderRadius: '12px',
              padding: '40px',
              textAlign: 'center',
              backgroundColor: '#F0F9FF',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: '#0284C7',
                backgroundColor: '#E0F2FE',
              },
              mb: 3,
            }}
          >
            <input
              id="header-photo-input"
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileInput}
              style={{ display: 'none' }}
            />
            <Image
              src="/cloud.svg"
              alt="Upload"
              width={64}
              height={47}
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
                sx={{ textDecoration: 'underline', cursor: 'pointer' }}
              >
                browse
              </Typography>{' '}
              your file here
            </Typography>
            <Typography variant="body2" color="#9CA3AF">
              JPG or PNG 500x300, max 5mb
            </Typography>
          </Box>

          {/* Header Photo Error */}
          {errors.header && (
            <Typography
              variant="caption"
              color="error"
              sx={{ mt: 1, display: 'block' }}
            >
              {errors.header.message}
            </Typography>
          )}

          {/* New Header Photo Preview */}
          {headerPhoto && (
            <Box sx={{ mt: 2 }}>
              <Box
                sx={{
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <File size={24} color="#F59E0B" weight="fill" />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {headerPhoto.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatFileSize(headerPhoto.size)} •{' '}
                    {formatDate(new Date())}
                  </Typography>
                </Box>
                <IconButton
                  onClick={() => {
                    setHeaderPhoto(null);
                    setValue('header', undefined as unknown as File); // Clear form value
                  }}
                  size="small"
                  sx={{ color: '#EF4444' }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          )}
        </Box>

        {/* Description Section */}
        <Box>
          <TextAreaFieldContainer
            label="Story"
            name="story"
            control={control}
            placeholder="Insert story..."
            required
            rows={4}
            error={errors.story}
          />
        </Box>

        {/* Location Name and Type Row */}
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
                      <span style={{ color: '#9CA3AF' }}>Pilih type...</span>
                    </MenuItem>
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

          {type === DemositeType.StoryOfVillage ? (
            <ControlledFieldContainer
              label="Name"
              name="name"
              control={control}
              required
              error={errors.name}
            >
              <Autocomplete
                options={villageOptions}
                getOptionLabel={(option) => option.label}
                value={
                  villageOptions.find((village) => village.label === name) ||
                  null
                }
                onChange={(event, newValue) => {
                  setValue('name', newValue?.label || '');
                }}
                disabled={isLoading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={'Search Village..'}
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
          ) : (
            <ControlledFieldContainer
              label="Name"
              name="name"
              control={control}
              placeholder="Input Local Hero Name here..."
              required
              error={errors.name}
            />
          )}
        </Box>

        {/* Links */}
        <Box>
          <ControlledFieldContainer
            label="Links"
            name="link"
            control={control}
            placeholder="Input related link here..."
            error={errors.link}
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

          {/* Show existing photos */}
          {existingPhotos.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Current Documentation Photos:
              </Typography>
              <List sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
                {existingPhotos.map((photoUrl, index) => (
                  <ListItem
                    key={`existing-${index}`}
                    sx={{
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      mb: 1,
                      '&:last-child': { mb: 0 },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <File size={24} color="#F59E0B" weight="fill" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 'medium' }}
                        >
                          Existing Photo {index + 1}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {photoUrl}
                        </Typography>
                      }
                    />
                    <IconButton
                      onClick={() => removeExistingPhoto(index)}
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

          {/* Show uploaded files list */}
          {uploadedFiles.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                New Documentation Photos:
              </Typography>
              <List sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
                {uploadedFiles.map((file, index) => (
                  <ListItem
                    key={`new-${index}`}
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

          {/* Documentation Upload Area */}
          <Box
            onDrop={(e) => handleDrop(e, false)}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() =>
              document.getElementById('documentation-input')?.click()
            }
            sx={{
              border: '2px dashed #0EA5E9',
              borderRadius: '12px',
              padding: '40px',
              textAlign: 'center',
              backgroundColor: '#F0F9FF',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: '#0284C7',
                backgroundColor: '#E0F2FE',
              },
            }}
          >
            <input
              id="documentation-input"
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
              onChange={handleFileInput}
              style={{ display: 'none' }}
            />
            <Image
              src="/cloud.svg"
              alt="Upload"
              width={64}
              height={47}
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
                sx={{ textDecoration: 'underline', cursor: 'pointer' }}
              >
                browse
              </Typography>{' '}
              your file here
            </Typography>
            <Typography variant="body2" color="#9CA3AF">
              JPG or PNG 500x300, max 5mb
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
            {isSubmitting ? 'Updating...' : 'Update'}
          </Button>
        </Box>
      </Box>
    </form>
  );
};
