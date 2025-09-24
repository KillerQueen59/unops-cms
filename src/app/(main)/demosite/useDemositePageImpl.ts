import { useEffect, useState, useMemo } from 'react';
import { DemositePageEnum, useDemositeStore } from '@/stores/demositeStore';
import {
  useDemosites,
  useDeleteDemosite,
  useDemosite,
} from '@/hooks/useDemositeData';
import { DemositeData } from '@/types/demosite';

export const useDemositePageImpl = () => {
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
    resetDemosite,
    setIsFilterModalOpen,
  } = useDemositeStore();

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [demositeToDelete, setDemositeToDelete] = useState<DemositeData | null>(
    null
  );
  const [selectedDemositeId, setSelectedDemositeId] = useState<string | null>(
    null
  );

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(16);
  const [isEdit, setIsEdit] = useState(false);

  const apiFilters = useMemo(
    () => ({
      type: filters.type,
    }),
    [filters]
  );

  // Use pagination parameters with filters
  const {
    data: demositesResponse,
    isLoading,
    error,
  } = useDemosites(apiFilters);

  // Extract demosites and pagination info from response
  // Filter demosites locally by search query (title)
  const filteredDemosites = useMemo(() => {
    const allDemosites = demositesResponse?.data || [];
    if (!searchQuery.trim()) {
      return allDemosites;
    }
    return allDemosites.filter((demosite) =>
      demosite.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
  }, [demositesResponse?.data, searchQuery]);

  // Calculate pagination for filtered results
  const totalItems = filteredDemosites.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedDemosites = filteredDemosites.slice(startIndex, endIndex);

  // Use paginated demosites for display
  const demosites = paginatedDemosites;

  // Ensure demosites is always an array
  const safeDemosites = Array.isArray(demosites) ? demosites : [];

  // Only fetch demosite detail when a demosite is selected
  const { data: demositeDetail, isLoading: isLoadingDemosite } = useDemosite(
    selectedDemositeId,
    {
      enabled: !!selectedDemositeId,
    }
  );

  const deleteDemositeMutation = useDeleteDemosite();

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
    setCurrentPage(1);
  };

  useEffect(() => {
    if (page === DemositePageEnum.LIST) {
      updateBreadcrumbs(DemositePageEnum.LIST);
    }
  }, [page, updateBreadcrumbs]);

  useEffect(() => {
    if (demositeDetail && selectedDemositeId && !isLoadingDemosite) {
      if (isEdit) {
        navigateToEdit(demositeDetail);
      } else {
        navigateToDetail(demositeDetail);
      }

      setSelectedDemositeId(null);
      setIsEdit(false);
    }
  }, [
    demositeDetail,
    selectedDemositeId,
    isLoadingDemosite,
    navigateToDetail,
    isEdit,
    navigateToEdit,
  ]);

  const handleView = (data: DemositeData) => {
    setSelectedDemositeId(data.id);
  };

  const handleEdit = (data: DemositeData) => {
    setIsEdit(true);
    setSelectedDemositeId(data.id);
  };

  const handleAddNew = () => {
    resetDemosite();
    setPage(DemositePageEnum.ADD);
    updateBreadcrumbs(DemositePageEnum.ADD);
  };

  const handleDelete = (data: DemositeData) => {
    setDemositeToDelete(data);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (demositeToDelete) {
      try {
        await deleteDemositeMutation.mutateAsync(demositeToDelete.id);
        setShowDeleteModal(false);
        setDemositeToDelete(null);
      } catch (error) {
        console.error('Failed to delete demosite:', error);
        // Handle error (could show toast or alert)
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setDemositeToDelete(null);
  };

  const handleOpenFilter = () => {
    setIsFilterModalOpen(true);
  };

  const handleCloseFilter = () => {
    setIsFilterModalOpen(false);
  };

  const state = {
    demosites: safeDemosites,
    error,
    isLoading,
    searchQuery,
    page,
    isFilterModalOpen,
    showDeleteModal,
    demositeToDelete,
    isDeleting: deleteDemositeMutation.isPending,
    isLoadingDemosite, // Add this to show loading state during detail fetch
    // Pagination state
    totalItems,
    totalPages,
    currentPage,
    pageSize,
    // Filter options and current filters
    filters,
  };

  const action = {
    handleAddNew,
    handleView,
    handleEdit,
    handleDelete,
    handleDeleteConfirm,
    handleDeleteCancel,
    setSearchQuery,
    handleOpenFilter,
    handleCloseFilter,
    // Pagination actions
    handlePageChange,
    handlePageSizeChange,
  };

  return { state, action };
};
