import { useTrainingStore } from '@/stores';
import { TrainingPageEnum } from '@/stores/trainingStore';
import { TrainingFormData, trainingFormSchema } from '@/types/trainingForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';

export const useAddTrainingPageImpl = () => {
  const { updateBreadcrumbs, setPage, selectedTraining } = useTrainingStore();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TrainingFormData>({
    resolver: zodResolver(trainingFormSchema),
    defaultValues: {
      trainingName: selectedTraining?.trainingName || '',
      trainingType: selectedTraining?.trainingType || '',
      mandatoryTraining: 'no',
      therapeuticTraining: 'no',
      interventionType: '',
      village: selectedTraining?.village || '',
      communityParticipationMale:
        selectedTraining?.communityParticipationMale?.toString() || '',
      communityParticipationFemale:
        selectedTraining?.communityParticipationFemale?.toString() || '',
      elderlyMale: selectedTraining?.elderlyMale?.toString() || '',
      elderlyFemale: selectedTraining?.elderlyFemale?.toString() || '',
      youthMale: selectedTraining?.youthMale?.toString() || '',
      youthFemale: selectedTraining?.youthFemale?.toString() || '',
      disabilityMale: selectedTraining?.disabilityMale?.toString() || '',
      disabilityFemale: selectedTraining?.disabilityFemale?.toString() || '',
      preTestScoreMale: selectedTraining?.preTestScoreMale?.toString() || '',
      preTestScoreFemale:
        selectedTraining?.preTestScoreFemale?.toString() || '',
      postTestScoreMale: '',
      postTestScoreFemale: '',
    },
  });

  const watchedValues = watch([
    'trainingName',
    'communityParticipationMale',
    'communityParticipationFemale',
    'elderlyMale',
    'elderlyFemale',
    'youthMale',
    'youthFemale',
    'disabilityMale',
    'disabilityFemale',
    'preTestScoreMale',
    'preTestScoreFemale',
    'postTestScoreMale',
    'postTestScoreFemale',
  ]);

  const hasUnsavedChanges = useCallback(() => {
    return watchedValues.some((value) => value && value.trim() !== '');
  }, [watchedValues]);

  useEffect(() => {
    updateBreadcrumbs(TrainingPageEnum.ADD);
  }, [updateBreadcrumbs]);

  const isEditMode = !!selectedTraining;
  const { breadcrumbs } = useTrainingStore();

  useEffect(() => {
    if (selectedTraining) {
      reset({
        trainingName: selectedTraining.trainingName || '',
        trainingType: selectedTraining.trainingType || '',
        mandatoryTraining: 'no',
        therapeuticTraining: 'no',
        interventionType: '',
        village: selectedTraining.village || '',
        communityParticipationMale:
          selectedTraining.communityParticipationMale?.toString() || '',
        communityParticipationFemale:
          selectedTraining.communityParticipationFemale?.toString() || '',
        elderlyMale: selectedTraining.elderlyMale?.toString() || '',
        elderlyFemale: selectedTraining.elderlyFemale?.toString() || '',
        youthMale: selectedTraining.youthMale?.toString() || '',
        youthFemale: selectedTraining.youthFemale?.toString() || '',
        disabilityMale: selectedTraining.disabilityMale?.toString() || '',
        disabilityFemale: selectedTraining.disabilityFemale?.toString() || '',
        preTestScoreMale: selectedTraining.preTestScoreMale?.toString() || '',
        preTestScoreFemale:
          selectedTraining.preTestScoreFemale?.toString() || '',
        postTestScoreMale: selectedTraining.postTestScoreMale?.toString() || '',
        postTestScoreFemale:
          selectedTraining.postTestScoreFemale?.toString() || '',
      });
    }
  }, [selectedTraining, reset]);

  const handleBack = () => {
    if (hasUnsavedChanges()) {
      setShowLeaveModal(true);
    } else {
      navigateBack();
    }
  };

  const navigateBack = () => {
    setPage(TrainingPageEnum.LIST);
    updateBreadcrumbs(TrainingPageEnum.LIST);
  };

  const handleLeaveConfirm = () => {
    setShowLeaveModal(false);
    navigateBack();
  };

  const handleLeaveCancel = () => {
    setShowLeaveModal(false);
  };

  const handleFormSubmit = handleSubmit(() => {
    setShowSubmitModal(true);
  });

  const handleSubmitConfirm = () => {
    setShowSubmitModal(false);
    handleSubmit(onSubmit)();
  };

  const handleSubmitCancel = () => {
    setShowSubmitModal(false);
  };

  const onSubmit = async (data: TrainingFormData) => {
    try {
      console.log('Saving training:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigateBack();
    } catch (error) {
      console.error('Failed to save training:', error);
    }
  };

  const state = {
    control,
    isEditMode,
    breadcrumbs,
    showSubmitModal,
    showLeaveModal,
    isSubmitting,
    errors,
  };

  const action = {
    handleBack,
    handleFormSubmit,
    handleLeaveConfirm,
    handleLeaveCancel,
    handleSubmitConfirm,
    handleSubmitCancel,
    hasUnsavedChanges,
  };

  return {
    state,
    action,
  };
};
