import { ConfirmationModal } from '@/components';
import { Paper, Box } from '@mui/material';
import { useAddVillagePageImpl } from './useAddVillagePageImpl';
import { Header } from './components/Header';
import { Form } from './components/Form';

export const AddVillagePage = () => {
  const { state, action } = useAddVillagePageImpl();
  const {
    control,
    isEditMode,
    breadcrumbs,
    showSubmitModal,
    showLeaveModal,
    showDeleteModal,
    isSubmitting,
    isDeleting,
    errors,
    selectedVillage,
  } = state;

  const {
    handleBack,
    handleFormSubmit,
    handleLeaveConfirm,
    handleLeaveCancel,
    handleSubmitConfirm,
    handleSubmitCancel,
    handleDeleteConfirm,
    handleDeleteCancel,
    setValue,
    watch,
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
          setValue={setValue}
          selectedCategory={state.selectedCategory ?? ''}
          watch={watch}
          isEditMode={isEditMode}
          selectedData={selectedVillage}
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

      <ConfirmationModal
        open={showDeleteModal}
        onClose={handleDeleteCancel}
        onSecondaryButtonClick={handleDeleteCancel}
        onPrimaryButtonClick={handleDeleteConfirm}
        title="Delete Village?"
        message="Are you sure you want to delete this village? This action cannot be undone."
        primaryButtonText={isDeleting ? 'Deleting...' : 'Delete'}
        secondaryButtonText="Cancel"
      />
    </Paper>
  );
};
