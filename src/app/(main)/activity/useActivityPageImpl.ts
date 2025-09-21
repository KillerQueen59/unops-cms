'use client';

import { useEffect, useState } from 'react';
import { createActivityColumns } from './ActivityColumn';
import { ActivityPageEnum, useActivityStore } from '@/stores/activityStore';
import {
  useActivities,
  useDeleteActivity,
  useActivity,
} from '@/hooks/useActivityData';
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

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<ActivityData | null>(
    null
  );
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
    null
  );

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isEdit, setIsEdit] = useState(false);

  // Use pagination parameters
  const {
    data: activitiesResponse,
    isLoading,
    error,
  } = useActivities({
    page: currentPage,
    pageSize: pageSize,
    search: searchQuery,
  });

  // Extract activities and pagination info from response
  const activities = activitiesResponse?.data || [];
  const totalItems = activitiesResponse?.totalData || 0;
  const totalPages = activitiesResponse?.totalPages || 0;

  // Only fetch activity detail when an activity is selected
  const { data: activityDetail, isLoading: isLoadingActivity } = useActivity(
    selectedActivityId,
    {
      enabled: !!selectedActivityId,
    }
  );

  const deleteActivityMutation = useDeleteActivity();

  // Ensure activities is always an array
  const safeActivities = Array.isArray(activities) ? activities : [];

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
    if (page === ActivityPageEnum.LIST) {
      updateBreadcrumbs(ActivityPageEnum.LIST);
    }
  }, [page, updateBreadcrumbs]);

  useEffect(() => {
    if (activityDetail && selectedActivityId && !isLoadingActivity) {
      if (isEdit) {
        navigateToEdit(activityDetail);
      } else {
        navigateToDetail(activityDetail);
      }

      setSelectedActivityId(null);
      setIsEdit(false);
    }
  }, [
    activityDetail,
    selectedActivityId,
    isLoadingActivity,
    navigateToDetail,
    isEdit,
    navigateToEdit,
  ]);

  const handleView = (data: ActivityData) => {
    setSelectedActivityId(data.id);
  };

  const handleEdit = (data: ActivityData) => {
    setIsEdit(true);
    setSelectedActivityId(data.id);
  };

  const handleAddNew = () => {
    resetActivity();
    setPage(ActivityPageEnum.ADD);
    updateBreadcrumbs(ActivityPageEnum.ADD);
  };

  const handleDelete = (data: ActivityData) => {
    setActivityToDelete(data);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (activityToDelete) {
      try {
        await deleteActivityMutation.mutateAsync(activityToDelete.id);
        setShowDeleteModal(false);
        setActivityToDelete(null);
      } catch (error) {
        console.error('Failed to delete activity:', error);
        // Error handling is done in the mutation hook with toast
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setActivityToDelete(null);
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
    activities: safeActivities,
    error,
    isLoading,
    searchQuery,
    page,
    isFilterModalOpen,
    showDeleteModal,
    activityToDelete,
    isDeleting: deleteActivityMutation.isPending,
    isLoadingActivity, // Add this to show loading state during detail fetch
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
    handleOpenFilter,
    handleCloseFilter,
    handleApplyFilter,
    handleClearFilter,
    // Pagination actions
    handlePageChange,
    handlePageSizeChange,
  };

  return { state, action };
};
