import { PageEnum } from '@/constants/page';
import { useVillageStore } from '@/stores/villageStore';
import { VillageFormData, villageFormSchema } from '@/types/villageForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  useCreateVillage,
  useUpdateVillage,
  useDeleteVillage,
} from '@/hooks/useVillageData';
import {
  CreateVillageData,
  UpdateVillageData,
} from '@/services/villageService';

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // API hooks
  const createVillageMutation = useCreateVillage();
  const updateVillageMutation = useUpdateVillage();
  const deleteVillageMutation = useDeleteVillage();

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
      villageLat: selectedVillage?.villageLat || 0,
      villageLng: selectedVillage?.villageLng || 0,
      landManageStart: selectedVillage?.landManageStart?.toString() || '0',
      landManageEnd: selectedVillage?.landManageEnd?.toString() || '',
      carbonEmisionStart:
        selectedVillage?.carbonEmisionStart?.toString() || '0',
      carbonEmisionEnd: selectedVillage?.carbonEmisionEnd?.toString() || '',
      potency: selectedVillage?.potency || '',
      climateIssue: selectedVillage?.climateIssue || '',
      mainSourceOfEconomy: selectedVillage?.mainSourceOfEconomy || '',
      srnStatus: selectedVillage?.srnStatus || '',
      // Cat 1
      incomesStart: selectedVillage?.incomesStart?.toString() || '',
      incomesEnd: selectedVillage?.incomesEnd?.toString() || '',
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
        villageLat: selectedVillage.villageLat || 0,
        villageLng: selectedVillage.villageLng || 0,
        landManageStart: selectedVillage.landManageStart?.toString() || '0',
        landManageEnd: selectedVillage.landManageEnd?.toString() || '',
        carbonEmisionStart:
          selectedVillage.carbonEmisionStart?.toString() || '0',
        carbonEmisionEnd: selectedVillage.carbonEmisionEnd?.toString() || '',
        potency: selectedVillage.potency || '',
        climateIssue: selectedVillage.climateIssue || '',
        mainSourceOfEconomy: selectedVillage.mainSourceOfEconomy || '',
        srnStatus: selectedVillage.srnStatus || '',
        // Cat 1
        incomesStart: selectedVillage.incomesStart?.toString() || '',
        incomesEnd: selectedVillage.incomesEnd?.toString() || '',
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

  const handleDelete = () => {
    if (isEditMode && selectedVillage) {
      setShowDeleteModal(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (isEditMode && selectedVillage) {
      try {
        await deleteVillageMutation.mutateAsync(selectedVillage.id);
        setShowDeleteModal(false);
        navigateBack();
      } catch (error) {
        console.error('Failed to delete village:', error);
        // Handle error (could show toast or alert)
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const onSubmit = async (data: VillageFormData) => {
    try {
      console.log('Saving village:', data);

      // Transform form data to API format
      const villageData: CreateVillageData = {
        name: data.villageName,
        id: data.villageCode,
        // category: data.villageCategory,
        // totalPopulation: 0,
        latitude: `${data.villageLat}`,
        longitude: `${data.villageLng}`,
        startLandManaged: Number(data.landManageStart) || 0,
        endLandManaged: data.landManageEnd
          ? Number(data.landManageEnd)
          : undefined,
        startCarbonEmission: Number(data.carbonEmisionStart) || 0,
        endCarbonEmission: data.carbonEmisionEnd
          ? Number(data.carbonEmisionEnd)
          : undefined,
        potency: data.potency,
        climateIssue: data.climateIssue,
        sourceEconomy: data.mainSourceOfEconomy,
        // srnStatus: data.srnStatus,
        // incomesStart: data.incomesStart ? Number(data.incomesStart) : undefined,
        incomesEnd: data.incomesEnd ? Number(data.incomesEnd) : undefined,
        seedCapital: data.seedCapital,

        categoryId: '68c687806fe5698b8689b060',
      };

      if (isEditMode && selectedVillage) {
        // Update existing village
        await updateVillageMutation.mutateAsync({
          villageData: {
            ...villageData,
            id: selectedVillage.id,
          } as UpdateVillageData,
        });
      } else {
        // Create new village
        await createVillageMutation.mutateAsync({
          villageData: villageData as CreateVillageData,
        });
      }

      navigateBack();
    } catch (error) {
      console.error('Failed to save village:', error);
      // Handle error (could show toast or alert)
    }
  };

  const state = {
    control,
    isEditMode,
    breadcrumbs,
    showSubmitModal,
    showLeaveModal,
    showDeleteModal,
    isSubmitting:
      isSubmitting ||
      createVillageMutation.isPending ||
      updateVillageMutation.isPending,
    isDeleting: deleteVillageMutation.isPending,
    errors,
    selectedCategory,
  };

  console.log('errors', errors);

  const action = {
    handleBack,
    handleFormSubmit,
    handleLeaveConfirm,
    handleLeaveCancel,
    handleSubmitConfirm,
    handleSubmitCancel,
    handleDelete,
    handleDeleteConfirm,
    handleDeleteCancel,
    hasUnsavedChanges,
    setValue,
    watch,
  };

  return {
    state,
    action,
  };
};
