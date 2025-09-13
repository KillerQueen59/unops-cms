import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Paper,
  IconButton,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { DemositeType } from '@/types/demosite';
import { useDemositeStore, DemositePageEnum } from '@/stores/demositeStore';

export const Form = () => {
  const { setPage, updateBreadcrumbs, selectedDemosite } = useDemositeStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: DemositeType.LocalHeroes,
    locationName: '',
    story: '',
    isTop10: false,
    headerPhoto: null as File | null,
    existingHeaderPhoto: '',
    images: [] as File[],
    existingImages: [] as string[],
  });

  useEffect(() => {
    if (selectedDemosite) {
      setFormData({
        title: selectedDemosite.title || '',
        description: selectedDemosite.description || '',
        type: selectedDemosite.type || DemositeType.LocalHeroes,
        locationName: selectedDemosite.name || '',
        story: selectedDemosite.story || '',
        isTop10: selectedDemosite.isTop10 || false,
        headerPhoto: null,
        existingHeaderPhoto: selectedDemosite.photos?.[0] || '',
        images: [],
        existingImages: selectedDemosite.photos || [],
      });
    }
  }, [selectedDemosite]);

  const handleInputChange = (
    field: string,
    value: string | boolean | DemositeType
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleHeaderPhotoUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      headerPhoto: file,
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const handleImageDelete = (index: number, isExisting = false) => {
    if (isExisting) {
      setFormData((prev) => ({
        ...prev,
        existingImages: prev.existingImages.filter((_, i) => i !== index),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = () => {
    console.log('Form data:', formData);
    setPage(DemositePageEnum.LIST);
    updateBreadcrumbs(DemositePageEnum.LIST);
  };

  const handleCancel = () => {
    setPage(DemositePageEnum.LIST);
    updateBreadcrumbs(DemositePageEnum.LIST);
  };

  return (
    <Box sx={{ maxWidth: 800 }}>
      {/* Title */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
          Title
        </Typography>
        <TextField
          fullWidth
          placeholder="Masukkan judul"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
        />
      </Box>

      {/* Description */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
          Description
        </Typography>
        <TextField
          fullWidth
          placeholder="Deskripsi singkat dari"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
        />
      </Box>

      {/* Header Photo */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
          Header Photo
        </Typography>

        {/* Show existing header photo if available */}
        {formData.existingHeaderPhoto && !formData.headerPhoto && (
          <Box
            sx={{
              width: '100%',
              height: '240px',
              borderRadius: '12px',
              overflow: 'hidden',
              mb: 2,
              position: 'relative',
              backgroundImage: `url(${formData.existingHeaderPhoto})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '50%',
                p: 0.5,
              }}
            >
              <IconButton
                size="small"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, existingHeaderPhoto: '' }))
                }
                sx={{ color: 'white' }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        )}

        {/* Show new header photo preview */}
        {formData.headerPhoto && (
          <Box
            sx={{
              width: '100%',
              height: '240px',
              borderRadius: '12px',
              overflow: 'hidden',
              mb: 2,
              position: 'relative',
              backgroundImage: `url(${URL.createObjectURL(formData.headerPhoto)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '50%',
                p: 0.5,
              }}
            >
              <IconButton
                size="small"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, headerPhoto: null }))
                }
                sx={{ color: 'white' }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        )}

        {/* Upload button */}
        {!formData.headerPhoto && !formData.existingHeaderPhoto && (
          <Box
            sx={{
              border: '2px dashed #E5E7EB',
              borderRadius: '12px',
              padding: '40px',
              textAlign: 'center',
              backgroundColor: '#F9FAFB',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#F3F4F6',
              },
            }}
            onClick={() =>
              document.getElementById('header-photo-input')?.click()
            }
          >
            <CloudUploadIcon sx={{ fontSize: 48, color: '#9CA3AF', mb: 2 }} />
            <Typography variant="body1" sx={{ color: '#6B7280', mb: 1 }}>
              Click to upload header photo
            </Typography>
            <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
              JPG, PNG up to 10MB
            </Typography>
          </Box>
        )}

        <input
          id="header-photo-input"
          type="file"
          accept="image/*"
          onChange={handleHeaderPhotoUpload}
          style={{ display: 'none' }}
        />

        {/* Change photo button if photo exists */}
        {(formData.headerPhoto || formData.existingHeaderPhoto) && (
          <Button
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            onClick={() =>
              document.getElementById('header-photo-input')?.click()
            }
            sx={{
              mt: 2,
              borderColor: '#0EA5E9',
              color: '#0EA5E9',
              '&:hover': {
                backgroundColor: 'rgba(14, 165, 233, 0.04)',
              },
            }}
          >
            Change Header Photo
          </Button>
        )}
      </Box>

      {/* Two Column Layout */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
        {/* Location Name */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
            Location Name
          </Typography>
          <FormControl fullWidth>
            <Select
              value={formData.locationName}
              onChange={(e) =>
                handleInputChange('locationName', e.target.value)
              }
              displayEmpty
              sx={{
                borderRadius: '8px',
              }}
            >
              <MenuItem value="">Pilih lokasi nama</MenuItem>
              <MenuItem value="Desa Gemilang">Desa Gemilang</MenuItem>
              <MenuItem value="Desa Maju">Desa Maju</MenuItem>
              <MenuItem value="Desa Sejahtera">Desa Sejahtera</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Type */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
            Type
          </Typography>
          <FormControl fullWidth>
            <Select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              sx={{
                borderRadius: '8px',
              }}
            >
              <MenuItem value={DemositeType.LocalHeroes}>Local Heroes</MenuItem>
              <MenuItem value={DemositeType.StoryOfVillage}>
                Story of Village
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Story */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
          Story
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Integrated with Digital Marketing"
          value={formData.story}
          onChange={(e) => handleInputChange('story', e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
        />
      </Box>

      {/* Top 10 Radio */}
      <Box sx={{ mb: 3 }}>
        <FormLabel component="legend" sx={{ mb: 1, fontWeight: 'medium' }}>
          Integrated with Digital Marketing
        </FormLabel>
        <RadioGroup
          row
          value={formData.isTop10}
          onChange={(e) =>
            handleInputChange('isTop10', e.target.value === 'true')
          }
        >
          <FormControlLabel value={true} control={<Radio />} label="Yes" />
          <FormControlLabel value={false} control={<Radio />} label="No" />
        </RadioGroup>
      </Box>

      {/* Documentation Upload */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
          Documentation
        </Typography>

        {/* Existing Images */}
        {formData.existingImages.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
              Current Images:
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: 2,
                mb: 2,
              }}
            >
              {formData.existingImages.map((imageUrl, index) => (
                <Box
                  key={index}
                  sx={{
                    position: 'relative',
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={imageUrl}
                    alt={`Existing ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '150px',
                      objectFit: 'cover',
                    }}
                  />
                  <IconButton
                    onClick={() => handleImageDelete(index, true)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      },
                    }}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Upload Area */}
        <Paper
          sx={{
            border: '2px dashed #D1D5DB',
            borderRadius: '8px',
            p: 4,
            textAlign: 'center',
            backgroundColor: '#F9FAFB',
            mb: 2,
          }}
        >
          <CloudUploadIcon sx={{ fontSize: 48, color: '#6B7280', mb: 2 }} />
          <Typography variant="body1" sx={{ mb: 1 }}>
            Drag and drop or{' '}
            <Button
              component="label"
              sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}
            >
              Browse
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleImageUpload}
              />
            </Button>{' '}
            your file here
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Max: 500MB
          </Typography>
        </Paper>

        {/* New Image Preview Grid */}
        {formData.images.length > 0 && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: 2,
            }}
          >
            {formData.images.map((file, index) => (
              <Box
                key={index}
                sx={{
                  position: 'relative',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                  }}
                />
                <IconButton
                  onClick={() => handleImageDelete(index, false)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    },
                  }}
                  size="small"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={handleCancel}
          sx={{
            borderRadius: '8px',
            px: 4,
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            borderRadius: '8px',
            px: 4,
          }}
        >
          Save Edit
        </Button>
      </Box>
    </Box>
  );
};
