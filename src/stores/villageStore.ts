import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { VillageData } from '@/types/village';

export enum VillagePageEnum {
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

interface VillageState {
  // Village list state
  villages: VillageData[];
  selectedVillage: VillageData | null;
  isLoading: boolean;
  error: string | null;
  page: VillagePageEnum;

  // Breadcrumb state
  breadcrumbs: BreadcrumbItem[];

  // Filter and search state
  searchQuery: string;
  currentPage: number;
  itemsPerPage: number;

  // Actions
  setPage: (page: VillagePageEnum) => void;

  // Navigation actions
  navigateToDetail: (training: VillageData) => void;
  navigateToEdit: (training: VillageData) => void;

  // Breadcrumb actions
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
  updateBreadcrumbs: (page: VillagePageEnum, villageName?: string) => void;

  // Filter actions
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;

  // Village CRUD actions
  addVillage: (village: VillageData) => void;
  updateVillage: (id: string, village: Partial<VillageData>) => void;
  deleteVillage: (id: string) => void;

  // Reset function
  reset: () => void;
  resetVillage: () => void;
}

const initialState = {
  villages: [],
  selectedVillage: null,
  isLoading: false,
  error: null,
  searchQuery: '',
  statusFilter: 'all',
  currentPage: 1,
  itemsPerPage: 10,
  isAddModalOpen: false,
  isEditModalOpen: false,
  isDeleteModalOpen: false,
  page: VillagePageEnum.LIST,
  breadcrumbs: [] as BreadcrumbItem[],
};

export const useVillageStore = create<VillageState>()(
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

      updateBreadcrumbs: (page, villageName) => {
        const { setPage } = get();
        const newBreadcrumbs: BreadcrumbItem[] = [
          {
            label: 'Village',
            href: '/village',
            onClick: () => {
              setPage(VillagePageEnum.LIST);
            },
          },
        ];

        switch (page) {
          case VillagePageEnum.LIST:
            newBreadcrumbs.push({
              label: 'Village List',
              isActive: true,
            });
            break;
          case VillagePageEnum.ADD:
            newBreadcrumbs.push({
              label: 'Add Village',
              isActive: true,
            });
            break;
          case VillagePageEnum.DETAIL:
            newBreadcrumbs.push({
              label: villageName || 'Village Detail',
              isActive: true,
            });
            break;
        }

        set({ breadcrumbs: newBreadcrumbs, page }, false, 'updateBreadcrumbs');
      },

      // CRUD operations
      addVillage: (village) => {
        const { villages } = get();
        set({ villages: [...villages, village] }, false, 'addVillage');
      },

      updateVillage: (id, updatedVillage) => {
        const { villages } = get();
        const updatedVillages = villages.map((village) =>
          village.id === id ? { ...village, ...updatedVillage } : village
        );
        set({ villages: updatedVillages }, false, 'updateVillage');
      },

      deleteVillage: (id) => {
        const { villages } = get();
        const filteredVillages = villages.filter(
          (village) => village.id !== id
        );
        set({ villages: filteredVillages }, false, 'deleteVillage');
      },

      // Navigation actions
      navigateToDetail: (village) => {
        const { updateBreadcrumbs } = get();
        set(
          { selectedVillage: village, page: VillagePageEnum.DETAIL },
          false,
          'navigateToDetail'
        );
        updateBreadcrumbs(VillagePageEnum.DETAIL, village.villageName);
      },

      navigateToEdit: (village) => {
        const { updateBreadcrumbs } = get();
        set(
          { selectedVillage: village, page: VillagePageEnum.ADD },
          false,
          'navigateToEdit'
        );
        updateBreadcrumbs(VillagePageEnum.ADD);
      },

      reset: () => set(initialState, false, 'reset'),
      resetVillage: () => set({ selectedVillage: null }, false, 'resetVillage'),
    }),
    {
      name: 'village-store',
    }
  )
);
