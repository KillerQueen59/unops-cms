import { useTrainings } from '@/hooks/useTrainingData';
import { useTrainingStore } from '@/stores';
import { TrainingPageEnum } from '@/stores/trainingStore';
import { TrainingData } from '@/types/training';
import { useEffect } from 'react';
import { createTrainingColumns } from './TrainingColumn';

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

  const { data: trainings = [], isLoading, error } = useTrainings();

  useEffect(() => {
    if (page === TrainingPageEnum.LIST) {
      updateBreadcrumbs(TrainingPageEnum.LIST);
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
    setPage(TrainingPageEnum.ADD);
    updateBreadcrumbs(TrainingPageEnum.ADD);
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

  // Filter trainings based on search query and filters
  const filteredTrainings = trainings.filter((training) => {
    // Search query filter
    const matchesSearch =
      !searchQuery ||
      training.trainingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      training.trainingType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      training.village.toLowerCase().includes(searchQuery.toLowerCase());

    // Training type filter
    const matchesTrainingType =
      !filters.trainingType || training.trainingType === filters.trainingType;

    // Village filter
    const matchesVillage =
      !filters.village || training.village === filters.village;

    // Start date filter
    const matchesStartDate =
      !filters.startDate ||
      new Date(training.startDate) >= new Date(filters.startDate);

    // End date filter
    const matchesEndDate =
      !filters.endDate ||
      new Date(training.startDate) <= new Date(filters.endDate);

    return (
      matchesSearch &&
      matchesTrainingType &&
      matchesVillage &&
      matchesStartDate &&
      matchesEndDate
    );
  });

  // Get unique training types and villages for filter options
  const uniqueTrainingTypes = Array.from(
    new Set(trainings.map((t) => t.trainingType))
  );
  const uniqueVillages = Array.from(new Set(trainings.map((t) => t.village)));

  const columns = createTrainingColumns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  const state = {
    columns,
    trainings: filteredTrainings,
    error,
    isLoading,
    searchQuery,
    page,
    filters,
    isFilterModalOpen,
    uniqueTrainingTypes,
    uniqueVillages,
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
