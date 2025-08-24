import { useVillageStore, VillagePageEnum } from '@/stores/villageStore';
import { VillageFormData, villageFormSchema } from '@/types/villageForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';

export const useAddVillagePageImpl = () => {
  const { updateBreadcrumbs, setPage, selectedVillage, breadcrumbs } =
    useVillageStore();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VillageFormData>({
    resolver: zodResolver(villageFormSchema),
    defaultValues: {
      villageName: selectedVillage?.villageName || '',
      villageCode: selectedVillage?.villageCode || '',
      totalPopulation: selectedVillage?.totalPopulation || 0,
      villageAddress: selectedVillage?.villageAddress || '',
      villageLat: selectedVillage?.villageLat || 0,
      villageLng: selectedVillage?.villageLng || 0,
      totalLandManage: selectedVillage?.totalLandManage || 0,
      totalCarbonEmissions: selectedVillage?.totalCarbonEmissions || 0,
    },
  });

  const watchedValues = watch([
    'villageName',
    'villageCode',
    'totalPopulation',
    'villageAddress',
    'villageLat',
    'villageLng',
    'totalLandManage',
    'totalCarbonEmissions',
  ]);

  const hasUnsavedChanges = useCallback(() => {
    return watchedValues.some(
      (value) =>
        (typeof value === 'string' && value.trim() !== '') ||
        (typeof value === 'number' && value !== 0)
    );
  }, [watchedValues]);

  useEffect(() => {
    updateBreadcrumbs(VillagePageEnum.ADD);
  }, [updateBreadcrumbs]);

  const isEditMode = !!selectedVillage;

  useEffect(() => {
    if (selectedVillage) {
      reset({
        villageName: selectedVillage.villageName || '',
        villageCode: selectedVillage.villageCode || '',
        totalPopulation: selectedVillage.totalPopulation || 0,
        villageAddress: selectedVillage.villageAddress || '',
        villageLat: selectedVillage.villageLat || 0,
        villageLng: selectedVillage.villageLng || 0,
        totalLandManage: selectedVillage.totalLandManage || 0,
        totalCarbonEmissions: selectedVillage.totalCarbonEmissions || 0,
      });
    }
  }, [selectedVillage, reset]);

  const handleBack = () => {
    if (hasUnsavedChanges()) {
      setShowLeaveModal(true);
    } else {
      navigateBack();
    }
  };

  const navigateBack = () => {
    setPage(VillagePageEnum.LIST);
    updateBreadcrumbs(VillagePageEnum.LIST);
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

  const onSubmit = async (data: VillageFormData) => {
    try {
      console.log('Saving village:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigateBack();
    } catch (error) {
      console.error('Failed to save village:', error);
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
