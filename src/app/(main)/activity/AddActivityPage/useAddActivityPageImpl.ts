'use client';

import { PageEnum } from '@/constants/page';
import { useCreateActivity, useUpdateActivity } from '@/hooks/useActivityData';
import { useVillages } from '@/hooks/useVillageData';
import {
  CreateActivityData,
  UpdateActivityData,
} from '@/services/activityService';
import { useActivityStore } from '@/stores/activityStore';
import { ActivityFormData, activityFormSchema } from '@/types/activityForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';

export const useAddActivityPageImpl = () => {
  const { updateBreadcrumbs, setPage, selectedActivity, breadcrumbs } =
    useActivityStore();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const createActivityMutation = useCreateActivity();
  const updateActivityMutation = useUpdateActivity();

  // fetch village
  const { data: villagesResponse, isLoading, error } = useVillages();
  const villages = villagesResponse?.data || [];

  const villageOptions = villages.map((village) => ({
    label: village.villageName,
    value: village.villageCode,
    category: village.categoryName,
  }));

  const formatDateForInput = (dateString: string | undefined): string => {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) return '';

      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ActivityFormData>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      activityName: selectedActivity?.activityName || '',
      villageId: selectedActivity?.villageId || '',
      category: selectedActivity?.category || '',
      description: selectedActivity?.description || '',
      startDate: formatDateForInput(selectedActivity?.startDate),
      endDate: formatDateForInput(selectedActivity?.endDate),
      status: selectedActivity?.status || 'not yet',
      percentage: selectedActivity?.percentage || '',
      type: selectedActivity?.type || undefined,
      files: selectedActivity?.files ? selectedActivity?.files : [],
    },
  });

  const watchedValues = watch([
    'activityName',
    'villageId',
    'description',
    'startDate',
    'endDate',
    'status',
    'percentage',
    'type',
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
    updateBreadcrumbs(PageEnum.ADD);
  }, [updateBreadcrumbs]);

  const isEditMode = !!selectedActivity;

  useEffect(() => {
    if (selectedActivity) {
      reset({
        activityName: selectedActivity.activityName || '',
        villageId: selectedActivity.villageId || '',
        description: selectedActivity.description || '',
        startDate: formatDateForInput(selectedActivity.startDate),
        endDate: formatDateForInput(selectedActivity.endDate),
        status: selectedActivity.status || 'inactive',
        percentage: selectedActivity.percentage || '',
        type: selectedActivity.type || undefined,
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

  const onSubmit = async (data: ActivityFormData) => {
    try {
      setSubmitError(null);

      if (isEditMode && selectedActivity?.id) {
        const updateData: UpdateActivityData = {
          name: data.activityName,
          villageId: data.villageId,
          description: data.description,
          start_date: data.startDate,
          end_date: data.endDate,
          status: data.status,
          percentage: Number(data.percentage),
          type: data.type,
          category: data.category,
        };

        await updateActivityMutation.mutateAsync({
          activityData: updateData,
          activityId: selectedActivity.id,
          files: data.files,
        });
      } else {
        const createActivityData: CreateActivityData = {
          name: data.activityName,
          villageId: data.villageId,
          description: data.description,
          start_date: data.startDate,
          end_date: data.endDate,
          status: data.status,
          percentage: Number(data.percentage),
          type: data.type,
          category: data.category,
        };

        // Create new training
        await createActivityMutation.mutateAsync({
          activityData: createActivityData,
          files: data.files.filter(
            (file): file is File => file instanceof File
          ),
        });
      }

      navigateBack();
    } catch (error) {
      console.error('Failed to save activity:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to save activity';
      setSubmitError(errorMessage);
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
    villageOptions,
    isLoadingVillages: isLoading,
    submitError,
    selectedActivity,
  };

  const action = {
    handleBack,
    handleFormSubmit,
    handleLeaveConfirm,
    handleLeaveCancel,
    handleSubmitConfirm,
    handleSubmitCancel,
    hasUnsavedChanges,
    watch,
    setValue,
  };

  return {
    state,
    action,
  };
};
