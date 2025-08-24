import {
  ControlledFieldContainer,
  RadioFieldContainer,
  TextAreaFieldContainer,
} from '@/components';
import { TrainingFormData } from '@/types/trainingForm';
import { VillageFormData } from '@/types/villageForm';
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Divider,
  Button,
} from '@mui/material';
import { GenderMaleIcon, GenderFemaleIcon } from '@phosphor-icons/react';
import { Control, Controller, FieldErrors } from 'react-hook-form';

export const Form = ({
  control,
  errors,
  isSubmitting,
  handleFormSubmit,
  handleBack,
}: {
  control: Control<VillageFormData>;
  errors: FieldErrors<VillageFormData>;
  isSubmitting: boolean;
  handleFormSubmit: () => void;
  handleBack: () => void;
}) => {
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
            Detail Village
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <ControlledFieldContainer
                label="Village Name"
                name="villageName"
                control={control}
                placeholder="Input village name..."
                required
                error={errors.villageName}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <ControlledFieldContainer
                label="Village Code"
                name="villageCode"
                control={control}
                placeholder="Input village code..."
                required
                error={errors.villageCode}
              />
              <ControlledFieldContainer
                label="Total Population"
                name="totalPopulation"
                control={control}
                placeholder="Input total population..."
                required
                error={errors.totalPopulation}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              {/* Address  */}
              <TextAreaFieldContainer
                label="Village Address"
                name="villageAddress"
                control={control}
                placeholder="Input village address..."
                required
                rows={3}
                error={errors.villageAddress}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <ControlledFieldContainer
                label="Village Latitude"
                name="villageLat"
                control={control}
                type="number"
                placeholder="Input latitude..."
                required
                error={errors.villageLat}
              />
              <ControlledFieldContainer
                label="Village Longitude"
                name="villageLng"
                control={control}
                type="number"
                placeholder="Input longitude..."
                required
                error={errors.villageLng}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <ControlledFieldContainer
                label="Total Land Manage (hectares)"
                name="totalLandManage"
                control={control}
                type="number"
                placeholder="Input total land manage..."
                required
                error={errors.totalLandManage}
              />
              <ControlledFieldContainer
                label="Total Carbon Emissions (tons)"
                name="totalCarbonEmissions"
                control={control}
                type="number"
                placeholder="Input total carbon emissions..."
                required
                error={errors.totalCarbonEmissions}
              />
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
