import { ActivityPageEnum, useActivityStore } from '@/stores/activityStore';
import { VillagePageEnum } from '@/stores/villageStore';
import { ActivityFormData, activityFormSchema } from '@/types/activityForm';
import { VillageFormData } from '@/types/villageForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';

export const useAddActivityPageImpl = () => {
  const { updateBreadcrumbs, setPage, selectedActivity, breadcrumbs } =
    useActivityStore();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ActivityFormData>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      activityName: selectedActivity?.activityName || '',
      activityCategory: selectedActivity?.activityCategory || '',
      description: selectedActivity?.description || '',
      startDate: selectedActivity?.startDate || '',
      endDate: selectedActivity?.endDate || '',
      status: selectedActivity?.status || 'inactive',
      progress: selectedActivity?.progress || 0,
      files: selectedActivity?.files ? selectedActivity?.files : [],
    },
  });

  const watchedValues = watch([
    'activityName',
    'activityCategory',
    'description',
    'startDate',
    'endDate',
    'status',
    'progress',
    'files',
  ]);

  const hasUnsavedChanges = useCallback(() => {
    return watchedValues.some(
      (value) =>
        (typeof value === 'string' && value.trim() !== '') ||
        (typeof value === 'number' && value !== 0)
    );
  }, [watchedValues]);

  useEffect(() => {
    updateBreadcrumbs(ActivityPageEnum.ADD);
  }, [updateBreadcrumbs]);

  const isEditMode = !!selectedActivity;

  useEffect(() => {
    if (selectedActivity) {
      reset({
        activityName: selectedActivity.activityName || '',
        activityCategory: selectedActivity.activityCategory || '',
        description: selectedActivity.description || '',
        startDate: selectedActivity.startDate || '',
        endDate: selectedActivity.endDate || '',
        status: selectedActivity.status || 'inactive',
        progress: selectedActivity.progress || 0,
        files: selectedActivity.files ? selectedActivity.files : [],
      });
    }
  }, [selectedActivity, reset]);

  const handleBack = () => {
    if (hasUnsavedChanges()) {
      setShowLeaveModal(true);
    } else {
      navigateBack();
    }
  };

  const navigateBack = () => {
    setPage(ActivityPageEnum.LIST);
    updateBreadcrumbs(ActivityPageEnum.LIST);
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

  const onSubmit = async (data: ActivityFormData) => {
    try {
      console.log('Saving activity:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigateBack();
    } catch (error) {
      console.error('Failed to save activity:', error);
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
