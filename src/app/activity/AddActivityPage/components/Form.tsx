import {
  ControlledFieldContainer,
  RadioFieldContainer,
  TextAreaFieldContainer,
} from '@/components';
import { ActivityFormData } from '@/types/activityForm';
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Button,
  InputLabel,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { CloudArrowUp, File, Trash } from '@phosphor-icons/react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { useCallback, useState } from 'react';
import Image from 'next/image';

// Activity categories - inline definition for now
const ACTIVITY_CATEGORIES = [
  'Training',
  'Environmental',
  'Monitoring',
  'Education',
  'Safety',
  'Research',
  'Infrastructure',
  'Planning',
] as const;

export const Form = ({
  control,
  errors,
  isSubmitting,
  handleFormSubmit,
  handleBack,
}: {
  control: Control<ActivityFormData>;
  errors: FieldErrors<ActivityFormData>;
  isSubmitting: boolean;
  handleFormSubmit: () => void;
  handleBack: () => void;
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter((file) => {
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      return validTypes.includes(file.type) && file.size <= maxSize;
    });

    setUploadedFiles((prev) => [...prev, ...validFiles]);
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

        setUploadedFiles((prev) => [...prev, ...validFiles]);
      }
    },
    []
  );

  const removeFile = useCallback((index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

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
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleFormSubmit();
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
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
            label="Category"
            name="activityCategory"
            control={control}
            required
            error={errors.activityCategory}
          >
            <Controller
              name="activityCategory"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.activityCategory}>
                  <Select
                    {...field}
                    displayEmpty
                    sx={{
                      borderRadius: '12px',
                    }}
                  >
                    <MenuItem value="" disabled>
                      <span style={{ color: '#9CA3AF' }}>
                        Choose Category...
                      </span>
                    </MenuItem>
                    {ACTIVITY_CATEGORIES.map((category: string) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </ControlledFieldContainer>
        </Box>

        {/* Start Date and End Date Row */}
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
          />
        </Box>

        {/* Current Status and Current Progress Row */}
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
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </ControlledFieldContainer>

          <ControlledFieldContainer
            label="Current Progress"
            name="progress"
            control={control}
            type="number"
            placeholder="Choose current progress..."
            required
            error={errors.progress}
            InputProps={{
              inputProps: { min: 0, max: 100 },
            }}
          />
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
                          {formatDate(new Date())} • {formatFileSize(file.size)}
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
