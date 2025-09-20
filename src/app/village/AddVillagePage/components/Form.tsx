/* eslint-disable @typescript-eslint/no-explicit-any */
import { VillageFormData } from '@/types/villageForm';
import {
  Box,
  Typography,
  Button,
  TextField,
  Autocomplete,
  FormControl,
  MenuItem,
  Select,
} from '@mui/material';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { PROVINCE_NAME, southSumatraRegencies } from '../../constants';
import { useEffect, useState } from 'react';
import { getVillageOptions } from '../../helper';
import { MapPicker } from '@/components/MapPicker';
import southSumatraOnly from '@/hooks/sumatra-only';
import { ControlledFieldContainer } from '@/components';
import { VillageData } from '@/types/village';

export const Form = ({
  control,
  errors,
  isSubmitting,
  handleFormSubmit,
  handleBack,
  setValue,
  selectedCategory,
  watch,
  isEditMode,
  selectedData,
}: {
  control: Control<VillageFormData>;
  errors: FieldErrors<VillageFormData>;
  isSubmitting: boolean;
  handleFormSubmit: () => void;
  handleBack: () => void;
  setValue: (name: keyof VillageFormData, value: any) => void;
  selectedCategory: string;
  watch: (field: keyof VillageFormData) => any;
  isEditMode: boolean;
  selectedData: VillageData | null;
}) => {
  const villageCode = selectedData?.villageCode || '';

  const [selectedRegency, setSelectedRegency] = useState<string>('');
  const [selectedVillage, setSelectedVillage] = useState<string>('');
  const [villageOptions, setVillageOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [triggerChangeRegency, setTriggerChangeRegency] = useState(false);

  useEffect(() => {
    if (isEditMode && villageCode) {
      const regencyCode = villageCode.split('.').splice(0, 2).join('.');
      const regency = southSumatraRegencies.find(
        (reg) => reg.code === regencyCode
      );

      setSelectedRegency(regency?.code || '');
      const villages: Array<{ value: string; label: string }> =
        getVillageOptions(regencyCode);
      setVillageOptions(villages);
      setSelectedVillage(villageCode);
    }
  }, [isEditMode, villageCode]);

  useEffect(() => {
    if (selectedRegency) {
      const villages: Array<{ value: string; label: string }> =
        getVillageOptions(selectedRegency);
      setVillageOptions(villages);
      if (villageCode && !triggerChangeRegency) {
        const selectedVillage = villages.find((v) => v.value === villageCode);
        setSelectedVillage(selectedVillage?.value || '');
      } else {
        setSelectedVillage('');
      }
    } else {
      setVillageOptions([]);
      setSelectedVillage('');
    }
  }, [selectedRegency, triggerChangeRegency, villageCode]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleFormSubmit();
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Detail Village Section */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: '#374151',
              mb: 3,
            }}
          >
            Detail Village
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Location: Province and Regency */}
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              {/* Province - Fixed to South Sumatra */}
              <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#374151',
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  Province
                </Typography>
                <TextField
                  fullWidth
                  disabled
                  value={PROVINCE_NAME}
                  sx={{
                    backgroundColor: '#f9fafb',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: '#f9fafb',
                      '& fieldset': {
                        borderColor: '#e5e7eb',
                      },
                      '&:hover fieldset': {
                        borderColor: '#e5e7eb',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#e5e7eb',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: '#9CA3AF',
                    },
                  }}
                />
              </Box>

              {/* Regency/City - Searchable Autocomplete */}
              <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#374151',
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  Regency/City
                  <span style={{ color: '#EF4444', marginLeft: '4px' }}>*</span>
                </Typography>
                <Autocomplete
                  options={southSumatraRegencies}
                  getOptionLabel={(option) => option.name}
                  value={
                    southSumatraRegencies.find(
                      (reg) => reg.code === selectedRegency
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    if (isEditMode) {
                      setTriggerChangeRegency(true);
                    }
                    setSelectedRegency(newValue?.code || '');
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Search regency/city..."
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                        },
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props} key={option.code}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {option.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#6B7280' }}>
                          Capital: {option.capital} •{' '}
                          {option.type === 'city' ? 'City' : 'Regency'}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  noOptionsText="No regency/city found"
                  sx={{
                    '& .MuiAutocomplete-inputRoot': {
                      borderRadius: '12px',
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Village Selection */}
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: selectedRegency ? '#374151' : '#9CA3AF',
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  Village
                  {selectedRegency && (
                    <span style={{ color: '#EF4444', marginLeft: '4px' }}>
                      *
                    </span>
                  )}
                </Typography>
                <Autocomplete
                  options={villageOptions}
                  getOptionLabel={(option) => option.label}
                  value={
                    villageOptions.find(
                      (village) => village.value === selectedVillage
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    setSelectedVillage(newValue?.value || '');
                    // Update both village code and village name in the form
                    setValue('villageCode', newValue?.value || '');
                    setValue('villageName', newValue?.label || '');
                  }}
                  disabled={!selectedRegency}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={
                        selectedRegency
                          ? 'Search village...'
                          : 'Select regency first'
                      }
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: !selectedRegency
                            ? '#f9fafb'
                            : '#fff',
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
                  noOptionsText={
                    selectedRegency
                      ? 'No villages found'
                      : 'Select regency first'
                  }
                  sx={{
                    '& .MuiAutocomplete-inputRoot': {
                      borderRadius: '12px',
                    },
                  }}
                />
              </Box>

              <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#374151',
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  Village Code
                </Typography>
                <Controller
                  name="villageCode"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      disabled
                      value={selectedVillage || ''}
                      sx={{
                        backgroundColor: '#f9fafb',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: '#f9fafb',
                          '& fieldset': {
                            borderColor: '#e5e7eb',
                          },
                          '&:hover fieldset': {
                            borderColor: '#e5e7eb',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#e5e7eb',
                          },
                        },
                        '& .MuiInputBase-input': {
                          color: '#9CA3AF',
                        },
                      }}
                    />
                  )}
                />
              </Box>
            </Box>

            {/* Village Name Display */}
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#374151',
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  Village Name
                </Typography>
                <Controller
                  name="villageName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      disabled
                      value={
                        villageOptions.find((v) => v.value === selectedVillage)
                          ?.label || ''
                      }
                      sx={{
                        backgroundColor: '#f9fafb',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: '#f9fafb',
                          '& fieldset': {
                            borderColor: '#e5e7eb',
                          },
                          '&:hover fieldset': {
                            borderColor: '#e5e7eb',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#e5e7eb',
                          },
                        },
                        '& .MuiInputBase-input': {
                          color: '#9CA3AF',
                        },
                      }}
                    />
                  )}
                />
              </Box>

              <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#374151',
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  Village Category
                </Typography>
                <Controller
                  name="villageCategory"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      disabled
                      value={selectedCategory || field.value || ''}
                      sx={{
                        backgroundColor: '#f9fafb',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: '#f9fafb',
                          '& fieldset': {
                            borderColor: '#e5e7eb',
                          },
                          '&:hover fieldset': {
                            borderColor: '#e5e7eb',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#e5e7eb',
                          },
                        },
                        '& .MuiInputBase-input': {
                          color: '#9CA3AF',
                        },
                      }}
                    />
                  )}
                />
              </Box>
            </Box>

            {/* Map Picker for Coordinates */}
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#374151',
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  Village Location
                  <span style={{ color: '#EF4444', marginLeft: '4px' }}>*</span>
                </Typography>
                <Controller
                  name="villageLat"
                  control={control}
                  render={({ field: latField }) => (
                    <Controller
                      name="villageLng"
                      control={control}
                      render={({ field: lngField }) => (
                        <MapPicker
                          latitude={latField.value}
                          longitude={lngField.value}
                          onCoordinateSelect={(lat, lng) => {
                            latField.onChange(lat);
                            lngField.onChange(lng);
                          }}
                          disabled={isSubmitting}
                          provinceGeojson={southSumatraOnly}
                          regencyCode={selectedRegency}
                        />
                      )}
                    />
                  )}
                />
                {(errors.villageLat || errors.villageLng) && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#EF4444',
                      mt: 1,
                      display: 'block',
                    }}
                  >
                    {errors.villageLat?.message || errors.villageLng?.message}
                  </Typography>
                )}
              </Box>
              <ControlledFieldContainer
                label="SRN Status"
                name="srnStatus"
                control={control}
                required
                error={errors.srnStatus}
              >
                <Controller
                  name="srnStatus"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.srnStatus}>
                      <Select
                        {...field}
                        displayEmpty
                        sx={{
                          borderRadius: '12px',
                        }}
                      >
                        <MenuItem value="" disabled>
                          <span style={{ color: '#9CA3AF' }}>
                            Choose Srn Status
                          </span>
                        </MenuItem>
                        <MenuItem value={'Register'}>{'Register'}</MenuItem>
                        <MenuItem value={'Not Register'}>
                          {'Not Register'}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </ControlledFieldContainer>
            </Box>

            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 3 }}>
              <ControlledFieldContainer
                label="Carbon Emission Start"
                name="carbonEmisionStart"
                control={control}
                placeholder="Input carbon emission start..."
                error={errors.carbonEmisionStart}
                required
              />

              <ControlledFieldContainer
                label="Carbon Emission End"
                name="carbonEmisionEnd"
                control={control}
                placeholder="Input carbon emission end..."
                error={errors.carbonEmisionEnd}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 3 }}>
              <ControlledFieldContainer
                label="Land Managed Start "
                name="landManageStart"
                control={control}
                placeholder="Input land managed start..."
                error={errors.landManageStart}
                required
              />

              <ControlledFieldContainer
                label="Land Managed End "
                name="landManageEnd"
                control={control}
                placeholder="Input land managed end..."
                error={errors.landManageEnd}
              />
            </Box>

            {watch('villageCategory') === 'Category 1' && (
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 3 }}>
                <ControlledFieldContainer
                  label="Household Income Start"
                  name="incomesStart"
                  control={control}
                  placeholder="Input household income start..."
                  error={errors.incomesStart}
                  required
                />

                <ControlledFieldContainer
                  label="Household Income End"
                  name="incomesEnd"
                  control={control}
                  placeholder="Input household income end..."
                  error={errors.incomesEnd}
                />
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 3 }}>
              <ControlledFieldContainer
                label="Potency"
                name="potency"
                control={control}
                placeholder="Input potency..."
                error={errors.potency}
                required
              />

              <ControlledFieldContainer
                label="Climate Issue"
                name="climateIssue"
                control={control}
                placeholder="Input climate issue..."
                error={errors.climateIssue}
                required
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 3 }}>
              <ControlledFieldContainer
                label="Source of Economy"
                name="mainSourceOfEconomy"
                control={control}
                placeholder="Input source of economy..."
                error={errors.mainSourceOfEconomy}
                required
              />
              {/* Seed Capital - only for Category 2 */}
              {watch('villageCategory') === 'Category 2' && (
                <ControlledFieldContainer
                  label="Seed Capital"
                  name="seedCapital"
                  control={control}
                  placeholder="Input seed capital..."
                  error={errors.seedCapital}
                  required
                />
              )}
            </Box>
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
