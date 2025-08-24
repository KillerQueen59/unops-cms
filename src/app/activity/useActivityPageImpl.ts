import { useEffect } from 'react';
import { createActivityColumns } from './ActivityColumn';
import { ActivityPageEnum, useActivityStore } from '@/stores/activityStore';
import { useActivities } from '@/hooks/useActivityData';
import { ActivityData } from '@/types/activity';

export const useActivityPageImpl = () => {
  const {
    searchQuery,
    page,
    setSearchQuery,
    updateBreadcrumbs,
    setPage,
    navigateToDetail,
    navigateToEdit,
    resetActivity,
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
