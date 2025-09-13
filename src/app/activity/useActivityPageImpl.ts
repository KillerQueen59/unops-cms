import { useEffect } from 'react';
import { createActivityColumns } from './ActivityColumn';
import { ActivityPageEnum, useActivityStore } from '@/stores/activityStore';
import { useActivities } from '@/hooks/useActivityData';
import { ActivityData } from '@/types/activity';
import { ActivityFilters } from './components/FilterModal';

export const useActivityPageImpl = () => {
  const {
    searchQuery,
    page,
    isFilterModalOpen,
    setSearchQuery,
    updateBreadcrumbs,
    setPage,
    navigateToDetail,
    navigateToEdit,
    resetActivity,
    setIsFilterModalOpen,
  } = useActivityStore();

  const { data: activities = [], isLoading, error } = useActivities();

  useEffect(() => {
    if (page === ActivityPageEnum.LIST) {
      updateBreadcrumbs(ActivityPageEnum.LIST);
    }
  }, [page, updateBreadcrumbs]);

  const handleView = (data: ActivityData) => {
    navigateToDetail(data);
  };

  const handleEdit = (data: ActivityData) => {
    navigateToEdit(data);
  };

  const handleAddNew = () => {
    resetActivity();
    setPage(ActivityPageEnum.ADD);
    updateBreadcrumbs(ActivityPageEnum.ADD);
  };

  const handleDelete = (data: ActivityData) => {
    console.log('Delete:', data);
  };

  const handleOpenFilter = () => {
    setIsFilterModalOpen(true);
  };

  const handleCloseFilter = () => {
    setIsFilterModalOpen(false);
  };

  const handleApplyFilter = (filters: ActivityFilters) => {
    // TODO: Implement filter logic
    console.log('Apply filters:', filters);
  };

  const handleClearFilter = () => {
    // TODO: Implement clear filter logic
    console.log('Clear filters');
  };

  const columns = createActivityColumns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  const state = {
    columns,
    activities,
    error,
    isLoading,
    searchQuery,
    page,
    isFilterModalOpen,
  };

  const action = {
    handleAddNew,
    handleView,
    handleEdit,
    handleDelete,
    setSearchQuery,
    handleOpenFilter,
    handleCloseFilter,
    handleApplyFilter,
    handleClearFilter,
  };

  return { state, action };
};
