import { useVillageStore } from '@/stores/villageStore';
import { useEffect, useMemo, useState } from 'react';
import { VillageData } from '@/types/village';
import {
  useVillages,
  useDeleteVillage,
  useVillage,
  useVillageCategories,
} from '@/hooks/useVillageData';
import { createVillageColumns } from './VillageColumn';
import { PageEnum } from '@/constants/page';

export const useVillagePageImpl = () => {
  const {
    searchQuery,
    page,
    filters,
    isFilterModalOpen,
    setSearchQuery,
    updateBreadcrumbs,
    setPage,
    navigateToDetail,
    navigateToEdit,
    resetVillage,
    setSelectedCategory,
    setIsFilterModalOpen,
  } = useVillageStore();

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [villageToDelete, setVillageToDelete] = useState<VillageData | null>(
    null
  );
  const [selectedVillageId, setSelectedVillageId] = useState<string | null>(
    null
  );

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isEdit, setIsEdit] = useState(false);
  const { data: villageCategories } = useVillageCategories();

  const apiFilters = useMemo(
    () => ({
      categoryId:
        villageCategories?.find((cat) => cat.name === filters.categoryId)
          ?._id || '',
    }),
    [filters, villageCategories]
  );

  // Use pagination parameters
  const {
    data: villagesResponse,
    isLoading,
    error,
  } = useVillages({
    page: currentPage,
    pageSize: pageSize,
    search: searchQuery,
    ...apiFilters,
  });

  // Extract villages and pagination info from response
  const villages = villagesResponse?.data || [];
  const totalItems = villagesResponse?.totalData || 0;
  const totalPages = villagesResponse?.totalPages || 0;

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

  // Reset page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  useEffect(() => {
    if (page === PageEnum.LIST) {
      updateBreadcrumbs(PageEnum.LIST);
    }
  }, [page, updateBreadcrumbs]);

  useEffect(() => {
    if (villageDetail && selectedVillageId && !isLoadingVillage) {
      if (isEdit) {
        navigateToEdit(villageDetail);
        setSelectedCategory(villageDetail.villageCategory.id);
      } else {
        navigateToDetail(villageDetail);
        setSelectedCategory(villageDetail.villageCategory.id);
      }

      setSelectedVillageId(null);
      setIsEdit(false);
    }
  }, [
    villageDetail,
    selectedVillageId,
    isLoadingVillage,
    navigateToDetail,
    isEdit,
    navigateToEdit,
  ]);

  const handleView = (data: VillageData) => {
    setSelectedVillageId(data.villageCode);
  };

  const handleEdit = (data: VillageData) => {
    setIsEdit(true);
    setSelectedVillageId(data.villageCode);
  };

  const handleAddNew = () => {
    resetVillage();
    setShowCategoryModal(true);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(
      villageCategories?.find((cat) => cat.name === category)?._id || category
    );
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

  const handleOpenFilter = () => {
    setIsFilterModalOpen(true);
  };

  const handleCloseFilter = () => {
    setIsFilterModalOpen(false);
  };

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
    // Pagination state
    totalItems,
    totalPages,
    currentPage,
    pageSize,
    // Filter options and current filters
    filters,
    isFilterModalOpen,
    villageCategories,
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
    // Pagination actions
    handlePageChange,
    handlePageSizeChange,
    setIsFilterModalOpen,
    handleOpenFilter,
    handleCloseFilter,
  };

  return { state, action };
};
