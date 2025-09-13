import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { TrainingData } from '@/types/training';
import { PageEnum } from '@/constants/page';
import { BreadcrumbItem } from '@/types/common';

export interface TrainingState {
  // Training list state
  trainings: TrainingData[];
  selectedTraining: TrainingData | null;
  isLoading: boolean;
  error: string | null;
  page: PageEnum;

  // Breadcrumb state
  breadcrumbs: BreadcrumbItem[];

  // Filter and search state
  searchQuery: string;
  currentPage: number;
  itemsPerPage: number;
  isFilterModalOpen: boolean;
  filters: {
    trainingType: string;
    village: string;
    startDate: string;
    endDate: string;
  };

  // Actions
  setPage: (page: PageEnum) => void;

  // Navigation actions
  navigateToDetail: (training: TrainingData) => void;
  navigateToEdit: (training: TrainingData) => void;

  // Breadcrumb actions
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
  updateBreadcrumbs: (page: PageEnum, trainingName?: string) => void;

  // Filter actions
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  setIsFilterModalOpen: (open: boolean) => void;
  setFilters: (filters: Partial<TrainingState['filters']>) => void;
  clearFilters: () => void;

  // Training CRUD actions
  addTraining: (training: TrainingData) => void;
  updateTraining: (id: string, training: Partial<TrainingData>) => void;
  deleteTraining: (id: string) => void;

  // Reset function
  reset: () => void;
  resetTraining: () => void;
}

const initialState = {
  trainings: [],
  selectedTraining: null,
  isLoading: false,
  error: null,
  searchQuery: '',
  statusFilter: 'all',
  currentPage: 1,
  itemsPerPage: 10,
  isAddModalOpen: false,
  isEditModalOpen: false,
  isDeleteModalOpen: false,
  page: PageEnum.LIST,
  breadcrumbs: [] as BreadcrumbItem[],
  isFilterModalOpen: false,
  filters: {
    trainingType: '',
    village: '',
    startDate: '',
    endDate: '',
  },
};

export const useTrainingStore = create<TrainingState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Filter actions
      setSearchQuery: (query) =>
        set({ searchQuery: query, currentPage: 1 }, false, 'setSearchQuery'),

      setCurrentPage: (page) =>
        set({ currentPage: page }, false, 'setCurrentPage'),

      setItemsPerPage: (items) =>
        set({ itemsPerPage: items }, false, 'setItemsPerPage'),

      setIsFilterModalOpen: (open) =>
        set({ isFilterModalOpen: open }, false, 'setIsFilterModalOpen'),

      setFilters: (newFilters) => {
        const { filters } = get();
        set(
          { filters: { ...filters, ...newFilters }, currentPage: 1 },
          false,
          'setFilters'
        );
      },

      clearFilters: () =>
        set(
          {
            filters: {
              trainingType: '',
              village: '',
              startDate: '',
              endDate: '',
            },
            currentPage: 1,
          },
          false,
          'clearFilters'
        ),

      setPage: (page) => set({ page }, false, 'setPage'),

      // Breadcrumb actions
      setBreadcrumbs: (breadcrumbs) =>
        set({ breadcrumbs }, false, 'setBreadcrumbs'),

      updateBreadcrumbs: (page, trainingName) => {
        const { setPage } = get();
        const newBreadcrumbs: BreadcrumbItem[] = [
          {
            label: 'Training',
            href: '/training',
            onClick: () => {
              setPage(PageEnum.LIST);
            },
          },
        ];

        switch (page) {
          case PageEnum.LIST:
            newBreadcrumbs.push({
              label: 'Training List',
              isActive: true,
            });
            break;
          case PageEnum.ADD:
            newBreadcrumbs.push({
              label: 'Add Training',
              isActive: true,
            });
            break;
          case PageEnum.DETAIL:
            newBreadcrumbs.push({
              label: trainingName || 'Training Detail',
              isActive: true,
            });
            break;
        }

        set({ breadcrumbs: newBreadcrumbs, page }, false, 'updateBreadcrumbs');
      },

      // CRUD operations
      addTraining: (training) => {
        const { trainings } = get();
        set({ trainings: [...trainings, training] }, false, 'addTraining');
      },

      updateTraining: (id, updatedTraining) => {
        const { trainings } = get();
        const updatedTrainings = trainings.map((training) =>
          training.id === id ? { ...training, ...updatedTraining } : training
        );
        set({ trainings: updatedTrainings }, false, 'updateTraining');
      },

      deleteTraining: (id) => {
        const { trainings } = get();
        const filteredTrainings = trainings.filter(
          (training) => training.id !== id
        );
        set({ trainings: filteredTrainings }, false, 'deleteTraining');
      },

      // Navigation actions
      navigateToDetail: (training) => {
        const { updateBreadcrumbs } = get();
        set(
          { selectedTraining: training, page: PageEnum.DETAIL },
          false,
          'navigateToDetail'
        );
        updateBreadcrumbs(PageEnum.DETAIL, training.trainingName);
      },

      navigateToEdit: (training) => {
        const { updateBreadcrumbs } = get();
        set(
          { selectedTraining: training, page: PageEnum.ADD },
          false,
          'navigateToEdit'
        );
        updateBreadcrumbs(PageEnum.ADD);
      },

      reset: () => set(initialState, false, 'reset'),
      resetTraining: () =>
        set({ selectedTraining: null }, false, 'resetTraining'),
    }),
    {
      name: 'training-store',
    }
  )
);
