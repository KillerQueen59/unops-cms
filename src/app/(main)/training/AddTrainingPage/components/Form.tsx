/* eslint-disable @typescript-eslint/no-explicit-any */
import { ControlledFieldContainer } from '@/components';
import { TrainingFormData } from '@/types/trainingForm';
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Divider,
  Button,
  TextField,
  Alert,
  Autocomplete,
} from '@mui/material';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { trainingTypeOptions } from '../../constants';

export const Form = ({
  control,
  errors,
  isSubmitting,
  submitError,
  villageOptions,
  isLoading,
  setValue,
  handleFormSubmit,
  handleBack,
  watch,
  trainingOptions,
}: {
  control: Control<TrainingFormData>;
  errors: FieldErrors<TrainingFormData>;
  isSubmitting: boolean;
  submitError?: string | null;
  villageOptions: { label: string; value: string }[];
  isLoading: boolean;
  setValue: (field: keyof TrainingFormData, value: any) => void;
  handleFormSubmit: () => void;
  handleBack: () => void;
  watch: (field: keyof TrainingFormData) => any;
  trainingOptions: { label: string; value: string; category: string }[];
}) => {
  const selectedVillage = watch('villageId');
  const selectedCategory = watch('trainingType');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleFormSubmit();
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Detail Training Section */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: '#374151',
              mb: 3,
            }}
          >
            Detail Training
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <ControlledFieldContainer
                label="Training Type"
                name="trainingType"
                control={control}
                required
                error={errors.trainingType}
              >
                <Controller
                  name="trainingType"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.trainingType}>
                      <Select
                        {...field}
                        displayEmpty
                        sx={{
                          borderRadius: '12px',
                        }}
                      >
                        <MenuItem value="" disabled>
                          <span style={{ color: '#9CA3AF' }}>
                            Choose training type...
                          </span>
                        </MenuItem>
                        {trainingTypeOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </ControlledFieldContainer>

              <ControlledFieldContainer
                label="Training Name"
                name="trainingName"
                control={control}
                required
                error={errors.trainingName}
              >
                <Controller
                  name="trainingName"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.trainingType}>
                      <Select
                        {...field}
                        displayEmpty
                        sx={{
                          borderRadius: '12px',
                        }}
                      >
                        <MenuItem value="" disabled>
                          <span style={{ color: '#9CA3AF' }}>
                            Choose training name...
                          </span>
                        </MenuItem>
                        {trainingOptions
                          .filter(
                            (option) => option.category === selectedCategory
                          )
                          .map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </ControlledFieldContainer>
            </Box>

            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <ControlledFieldContainer
                label="Village"
                name="village"
                control={control}
                required
                error={errors.village}
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
                    setValue('village', newValue?.label || '');
                    setValue('villageId', newValue?.value || '');
                  }}
                  disabled={isLoading}
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
              <ControlledFieldContainer
                label="Date"
                name="date"
                control={control}
                required
                error={errors.date}
                type="date"
                placeholder="Select date..."
              />
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* Number of beneficiaries */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: '#374151',
              mb: 3,
            }}
          >
            Number of Beneficiaries
          </Typography>

          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 3 }}>
            <ControlledFieldContainer
              label="Male"
              name="male"
              control={control}
              placeholder="Input total male participants..."
              error={errors.male}
            />

            <ControlledFieldContainer
              label="Female"
              name="female"
              control={control}
              placeholder="Input total female participants..."
              error={errors.female}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 3 }}>
            <ControlledFieldContainer
              label="Elderly"
              name="elderly"
              control={control}
              placeholder="Input total elderly participants..."
              error={errors.elderly}
            />

            <ControlledFieldContainer
              label="Youth"
              name="youth"
              control={control}
              placeholder="Input total youth participants..."
              error={errors.youth}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 3 }}>
            <ControlledFieldContainer
              label="Disability"
              name="disability"
              control={control}
              placeholder="Input total disability participants..."
              error={errors.disability}
            />

            <ControlledFieldContainer
              label="Widow"
              name="widow"
              control={control}
              placeholder="Input total widow participants..."
              error={errors.widow}
            />
          </Box>
        </Box>

        <Divider />

        {/* Training Assessment */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: '#374151',
              mb: 3,
            }}
          >
            Training Assessment
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Pre-Test Scores */}
            <Box>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <ControlledFieldContainer
                  label="Pre-test"
                  name="pretest"
                  control={control}
                  placeholder="Input total pretest participant...."
                  error={errors.pretest}
                />
                <ControlledFieldContainer
                  label="Post-Test"
                  name="posttest"
                  control={control}
                  placeholder="Input total posttest participant...."
                  error={errors.posttest}
                />
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* Stakeholders Involved */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: '#374151',
              mb: 3,
            }}
          >
            Stakeholders Involved
          </Typography>

          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 3 }}>
            <ControlledFieldContainer
              label="Government"
              name="government"
              control={control}
              placeholder="Input total government participants..."
              error={errors.government}
            />

            <ControlledFieldContainer
              label="Academics"
              name="academics"
              control={control}
              placeholder="Input total academics participants..."
              error={errors.academics}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 3 }}>
            <ControlledFieldContainer
              label="Private Sector"
              name="privateSector"
              control={control}
              placeholder="Input total private sector participants..."
              error={errors.privateSector}
            />

            <ControlledFieldContainer
              label="Local Community"
              name="localCommunity"
              control={control}
              placeholder="Input total local community participants..."
              error={errors.localCommunity}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 3 }}>
            <ControlledFieldContainer
              label="NGO"
              name="ngo"
              control={control}
              placeholder="Input total NGO participants..."
              error={errors.ngo}
            />

            <ControlledFieldContainer
              label="Others"
              name="others"
              control={control}
              placeholder="Input total others participants..."
              error={errors.others}
            />
          </Box>
        </Box>

        {/* Error Display */}
        {submitError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {submitError}
          </Alert>
        )}

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
