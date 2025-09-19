import { useVillageStore } from '@/stores/villageStore';
import { useEffect, useState } from 'react';
import { VillageData } from '@/types/village';
import {
  useVillages,
  useDeleteVillage,
  useVillage,
} from '@/hooks/useVillageData';
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [villageToDelete, setVillageToDelete] = useState<VillageData | null>(
    null
  );
  const [selectedVillageId, setSelectedVillageId] = useState<string | null>(
    null
  );

  const { data: villages = [], isLoading, error } = useVillages();

  // Only fetch village detail when a village is selected
  const { data: villageDetail, isLoading: isLoadingVillage } = useVillage(
    selectedVillageId,
    {
      enabled: !!selectedVillageId,
    }
  );

  const deleteVillageMutation = useDeleteVillage();

  // Ensure villages is always an array
  const safeVillages = Array.isArray(villages) ? villages : [];

  useEffect(() => {
    if (page === PageEnum.LIST) {
      updateBreadcrumbs(PageEnum.LIST);
    }
  }, [page, updateBreadcrumbs]);

  // Effect to handle navigation after village detail is loaded
  useEffect(() => {
    if (villageDetail && selectedVillageId && !isLoadingVillage) {
      // Update the store with detailed village data and navigate
      // Mapped village response to VillageData structure
      navigateToDetail(villageDetail);
      setSelectedVillageId(null); // Reset after navigation
    }
  }, [villageDetail, selectedVillageId, isLoadingVillage, navigateToDetail]);

  const handleView = (data: VillageData) => {
    // Set the selected village ID to trigger the detail fetch
    setSelectedVillageId(data.villageCode);
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
    setVillageToDelete(data);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (villageToDelete) {
      try {
        await deleteVillageMutation.mutateAsync(villageToDelete.villageCode);
        setShowDeleteModal(false);
        setVillageToDelete(null);
      } catch (error) {
        console.error('Failed to delete village:', error);
        // Handle error (could show toast or alert)
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setVillageToDelete(null);
  };

  const columns = createVillageColumns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  const state = {
    columns,
    villages: safeVillages,
    error,
    isLoading,
    searchQuery,
    page,
    showCategoryModal,
    showDeleteModal,
    villageToDelete,
    isDeleting: deleteVillageMutation.isPending,
    isLoadingVillage, // Add this to show loading state during detail fetch
  };

  const action = {
    handleAddNew,
    handleView,
    handleEdit,
    handleDelete,
    handleDeleteConfirm,
    handleDeleteCancel,
    setSearchQuery,
    handleCategorySelect,
    handleCloseCategoryModal,
  };

  return { state, action };
};
