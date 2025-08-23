import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { TrainingData } from '@/types/training';

export enum TrainingPageEnum {
  ADD,
  LIST,
  DETAIL,
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
  onClick?: () => void;
}

interface TrainingState {
  // Training list state
  trainings: TrainingData[];
  selectedTraining: TrainingData | null;
  isLoading: boolean;
  error: string | null;
  page: TrainingPageEnum;

  // Breadcrumb state
  breadcrumbs: BreadcrumbItem[];

  // Filter and search state
  searchQuery: string;
  currentPage: number;
  itemsPerPage: number;

  // Actions
  setPage: (page: TrainingPageEnum) => void;

  // Navigation actions
  navigateToDetail: (training: TrainingData) => void;
  navigateToEdit: (training: TrainingData) => void;

  // Breadcrumb actions
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
  updateBreadcrumbs: (page: TrainingPageEnum, trainingName?: string) => void;

  // Filter actions
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;

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
  page: TrainingPageEnum.LIST,
  breadcrumbs: [] as BreadcrumbItem[],
};

export const useTrainingStore = create<TrainingState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Filter actions
      setSearchQuery: (query) =>
        set({ searchQuery: query, currentPage: 1 }, false, 'setSearchQuery'),

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
              setPage(TrainingPageEnum.LIST);
            },
          },
        ];

        switch (page) {
          case TrainingPageEnum.LIST:
            newBreadcrumbs.push({
              label: 'Training List',
              isActive: true,
            });
            break;
          case TrainingPageEnum.ADD:
            newBreadcrumbs.push({
              label: 'Add Training',
              isActive: true,
            });
            break;
          case TrainingPageEnum.DETAIL:
            newBreadcrumbs.push({
              label: trainingName || 'Training Detail',
              isActive: true,
            });
            break;
        }

        set({ breadcrumbs: newBreadcrumbs, page }, false, 'updateBreadcrumbs');
      },

      // Modal actions

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
          { selectedTraining: training, page: TrainingPageEnum.DETAIL },
          false,
          'navigateToDetail'
        );
        updateBreadcrumbs(TrainingPageEnum.DETAIL, training.trainingName);
      },

      navigateToEdit: (training) => {
        const { updateBreadcrumbs } = get();
        set(
          { selectedTraining: training, page: TrainingPageEnum.ADD },
          false,
          'navigateToEdit'
        );
        updateBreadcrumbs(TrainingPageEnum.ADD);
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
