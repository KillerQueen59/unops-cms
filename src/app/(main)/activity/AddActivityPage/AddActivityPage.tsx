'use client';

import { ConfirmationModal } from '@/components';
import { Paper, Box, CircularProgress, Typography } from '@mui/material';
import { Header } from './components/Header';
import { Form } from './components/Form';
import { useAddActivityPageImpl } from './useAddActivityPageImpl';

export const AddActivityPage = () => {
  const { state, action } = useAddActivityPageImpl();
  const {
    control,
    isEditMode,
    breadcrumbs,
    showSubmitModal,
    showLeaveModal,
    isSubmitting,
    errors,
    villageOptions,
    isLoadingVillages,
    selectedActivity,
    isLoadingActivity,
    activityError,
  } = state;

  const {
    handleBack,
    handleFormSubmit,
    handleLeaveConfirm,
    handleLeaveCancel,
    handleSubmitConfirm,
    handleSubmitCancel,
    watch,
    setValue,
  } = action;

  // Handle loading state when fetching activity details
  if (isLoadingActivity) {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '16px' }}>
        <Box sx={{ padding: '28px', textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            Loading activity details...
          </Typography>
        </Box>
      </Paper>
    );
  }

  // Handle error state when fetching activity details
  if (activityError && isEditMode) {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '16px' }}>
        <Box sx={{ padding: '28px', textAlign: 'center' }}>
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>
            Error loading activity
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {activityError instanceof Error
              ? activityError.message
              : 'Unknown error occurred'}
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '16px' }}>
      <Box sx={{ padding: '28px' }}>
        <Header
          breadcrumbs={breadcrumbs}
          isEditMode={isEditMode}
          handleBack={handleBack}
        />

        <Form
          control={control}
          errors={errors}
          isSubmitting={isSubmitting}
          handleFormSubmit={handleFormSubmit}
          villageOptions={villageOptions}
          watch={watch}
          setValue={setValue}
          isLoadingVillage={isLoadingVillages}
          initialFiles={selectedActivity?.files || []}
        />
      </Box>

      {/* Modals */}
      <ConfirmationModal
        open={showSubmitModal}
        onClose={handleSubmitCancel}
        onSecondaryButtonClick={handleSubmitCancel}
        onPrimaryButtonClick={handleSubmitConfirm}
        title="Submit these data?"
        message="Ready to send your info? Just click 'Confirm' to go ahead."
        primaryButtonText="Confirm"
        secondaryButtonText="Cancel"
        type="submit"
      />

      <ConfirmationModal
        open={showLeaveModal}
        onClose={handleLeaveCancel}
        onSecondaryButtonClick={handleLeaveConfirm}
        onPrimaryButtonClick={handleLeaveCancel}
        title="Are you sure you want to leave?"
        message="You have entered some information that hasn't been saved. If you go back now, your changes will be lost."
        primaryButtonText="Stay on Page"
        secondaryButtonText="Go Back"
        type="leave"
      />
    </Paper>
  );
};
