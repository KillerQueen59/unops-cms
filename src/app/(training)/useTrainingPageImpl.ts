import { useTrainings } from '@/hooks/useTrainingData';
import { useTrainingStore } from '@/stores';
import { TrainingData } from '@/types/training';
import { useEffect, useMemo } from 'react';
import { createTrainingColumns } from './TrainingColumn';
import { PageEnum } from '@/constants/page';

export const useTrainingPageImpl = () => {
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
    resetTraining,
    setIsFilterModalOpen,
  } = useTrainingStore();

  const apiFilters = useMemo(
    () => ({
      searchQuery,
      trainingType: filters.trainingType,
      village: filters.village,
      startDate: filters.startDate,
      endDate: filters.endDate,
      // Add pagination if needed
      // page: currentPage,
      // pageSize: itemsPerPage,
    }),
    [searchQuery, filters]
  );

  const { data: trainings = [], isLoading, error } = useTrainings(apiFilters);

  useEffect(() => {
    if (page === PageEnum.LIST) {
      updateBreadcrumbs(PageEnum.LIST);
    }
  }, [page, updateBreadcrumbs]);

  const handleView = (data: TrainingData) => {
    navigateToDetail(data);
  };

  const handleEdit = (data: TrainingData) => {
    navigateToEdit(data);
  };

  const handleAddNew = () => {
    resetTraining();
    setPage(PageEnum.ADD);
    updateBreadcrumbs(PageEnum.ADD);
  };

  const handleDelete = (data: TrainingData) => {
    console.log('Delete:', data);
  };

  const handleOpenFilter = () => {
    setIsFilterModalOpen(true);
  };

  const handleCloseFilter = () => {
    setIsFilterModalOpen(false);
  };

  const columns = createTrainingColumns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  const state = {
    columns,
    trainings,
    error,
    isLoading,
    searchQuery,
    page,
    filters,
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
  };

  return { state, action };
};
