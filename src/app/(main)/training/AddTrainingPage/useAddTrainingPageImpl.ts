'use client';
import { PageEnum } from '@/constants/page';
import { useTrainingStore } from '@/stores';
import { TrainingFormData, trainingFormSchema } from '@/types/trainingForm';
import { useCreateTraining, useUpdateTraining } from '@/hooks/useTrainingData';
import { TrainingData } from '@/types/training';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useVillages } from '@/hooks/useVillageData';
import toast from 'react-hot-toast';

export const useAddTrainingPageImpl = () => {
  const { updateBreadcrumbs, setPage, selectedTraining, breadcrumbs } =
    useTrainingStore();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // API hooks
  const createTrainingMutation = useCreateTraining();
  const updateTrainingMutation = useUpdateTraining();

  // fetch village
  const { data: villagesResponse, isLoading, error } = useVillages();
  const villages = villagesResponse?.data || [];

  const villageOptions = villages.map((village) => ({
    label: village.villageName,
    value: village.villageCode,
  }));

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
    setValue,
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
      setSubmitError(null); // Clear any previous errors

      // Transform form data to API format
      const trainingData: Partial<TrainingData> = {
        id: selectedTraining?.id,
        trainingName: data.trainingName,
        trainingType: data.trainingType,
        date: data.date,
        village: data.village,
        villageId: data.villageId,
        // Number of beneficiaries
        male: parseInt(data.male || '0'),
        female: parseInt(data.female || '0'),
        elderly: parseInt(data.elderly || '0'),
        youth: parseInt(data.youth || '0'),
        disability: parseInt(data.disability || '0'),
        widow: parseInt(data.widow || '0'),
        // Training Assessment
        pretest: parseInt(data.pretest || '0'),
        posttest: parseInt(data.posttest || '0'),
        // Stakeholders Involved
        ngo: parseInt(data.ngo || '0'),
        government: parseInt(data.government || '0'),
        privateSector: parseInt(data.privateSector || '0'),
        academics: parseInt(data.academics || '0'),
        localCommunity: parseInt(data.localCommunity || '0'),
        others: parseInt(data.others || '0'),
      };

      if (isEditMode && selectedTraining?.id) {
        // Update existing training
        await updateTrainingMutation.mutateAsync({
          trainingData,
        });
      } else {
        // Create new training
        await createTrainingMutation.mutateAsync({
          trainingData,
        });
      }

      navigateBack();
    } catch (error) {
      console.error('Failed to save training:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to save training';
      setSubmitError(errorMessage);
    }
  };

  useEffect(() => {
    if (errors && Object.keys(errors).length > 0) {
      toast.error(
        'Please fix the errors in the form: ' + JSON.stringify(errors)
      );
    }
  }, [errors]);

  const state = {
    control,
    isEditMode,
    breadcrumbs,
    showSubmitModal,
    showLeaveModal,
    isSubmitting:
      createTrainingMutation.isPending || updateTrainingMutation.isPending,
    errors,
    submitError,
    villageOptions,
    isLoadingVillages: isLoading,
  };

  const action = {
    handleBack,
    handleFormSubmit,
    handleLeaveConfirm,
    handleLeaveCancel,
    handleSubmitConfirm,
    handleSubmitCancel,
    hasUnsavedChanges,
    setValue,
    watch,
  };

  return {
    state,
    action,
  };
};
