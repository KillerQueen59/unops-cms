'use client';

import { ConfirmationModal } from '@/components';
import { Paper, Box } from '@mui/material';
import { useAddTrainingPageImpl } from './useAddTrainingPageImpl';
import { Header } from './components/Header';
import { Form } from './components/Form';

export const AddTrainingPage = ({
  trainingOptions,
  trainingAssessmentThreshold,
  villageOptions,
}: {
  trainingOptions: { label: string; value: string; category: string }[];
  trainingAssessmentThreshold: number | null;
  villageOptions: { label: string; value: string }[];
}) => {
  const { state, action } = useAddTrainingPageImpl({
    villageOptions,
  });
  const {
    control,
    isEditMode,
    breadcrumbs,
    showSubmitModal,
    showLeaveModal,
    isSubmitting,
    errors,
    submitError,
    isLoadingTraining,
  } = state;

  const {
    handleBack,
    handleFormSubmit,
    handleLeaveConfirm,
    handleLeaveCancel,
    handleSubmitConfirm,
    handleSubmitCancel,
    setValue,
    watch,
  } = action;

  if (isLoadingTraining) {
    return <div>Loading...</div>;
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
          submitError={submitError}
          handleFormSubmit={handleFormSubmit}
          handleBack={handleBack}
          villageOptions={villageOptions}
          setValue={setValue}
          watch={watch}
          trainingOptions={trainingOptions}
          trainingAssessmentThreshold={trainingAssessmentThreshold}
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
