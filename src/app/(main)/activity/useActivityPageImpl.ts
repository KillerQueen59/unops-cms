'use client';

import { useEffect, useState, useMemo } from 'react';
import { createActivityColumns } from './ActivityColumn';
import { useActivityStore } from '@/stores/activityStore';
import {
  useActivities,
  useDeleteActivity,
  useActivity,
} from '@/hooks/useActivityData';
import { ActivityData } from '@/types/activity';
import toast from 'react-hot-toast';
import { PageEnum } from '@/constants/page';
import { useGlobalVillages } from '@/hooks/useGlobalVillages';

export const useActivityPageImpl = () => {
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

  const apiFilters = useMemo(
    () => ({
      page: currentPage,
      pageSize: pageSize,
      search: searchQuery,
      type: filters.type,
      village: filters.village,
      status: filters.status,
      startDate: filters.startDate,
      endDate: filters.endDate,
    }),
    [currentPage, pageSize, searchQuery, filters]
  );

  // Use pagination parameters with filters
  const {
    data: activitiesResponse,
    isLoading,
    error,
  } = useActivities(apiFilters);

  // fetch village options from global store
  const { villageOptions } = useGlobalVillages();

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

  // Reset page when search query or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (page === PageEnum.LIST) {
      updateBreadcrumbs(PageEnum.LIST);
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
    setPage(PageEnum.ADD);
    updateBreadcrumbs(PageEnum.ADD);
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
        toast.error('Failed to delete activity. Please try again.');
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

  const columns = createActivityColumns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete,
    villageOptions,
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
    // Filter options and current filters
    filters,
    villageOptions,
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
