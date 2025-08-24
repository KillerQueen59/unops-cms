import { TrainingPageEnum } from '@/stores/trainingStore';
import { useVillageStore, VillagePageEnum } from '@/stores/villageStore';
import { TrainingData } from '@/types/training';
import { useEffect } from 'react';
import { VillageData } from '@/types/village';
import { useVillages } from '@/hooks/useVillageData';
import { createVillageColumns } from './VillageColumn';

export const useVillagePageImpl = () => {
  const {
    searchQuery,
    page,
    setSearchQuery,
    updateBreadcrumbs,
    setPage,
    navigateToDetail,
    navigateToEdit,
    resetVillage,
  } = useVillageStore();

  const { data: villages = [], isLoading, error } = useVillages();

  useEffect(() => {
    if (page === VillagePageEnum.LIST) {
      updateBreadcrumbs(VillagePageEnum.LIST);
    }
  }, [page, updateBreadcrumbs]);

  const handleView = (data: VillageData) => {
    navigateToDetail(data);
  };

  const handleEdit = (data: VillageData) => {
    navigateToEdit(data);
  };

  const handleAddNew = () => {
    resetVillage();
    setPage(VillagePageEnum.ADD);
    updateBreadcrumbs(VillagePageEnum.ADD);
  };

  const handleDelete = (data: VillageData) => {
    console.log('Delete:', data);
  };

  const columns = createVillageColumns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  const state = {
    columns,
    villages,
    error,
    isLoading,
    searchQuery,
    page,
  };

  const action = {
    handleAddNew,
    handleView,
    handleEdit,
    handleDelete,
    setSearchQuery,
  };

  return { state, action };
};
