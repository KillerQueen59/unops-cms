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
    setSearchQuery,
    updateBreadcrumbs,
    setPage,
    navigateToDetail,
    navigateToEdit,
    resetTraining,
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
