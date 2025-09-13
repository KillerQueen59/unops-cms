import { useVillageStore } from '@/stores/villageStore';
import { useEffect, useState } from 'react';
import { VillageData } from '@/types/village';
import { useVillages } from '@/hooks/useVillageData';
import { createVillageColumns } from './VillageColumn';
import { PageEnum } from '@/constants/page';

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
    setSelectedCategory,
  } = useVillageStore();

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const { data: villages = [], isLoading, error } = useVillages();

  useEffect(() => {
    if (page === PageEnum.LIST) {
      updateBreadcrumbs(PageEnum.LIST);
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
    setShowCategoryModal(true);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setPage(PageEnum.ADD);
    updateBreadcrumbs(PageEnum.ADD);
    setShowCategoryModal(false);
  };

  const handleCloseCategoryModal = () => {
    setShowCategoryModal(false);
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
    showCategoryModal,
  };

  const action = {
    handleAddNew,
    handleView,
    handleEdit,
    handleDelete,
    setSearchQuery,
    handleCategorySelect,
    handleCloseCategoryModal,
  };

  return { state, action };
};
