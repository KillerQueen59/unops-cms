import { useEffect } from 'react';
import { DemositePageEnum, useDemositeStore } from '@/stores/demositeStore';
import { useDemosites } from '@/hooks/useDemositeData';
import { DemositeData } from '@/types/demosite';

export const useDemositePageImpl = () => {
  const {
    searchQuery,
    page,
    currentPage,
    itemsPerPage,
    setSearchQuery,
    updateBreadcrumbs,
    setPage,
    setCurrentPage,
    setItemsPerPage,
    navigateToDetail,
    navigateToEdit,
    resetDemosite,
  } = useDemositeStore();

  const { data: demosites = [], isLoading, error } = useDemosites();

  useEffect(() => {
    if (page === DemositePageEnum.LIST) {
      updateBreadcrumbs(DemositePageEnum.LIST);
    }
  }, [page, updateBreadcrumbs]);

  const handleView = (data: DemositeData) => {
    navigateToDetail(data);
  };

  const handleEdit = (data: DemositeData) => {
    navigateToEdit(data);
  };

  const handleAddNew = () => {
    resetDemosite();
    setPage(DemositePageEnum.ADD);
    updateBreadcrumbs(DemositePageEnum.ADD);
  };

  const handleDelete = (data: DemositeData) => {
    console.log('Delete:', data);
  };

  const state = {
    demosites,
    error,
    isLoading,
    searchQuery,
    page,
    currentPage,
    itemsPerPage,
  };

  const action = {
    handleAddNew,
    handleView,
    handleEdit,
    handleDelete,
    setSearchQuery,
    setCurrentPage,
    setItemsPerPage,
  };

  return { state, action };
};
