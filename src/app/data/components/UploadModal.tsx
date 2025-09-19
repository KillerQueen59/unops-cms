import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import Image from 'next/image';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DataFormData, dataFormSchema } from '@/types/dataForm';

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ open, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  // const uploadMutation = useUploadFile();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<DataFormData>({
    resolver: zodResolver(dataFormSchema),
    defaultValues: {
      documentName: '',
      description: '',
      category: 'regency',
      regency: '',
    },
  });

  const categoryValue = watch('category');

  const handleFileSelect = useCallback(
    (file: File) => {
      setSelectedFile(file);
      setValue('file', file);

      // Auto-generate document name from file name
      const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, '');
      const formattedName = nameWithoutExtension
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());
      setValue('documentName', formattedName);
    },
    [setValue]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        const file = files[0];
        const validTypes = [
          'image/jpeg',
          'image/png',
          'image/jpg',
          'application/pdf',
        ];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!validTypes.includes(file.type)) {
          alert('Only JPG, PNG, and PDF files are allowed');
          return;
        }

        if (file.size > maxSize) {
          alert('File size must be less than 5MB');
          return;
        }

        handleFileSelect(file);
      }
    },
    [handleFileSelect]
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
      if (e.target.files && e.target.files[0]) {
        handleFileSelect(e.target.files[0]);
      }
    },
    [handleFileSelect]
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleClose = () => {
    setSelectedFile(null);
    setIsDragOver(false);
    reset();
    onClose();
  };

  const onSubmit = async (data: DataFormData) => {
    try {
      // await uploadMutation.mutateAsync(data);
      handleClose();
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '600px',
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: '#374151',
              }}
            >
              Upload New File
            </Typography>
            <IconButton
              onClick={handleClose}
              sx={{
                color: '#6B7280',
                '&:hover': {
                  backgroundColor: '#F3F4F6',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Document Name */}
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#374151',
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  Document Name <span style={{ color: '#ef4444' }}>*</span>
                </Typography>
                <Controller
                  name="documentName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      placeholder="Enter document name..."
                      error={!!errors.documentName}
                      helperText={errors.documentName?.message}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                        },
                      }}
                    />
                  )}
                />
              </Box>

              {/* Description */}
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#374151',
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  Description
                </Typography>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      rows={3}
                      placeholder="Enter description (optional)..."
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                        },
                      }}
                    />
                  )}
                />
              </Box>

              {/* Category */}
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#374151',
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  Category <span style={{ color: '#ef4444' }}>*</span>
                </Typography>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <ToggleButtonGroup
                      {...field}
                      exclusive
                      onChange={(_, newValue) => {
                        if (newValue !== null) {
                          field.onChange(newValue);
                          if (newValue === 'other') {
                            setValue('regency', '');
                          }
                        }
                      }}
                      sx={{
                        width: '100%',
                        '& .MuiToggleButton-root': {
                          flex: 1,
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontWeight: 500,
                          py: 1.5,
                          '&.Mui-selected': {
                            backgroundColor: '#0EA5E9',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: '#0284C7',
                            },
                          },
                        },
                      }}
                    >
                      <ToggleButton value="regency">Regency</ToggleButton>
                      <ToggleButton value="other">Other</ToggleButton>
                    </ToggleButtonGroup>
                  )}
                />
              </Box>

              {/* Regency Selection (only show if category is 'regency') */}
              {categoryValue === 'regency' && (
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#374151',
                      fontWeight: 500,
                      mb: 1,
                    }}
                  >
                    Regency <span style={{ color: '#ef4444' }}>*</span>
                  </Typography>
                  <Controller
                    name="regency"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <Select
                          {...field}
                          displayEmpty
                          error={!!errors.regency}
                          sx={{
                            borderRadius: '8px',
                          }}
                        >
                          <MenuItem value="">Choose regency...</MenuItem>
                          <MenuItem value="Kabupaten Ogan Komering Ulu">
                            Kabupaten Ogan Komering Ulu
                          </MenuItem>
                          <MenuItem value="Kota Palembang">
                            Kota Palembang
                          </MenuItem>
                          <MenuItem value="Kabupaten Lahat">
                            Kabupaten Lahat
                          </MenuItem>
                          <MenuItem value="Kabupaten Muara Enim">
                            Kabupaten Muara Enim
                          </MenuItem>
                          <MenuItem value="Kabupaten Banyuasin">
                            Kabupaten Banyuasin
                          </MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                  {errors.regency && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 0.5, display: 'block' }}
                    >
                      {errors.regency.message}
                    </Typography>
                  )}
                </Box>
              )}

              {/* File Upload */}
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#374151',
                    fontWeight: 500,
                    mb: 2,
                  }}
                >
                  File <span style={{ color: '#ef4444' }}>*</span>
                </Typography>

                {selectedFile ? (
                  /* Selected File Display */
                  <Box
                    sx={{
                      border: '2px solid #0EA5E9',
                      borderRadius: '12px',
                      padding: '20px',
                      backgroundColor: '#F0F9FF',
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 'medium', color: '#374151', mb: 1 }}
                    >
                      {selectedFile.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: '#6B7280', mb: 2 }}
                    >
                      {formatFileSize(selectedFile.size)}
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setSelectedFile(null);
                        setValue('file', null as unknown as File);
                      }}
                      sx={{ borderRadius: '8px' }}
                    >
                      Remove File
                    </Button>
                  </Box>
                ) : (
                  /* File Drop Zone */
                  <Box
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() =>
                      document.getElementById('upload-file-input')?.click()
                    }
                    sx={{
                      border: `2px dashed ${isDragOver ? '#0EA5E9' : '#D1D5DB'}`,
                      borderRadius: '12px',
                      padding: '40px',
                      textAlign: 'center',
                      backgroundColor: isDragOver ? '#F0F9FF' : '#FAFAFA',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        borderColor: '#0EA5E9',
                        backgroundColor: '#F0F9FF',
                      },
                    }}
                  >
                    <input
                      id="upload-file-input"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleFileInput}
                      style={{ display: 'none' }}
                    />
                    <Image
                      src="/cloud.svg"
                      alt="Upload"
                      width={60}
                      height={44}
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
                      JPG, PNG, PDF max 5MB
                    </Typography>
                  </Box>
                )}

                {errors.file && (
                  <Typography
                    variant="caption"
                    sx={{ color: '#EF4444', mt: 1, display: 'block' }}
                  >
                    {errors.file.message}
                  </Typography>
                )}
              </Box>

              {/* Submit Buttons */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  justifyContent: 'flex-end',
                  mt: 2,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={handleClose}
                  disabled={uploadMutation.isPending}
                  sx={{
                    borderRadius: '12px',
                    minWidth: 100,
                    height: 48,
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={uploadMutation.isPending || !selectedFile}
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
                  {uploadMutation.isPending ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    'Upload File'
                  )}
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
