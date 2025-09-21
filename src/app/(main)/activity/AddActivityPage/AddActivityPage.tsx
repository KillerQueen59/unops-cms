'use client';

import { ConfirmationModal } from '@/components';
import { Paper, Box } from '@mui/material';
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
          handleBack={handleBack}
          villageOptions={villageOptions}
          watch={watch}
          setValue={setValue}
          isLoadingVillage={isLoadingVillages}
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
