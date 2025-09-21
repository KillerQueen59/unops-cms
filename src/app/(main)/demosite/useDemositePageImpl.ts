import { useEffect, useState } from 'react';
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
    setSearchQuery,
    updateBreadcrumbs,
    setPage,
    navigateToDetail,
    navigateToEdit,
    resetDemosite,
  } = useDemositeStore();

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

  const {
    data: demositesResponse,
    isLoading,
    error,
  } = useDemosites({
    page: currentPage,
    pageSize: pageSize,
  });

  const allDemosites = demositesResponse?.data || [];
  const filteredDemosites = allDemosites.filter((demosite) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    const matchesType = demosite.type?.toLowerCase().includes(query) || false;
    const matchesStory = demosite.story?.toLowerCase().includes(query) || false;
    const matchesTitle = demosite.title?.toLowerCase().includes(query) || false;

    return matchesType || matchesStory || matchesTitle;
  });

  const totalItems = filteredDemosites.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const demosites = filteredDemosites.slice(startIndex, endIndex);

  const { data: demositeDetail, isLoading: isLoadingDemosite } = useDemosite(
    selectedDemositeId,
    {
      enabled: !!selectedDemositeId,
    }
  );

  const deleteDemositeMutation = useDeleteDemosite();

  const safeDemosites = Array.isArray(demosites) ? demosites : [];

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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

  const state = {
    demosites: safeDemosites,
    error,
    isLoading,
    searchQuery,
    page,
    showDeleteModal,
    demositeToDelete,
    isDeleting: deleteDemositeMutation.isPending,
    isLoadingDemosite, // Add this to show loading state during detail fetch
    // Pagination state
    totalItems,
    totalPages,
    currentPage,
    pageSize,
  };

  const action = {
    handleAddNew,
    handleView,
    handleEdit,
    handleDelete,
    handleDeleteConfirm,
    handleDeleteCancel,
    setSearchQuery,
    // Pagination actions
    handlePageChange,
    handlePageSizeChange,
    setCurrentPage,
  };

  return { state, action };
};
