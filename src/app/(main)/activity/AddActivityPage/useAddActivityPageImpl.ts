'use client';

import { PageEnum } from '@/constants/page';
import {
  useCreateActivity,
  useUpdateActivity,
  useActivity,
} from '@/hooks/useActivityData';
import { useGlobalVillages } from '@/hooks/useGlobalVillages';
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

  // Fetch detailed activity data by ID when editing
  const activityId = selectedActivity?.id || null;
  const {
    data: detailedActivity,
    isLoading: isLoadingActivity,
    error: activityError,
  } = useActivity(activityId, { enabled: !!activityId });

  // Use detailed data if available, fallback to store data
  const activityData = detailedActivity || selectedActivity;

  // fetch village options from global store
  const { villages, isLoading } = useGlobalVillages();

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
      activityName: activityData?.activityName || '',
      villageId: activityData?.villageId || '',
      description: activityData?.description || '',
      startDate: formatDateForInput(activityData?.startDate),
      endDate: formatDateForInput(activityData?.endDate),
      status: activityData?.status || 'not yet',
      percentage: activityData?.percentage || '',
      type: activityData?.type || 'workshop',
      files: activityData?.files ? activityData?.files : [],
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

  const isEditMode = !!activityData;

  useEffect(() => {
    if (activityData) {
      reset({
        activityName: activityData.activityName || '',
        villageId: activityData.villageId || '',
        description: activityData.description || '',
        startDate: formatDateForInput(activityData.startDate),
        endDate: formatDateForInput(activityData.endDate),
        status: activityData.status || 'inactive',
        percentage: activityData.percentage || '',
        type: activityData.type || 'workshop',
        files: activityData.files ? activityData.files : [],
      });
    }
  }, [activityData, reset]);

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

      if (isEditMode && activityData?.id) {
        const updateData: UpdateActivityData = {
          name: data.activityName,
          villageId: data.villageId,
          description: data.description,
          start_date: data.startDate,
          end_date: data.endDate,
          status: data.status,
          percentage: Number(data.percentage),
          type: data.type,
        };

        await updateActivityMutation.mutateAsync({
          activityData: updateData,
          activityId: activityData.id,
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
    selectedActivity: activityData,
    isLoadingActivity,
    activityError,
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
