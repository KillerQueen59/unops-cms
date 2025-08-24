import { ControlledFieldContainer, RadioFieldContainer } from '@/components';
import { TrainingFormData } from '@/types/trainingForm';
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
  control: Control<TrainingFormData>;
  errors: FieldErrors<TrainingFormData>;
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
            Detail Training
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <ControlledFieldContainer
                label="Training Name"
                name="trainingName"
                control={control}
                placeholder="Input training name..."
                required
                error={errors.trainingName}
              />

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
                        <MenuItem value="Online">Online</MenuItem>
                        <MenuItem value="In-Person">In-Person</MenuItem>
                        <MenuItem value="Hybrid">Hybrid</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </ControlledFieldContainer>
            </Box>

            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <RadioFieldContainer
                label="Mandatory Training"
                name="mandatoryTraining"
                control={control}
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' },
                ]}
                required
              />

              <RadioFieldContainer
                label="Therapeutic Training"
                name="therapeuticTraining"
                control={control}
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' },
                ]}
                required
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <ControlledFieldContainer
                label="Intervention Type"
                name="interventionType"
                control={control}
                required
                error={errors.interventionType}
              >
                <Controller
                  name="interventionType"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.interventionType}>
                      <Select
                        {...field}
                        displayEmpty
                        sx={{
                          borderRadius: '12px',
                        }}
                      >
                        <MenuItem value="" disabled>
                          <span style={{ color: '#9CA3AF' }}>
                            Choose intervention type...
                          </span>
                        </MenuItem>
                        <MenuItem value="Individual">Individual</MenuItem>
                        <MenuItem value="Group">Group</MenuItem>
                        <MenuItem value="Community">Community</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </ControlledFieldContainer>

              <ControlledFieldContainer
                label="Desa"
                name="village"
                control={control}
                required
                error={errors.village}
              >
                <Controller
                  name="village"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.village}>
                      <Select
                        {...field}
                        displayEmpty
                        sx={{
                          borderRadius: '12px',
                        }}
                      >
                        <MenuItem value="" disabled>
                          <span style={{ color: '#9CA3AF' }}>
                            Choose village name...
                          </span>
                        </MenuItem>
                        <MenuItem value="Desa A">Desa A</MenuItem>
                        <MenuItem value="Desa B">Desa B</MenuItem>
                        <MenuItem value="Desa C">Desa C</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </ControlledFieldContainer>
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* Community Participation */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: '#374151',
              mb: 3,
            }}
          >
            Community Participation <span style={{ color: '#ef4444' }}>*</span>
          </Typography>

          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <ControlledFieldContainer
              label=""
              name="communityParticipationMale"
              control={control}
              type={'number'}
              placeholder="Input total male participants..."
              error={errors.communityParticipationMale}
              InputProps={{
                startAdornment: <GenderMaleIcon size={20} />,
              }}
            />

            <ControlledFieldContainer
              label=""
              name="communityParticipationFemale"
              control={control}
              type={'number'}
              placeholder="Input total female participants..."
              error={errors.communityParticipationFemale}
              InputProps={{
                startAdornment: <GenderFemaleIcon size={20} />,
              }}
            />
          </Box>
        </Box>

        <Divider />

        {/* Community Capacity Section */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: '#374151',
              mb: 3,
            }}
          >
            Community capacity
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Elderly */}
            <Box>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  color: '#374151',
                  mb: 2,
                }}
              >
                Elderly <span style={{ color: '#ef4444' }}>*</span>
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <ControlledFieldContainer
                  name="elderlyMale"
                  control={control}
                  type={'number'}
                  placeholder="Input total male participant...."
                  error={errors.elderlyMale}
                  InputProps={{
                    startAdornment: <GenderMaleIcon size={20} />,
                  }}
                />
                <ControlledFieldContainer
                  name="elderlyFemale"
                  control={control}
                  type={'number'}
                  placeholder="Input total female participant...."
                  error={errors.elderlyFemale}
                  InputProps={{
                    startAdornment: <GenderFemaleIcon size={20} />,
                  }}
                />
              </Box>
            </Box>

            {/* Youth */}
            <Box>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  color: '#374151',
                  mb: 2,
                }}
              >
                Youth <span style={{ color: '#ef4444' }}>*</span>
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <ControlledFieldContainer
                  label=""
                  name="youthMale"
                  control={control}
                  type={'number'}
                  placeholder="Input total male participant...."
                  error={errors.youthMale}
                  InputProps={{
                    startAdornment: <GenderMaleIcon size={20} />,
                  }}
                />
                <ControlledFieldContainer
                  label=""
                  name="youthFemale"
                  control={control}
                  type={'number'}
                  placeholder="Input total female participant...."
                  error={errors.youthFemale}
                  InputProps={{
                    startAdornment: <GenderFemaleIcon size={20} />,
                  }}
                />
              </Box>
            </Box>

            {/* Disability */}
            <Box>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  color: '#374151',
                  mb: 2,
                }}
              >
                Disability <span style={{ color: '#ef4444' }}>*</span>
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <ControlledFieldContainer
                  label=""
                  name="disabilityMale"
                  control={control}
                  type={'number'}
                  placeholder="Input total male participant...."
                  required
                  error={errors.disabilityMale}
                  InputProps={{
                    startAdornment: <GenderMaleIcon size={20} />,
                  }}
                />
                <ControlledFieldContainer
                  label=""
                  name="disabilityFemale"
                  control={control}
                  type={'number'}
                  placeholder="Input total female participant...."
                  error={errors.disabilityFemale}
                  InputProps={{
                    startAdornment: <GenderFemaleIcon size={20} />,
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* Knowledge Improvement Section */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: '#374151',
              mb: 3,
            }}
          >
            Knowledge Improvement
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Pre-Test Scores */}
            <Box>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  color: '#374151',
                  mb: 2,
                }}
              >
                Nilai Post Test Lebih Dari 70%{' '}
                <span style={{ color: '#ef4444' }}>*</span>
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <ControlledFieldContainer
                  label=""
                  name="preTestScoreMale"
                  control={control}
                  type={'number'}
                  placeholder="Input total male participant...."
                  error={errors.preTestScoreMale}
                  InputProps={{
                    startAdornment: <GenderMaleIcon size={20} />,
                  }}
                />
                <ControlledFieldContainer
                  label=""
                  name="preTestScoreFemale"
                  control={control}
                  type={'number'}
                  placeholder="Input total female participant...."
                  error={errors.preTestScoreFemale}
                  InputProps={{
                    startAdornment: <GenderFemaleIcon size={20} />,
                  }}
                />
              </Box>
            </Box>

            {/* Post-Test Scores */}
            <Box>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  color: '#374151',
                  mb: 2,
                }}
              >
                Nilai Post Test Kurang Dari 70%{' '}
                <span style={{ color: '#ef4444' }}>*</span>
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <ControlledFieldContainer
                  label=""
                  name="postTestScoreMale"
                  control={control}
                  type={'number'}
                  placeholder="Input total male participant...."
                  error={errors.postTestScoreMale}
                  InputProps={{
                    startAdornment: <GenderMaleIcon size={20} />,
                  }}
                />
                <ControlledFieldContainer
                  label=""
                  name="postTestScoreFemale"
                  control={control}
                  type={'number'}
                  placeholder="Input total female participant...."
                  error={errors.postTestScoreFemale}
                  InputProps={{
                    startAdornment: <GenderFemaleIcon size={20} />,
                  }}
                />
              </Box>
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
