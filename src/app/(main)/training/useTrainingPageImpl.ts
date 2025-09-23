import { useTrainingStore } from '@/stores/trainingStore';
import { useEffect, useState, useMemo } from 'react';
import { TrainingData } from '@/types/training';
import {
  useTrainings,
  useDeleteTraining,
  useTraining,
} from '@/hooks/useTrainingData';
import { createTrainingColumns } from './TrainingColumn';
import { PageEnum } from '@/constants/page';
import {
  useAssessmentThreshold,
  useTrainingAdaptationMitigation,
  useTrainingLivelihood,
} from '@/hooks/useGlobalConfigData';
import { TrainingType } from './constants';

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

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [trainingToDelete, setTrainingToDelete] = useState<TrainingData | null>(
    null
  );
  const [selectedTrainingId, setSelectedTrainingId] = useState<string | null>(
    null
  );

  const trainingAdaptationMitigation = useTrainingAdaptationMitigation();
  const trainingLivelihood = useTrainingLivelihood();
  const trainingAssessmentThreshold = useAssessmentThreshold();

  const trainingOptions = useMemo(() => {
    const options: { label: string; value: string; category: string }[] = [];

    if (trainingLivelihood?.data?.value) {
      (trainingLivelihood.data.value as string[]).forEach((item: string) => {
        options.push({
          label: item.trim(),
          value: item.trim(),
          category: TrainingType.Livelihood,
        });
      });
    }
    if (trainingAdaptationMitigation?.data?.value) {
      (trainingAdaptationMitigation.data.value as string[]).forEach(
        (item: string) => {
          options.push({
            label: item.trim(),
            value: item.trim(),
            category: TrainingType.AdaptationMitigation,
          });
        }
      );
    }
    return options;
  }, [trainingLivelihood.data, trainingAdaptationMitigation.data]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isEdit, setIsEdit] = useState(false);

  const apiFilters = useMemo(
    () => ({
      searchQuery,
      trainingType: filters.trainingType,
      village: filters.village,
      startDate: filters.startDate,
      endDate: filters.endDate,
    }),
    [searchQuery, filters]
  );

  // Use pagination parameters
  const {
    data: trainingsResponse,
    isLoading,
    error,
  } = useTrainings(apiFilters);

  // Extract trainings and pagination info from response
  const trainings = trainingsResponse?.data || [];
  const totalItems = trainingsResponse?.totalData || 0;
  const totalPages = trainingsResponse?.totalPages || 0;

  // Only fetch training detail when a training is selected
  const { data: trainingDetail, isLoading: isLoadingTraining } = useTraining(
    selectedTrainingId,
    {
      enabled: !!selectedTrainingId,
    }
  );

  const deleteTrainingMutation = useDeleteTraining();

  // Ensure trainings is always an array
  const safeTrainings = Array.isArray(trainings) ? trainings : [];

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
    if (page === PageEnum.LIST) {
      updateBreadcrumbs(PageEnum.LIST);
    }
  }, [page, updateBreadcrumbs]);

  useEffect(() => {
    if (trainingDetail && selectedTrainingId && !isLoadingTraining) {
      if (isEdit) {
        navigateToEdit(trainingDetail);
      } else {
        navigateToDetail(trainingDetail);
      }

      setSelectedTrainingId(null);
      setIsEdit(false);
    }
  }, [
    trainingDetail,
    selectedTrainingId,
    isLoadingTraining,
    navigateToDetail,
    isEdit,
    navigateToEdit,
  ]);

  const handleView = (data: TrainingData) => {
    setSelectedTrainingId(data.id);
  };

  const handleEdit = (data: TrainingData) => {
    setIsEdit(true);
    setSelectedTrainingId(data.id);
  };

  const handleAddNew = () => {
    resetTraining();
    setPage(PageEnum.ADD);
    updateBreadcrumbs(PageEnum.ADD);
  };

  const handleDelete = (data: TrainingData) => {
    setTrainingToDelete(data);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (trainingToDelete) {
      try {
        await deleteTrainingMutation.mutateAsync(trainingToDelete.id);
        setShowDeleteModal(false);
        setTrainingToDelete(null);
      } catch (error) {
        console.error('Failed to delete training:', error);
        // Handle error (could show toast or alert)
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setTrainingToDelete(null);
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
    trainings: safeTrainings,
    error,
    isLoading,
    searchQuery,
    page,
    showDeleteModal,
    trainingToDelete,
    isDeleting: deleteTrainingMutation.isPending,
    isLoadingTraining, // Add this to show loading state during detail fetch
    // Pagination state
    totalItems,
    totalPages,
    currentPage,
    pageSize,
    isFilterModalOpen,
    trainingOptions,
    trainingAssessmentThreshold: trainingAssessmentThreshold.data?.value || 0,
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
    handleOpenFilter,
    handleCloseFilter,
  };

  return { state, action };
};
