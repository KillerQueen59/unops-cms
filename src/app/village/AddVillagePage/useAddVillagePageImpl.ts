import { PageEnum } from '@/constants/page';
import { useVillageStore } from '@/stores/villageStore';
import { VillageFormData, villageFormSchema } from '@/types/villageForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';

export const useAddVillagePageImpl = () => {
  const {
    updateBreadcrumbs,
    setPage,
    selectedVillage,
    selectedCategory,
    breadcrumbs,
  } = useVillageStore();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<VillageFormData>({
    resolver: zodResolver(villageFormSchema),
    defaultValues: {
      villageName: selectedVillage?.villageName || '',
      villageCode: selectedVillage?.villageCode || '',
      villageCategory:
        selectedVillage?.villageCategory || selectedCategory || '',
      totalPopulation: selectedVillage?.totalPopulation || 0,
      villageLat: selectedVillage?.villageLat || 0,
      villageLng: selectedVillage?.villageLng || 0,
      landManageStart: selectedVillage?.landManageStart || 0,
      landManageEnd: selectedVillage?.landManageEnd || undefined,
      carbonEmisionStart: selectedVillage?.carbonEmisionStart || 0,
      carbonEmisionEnd: selectedVillage?.carbonEmisionEnd || undefined,
      potency: selectedVillage?.potency || '',
      climateIssue: selectedVillage?.climateIssue || '',
      mainSourceOfEconomy: selectedVillage?.mainSourceOfEconomy || '',
      srnStatus: selectedVillage?.srnStatus || '',
      // Cat 1
      incomesStart: selectedVillage?.incomesStart || undefined,
      incomesEnd: selectedVillage?.incomesEnd || undefined,
      unsustainableLandClearings:
        selectedVillage?.unsustainableLandClearings || [],
      // Cat 2
      incomes: selectedVillage?.incomes || [],
      seedCapital: selectedVillage?.seedCapital || undefined,
    },
  });

  const watchedValues = watch([
    'villageName',
    'villageCode',
    'villageCategory',
    'totalPopulation',
    'villageLat',
    'villageLng',
    'landManageStart',
    'landManageEnd',
    'carbonEmisionStart',
    'carbonEmisionEnd',
    'potency',
    'climateIssue',
    'mainSourceOfEconomy',
    'srnStatus',
    'incomesStart',
    'incomesEnd',
    'seedCapital',
  ]);

  const hasUnsavedChanges = useCallback(() => {
    return watchedValues.some((value) => {
      if (typeof value === 'string') {
        return value.trim() !== '';
      }
      if (typeof value === 'number') {
        return value !== 0;
      }
      return false;
    });
  }, [watchedValues]);

  useEffect(() => {
    updateBreadcrumbs(PageEnum.ADD);
  }, [updateBreadcrumbs]);

  const isEditMode = !!selectedVillage;

  useEffect(() => {
    if (selectedVillage) {
      reset({
        villageName: selectedVillage.villageName || '',
        villageCode: selectedVillage.villageCode || '',
        villageCategory: selectedVillage.villageCategory || '',
        totalPopulation: selectedVillage.totalPopulation || 0,
        villageLat: selectedVillage.villageLat || 0,
        villageLng: selectedVillage.villageLng || 0,
        landManageStart: selectedVillage.landManageStart || 0,
        landManageEnd: selectedVillage.landManageEnd || undefined,
        carbonEmisionStart: selectedVillage.carbonEmisionStart || 0,
        carbonEmisionEnd: selectedVillage.carbonEmisionEnd || undefined,
        potency: selectedVillage.potency || '',
        climateIssue: selectedVillage.climateIssue || '',
        mainSourceOfEconomy: selectedVillage.mainSourceOfEconomy || '',
        srnStatus: selectedVillage.srnStatus || '',
        // Cat 1
        incomesStart: selectedVillage.incomesStart || undefined,
        incomesEnd: selectedVillage.incomesEnd || undefined,
        unsustainableLandClearings:
          selectedVillage.unsustainableLandClearings || [],
        // Cat 2
        incomes: selectedVillage.incomes || [],
        seedCapital: selectedVillage.seedCapital || undefined,
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
    selectedCategory,
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
