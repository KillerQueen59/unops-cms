import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { DemositeData } from '@/types/demosite';

export enum DemositePageEnum {
  ADD,
  LIST,
  DETAIL,
  EDIT,
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
  onClick?: () => void;
}

interface DemositeState {
  // Demosite list state
  demosites: DemositeData[];
  selectedDemosite: DemositeData | null;
  isLoading: boolean;
  error: string | null;
  page: DemositePageEnum;

  // Breadcrumb state
  breadcrumbs: BreadcrumbItem[];

  // Filter and search state
  searchQuery: string;
  currentPage: number;
  itemsPerPage: number;
  isFilterModalOpen: boolean;
  filters: {
    type: string;
  };

  // Actions
  setPage: (page: DemositePageEnum) => void;

  // Navigation actions
  navigateToDetail: (demosite: DemositeData) => void;
  navigateToEdit: (demosite: DemositeData) => void;

  // Breadcrumb actions
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
  updateBreadcrumbs: (page: DemositePageEnum, demositeName?: string) => void;

  // Filter actions
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  setIsFilterModalOpen: (isOpen: boolean) => void;
  setFilters: (filters: Partial<DemositeState['filters']>) => void;
  clearFilters: () => void;
  removeFilter: (filterKey: keyof DemositeState['filters']) => void;

  // Demosite CRUD actions
  addDemosite: (demosite: DemositeData) => void;
  updateDemosite: (id: string, demosite: Partial<DemositeData>) => void;
  deleteDemosite: (id: string) => void;

  // Reset function
  reset: () => void;
  resetDemosite: () => void;
}

const initialState = {
  demosites: [],
  selectedDemosite: null,
  isLoading: false,
  error: null,
  searchQuery: '',
  statusFilter: 'all',
  currentPage: 1,
  itemsPerPage: 12,
  isAddModalOpen: false,
  isEditModalOpen: false,
  isDeleteModalOpen: false,
  page: DemositePageEnum.LIST,
  breadcrumbs: [] as BreadcrumbItem[],
  filters: {
    type: '',
  },
};

export const useDemositeStore = create<DemositeState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Filter actions
      setSearchQuery: (query) =>
        set({ searchQuery: query, currentPage: 1 }, false, 'setSearchQuery'),

      setCurrentPage: (page) =>
        set({ currentPage: page }, false, 'setCurrentPage'),

      setItemsPerPage: (items) =>
        set({ itemsPerPage: items, currentPage: 1 }, false, 'setItemsPerPage'),

      setPage: (page) => set({ page }, false, 'setPage'),

      setIsFilterModalOpen: (isOpen) =>
        set({ isFilterModalOpen: isOpen }, false, 'setIsFilterModalOpen'),

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
              type: '',
            },
            currentPage: 1,
          },
          false,
          'clearFilters'
        ),

      removeFilter: (filterKey) => {
        const { filters } = get();
        set(
          {
            filters: { ...filters, [filterKey]: '' },
            currentPage: 1,
          },
          false,
          'removeFilter'
        );
      },

      // Breadcrumb actions
      setBreadcrumbs: (breadcrumbs) =>
        set({ breadcrumbs }, false, 'setBreadcrumbs'),

      updateBreadcrumbs: (page, demositeName) => {
        const { setPage } = get();
        const newBreadcrumbs: BreadcrumbItem[] = [
          {
            label: 'Demosite',
            href: '/demosite',
            onClick: () => {
              setPage(DemositePageEnum.LIST);
            },
          },
        ];

        switch (page) {
          case DemositePageEnum.LIST:
            newBreadcrumbs.push({
              label: 'Demosite List',
              isActive: true,
            });
            break;
          case DemositePageEnum.ADD:
            newBreadcrumbs.push({
              label: 'Add Demosite',
              isActive: true,
            });
            break;
          case DemositePageEnum.EDIT:
            newBreadcrumbs.push({
              label: `Edit ${demositeName || 'Demosite'}`,
              isActive: true,
            });
            break;
          case DemositePageEnum.DETAIL:
            newBreadcrumbs.push({
              label: demositeName || 'Demosite Detail',
              isActive: true,
            });
            break;
        }

        set({ breadcrumbs: newBreadcrumbs, page }, false, 'updateBreadcrumbs');
      },

      // CRUD operations
      addDemosite: (demosite) => {
        const { demosites } = get();
        set({ demosites: [...demosites, demosite] }, false, 'addDemosite');
      },

      updateDemosite: (id, updatedDemosite) => {
        const { demosites } = get();
        const updatedDemosites = demosites.map((demosite) =>
          demosite.id === id ? { ...demosite, ...updatedDemosite } : demosite
        );
        set({ demosites: updatedDemosites }, false, 'updateDemosite');
      },

      deleteDemosite: (id) => {
        const { demosites } = get();
        const filteredDemosites = demosites.filter(
          (demosite) => demosite.id !== id
        );
        set({ demosites: filteredDemosites }, false, 'deleteDemosite');
      },

      // Navigation actions
      navigateToDetail: (demosite) => {
        const { updateBreadcrumbs } = get();
        set(
          { selectedDemosite: demosite, page: DemositePageEnum.DETAIL },
          false,
          'navigateToDetail'
        );
        updateBreadcrumbs(DemositePageEnum.DETAIL, demosite.name);
      },

      navigateToEdit: (demosite) => {
        const { updateBreadcrumbs } = get();
        set(
          { selectedDemosite: demosite, page: DemositePageEnum.EDIT },
          false,
          'navigateToEdit'
        );
        updateBreadcrumbs(DemositePageEnum.EDIT, demosite.name);
      },

      reset: () => set(initialState, false, 'reset'),
      resetDemosite: () =>
        set({ selectedDemosite: null }, false, 'resetDemosite'),
    }),
    {
      name: 'demosite-store',
    }
  )
);
