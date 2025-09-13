import { PageEnum } from '@/constants/page';
import { useTrainingStore } from '@/stores';
import { TrainingFormData, trainingFormSchema } from '@/types/trainingForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';

export const useAddTrainingPageImpl = () => {
  const { updateBreadcrumbs, setPage, selectedTraining, breadcrumbs } =
    useTrainingStore();
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
      date: selectedTraining?.date || '',
      village: selectedTraining?.village || '',
      villageId: selectedTraining?.villageId || '',
      // Number of beneficiaries
      male: selectedTraining?.male?.toString() || '',
      female: selectedTraining?.female?.toString() || '',
      elderly: selectedTraining?.elderly?.toString() || '',
      youth: selectedTraining?.youth?.toString() || '',
      disability: selectedTraining?.disability?.toString() || '',
      widow: selectedTraining?.widow?.toString() || '',
      // Training Assessment
      pretest: selectedTraining?.pretest?.toString() || '',
      posttest: selectedTraining?.posttest?.toString() || '',
      // Stakeholders Involved
      ngo: selectedTraining?.ngo?.toString() || '',
      government: selectedTraining?.government?.toString() || '',
      privateSector: selectedTraining?.privateSector?.toString() || '',
      academics: selectedTraining?.academics?.toString() || '',
      localCommunity: selectedTraining?.localCommunity?.toString() || '',
      others: selectedTraining?.others?.toString() || '',
    },
  });

  const watchedValues = watch([
    'trainingName',
    'trainingType',
    'date',
    'village',
    'villageId',
    'male',
    'female',
    'elderly',
    'youth',
    'disability',
    'widow',
    'pretest',
    'posttest',
    'ngo',
    'government',
    'privateSector',
    'academics',
    'localCommunity',
    'others',
  ]);

  const hasUnsavedChanges = useCallback(() => {
    return watchedValues.some((value) => value && value.trim() !== '');
  }, [watchedValues]);

  useEffect(() => {
    updateBreadcrumbs(PageEnum.ADD);
  }, [updateBreadcrumbs]);

  const isEditMode = !!selectedTraining;

  useEffect(() => {
    if (selectedTraining) {
      reset({
        trainingName: selectedTraining.trainingName || '',
        trainingType: selectedTraining.trainingType || '',
        date: selectedTraining.date || '',
        village: selectedTraining.village || '',
        villageId: selectedTraining.villageId || '',
        // Number of beneficiaries
        male: selectedTraining.male?.toString() || '',
        female: selectedTraining.female?.toString() || '',
        elderly: selectedTraining.elderly?.toString() || '',
        youth: selectedTraining.youth?.toString() || '',
        disability: selectedTraining.disability?.toString() || '',
        widow: selectedTraining.widow?.toString() || '',
        // Training Assessment
        pretest: selectedTraining.pretest?.toString() || '',
        posttest: selectedTraining.posttest?.toString() || '',
        // Stakeholders Involved
        ngo: selectedTraining.ngo?.toString() || '',
        government: selectedTraining.government?.toString() || '',
        privateSector: selectedTraining.privateSector?.toString() || '',
        academics: selectedTraining.academics?.toString() || '',
        localCommunity: selectedTraining.localCommunity?.toString() || '',
        others: selectedTraining.others?.toString() || '',
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
    setPage(PageEnum.LIST);
    updateBreadcrumbs(PageEnum.LIST);
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
