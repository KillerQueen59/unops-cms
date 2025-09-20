import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { VillageData } from '@/types/village';
import { PageEnum } from '@/constants/page';
import { BreadcrumbItem } from '@/types/common';

interface VillageState {
  // Village list state
  villages: VillageData[];
  selectedVillage: VillageData | null;
  selectedCategory: string | null;
  isLoading: boolean;
  error: string | null;
  page: PageEnum;

  // Breadcrumb state
  breadcrumbs: BreadcrumbItem[];

  // Filter and search state
  searchQuery: string;
  currentPage: number;
  itemsPerPage: number;

  // Actions
  setPage: (page: PageEnum) => void;
  setSelectedCategory: (category: string) => void;

  // Navigation actions
  navigateToDetail: (village: VillageData) => void;
  navigateToEdit: (village: VillageData) => void;

  // Breadcrumb actions
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
  updateBreadcrumbs: (page: PageEnum, villageName?: string) => void;

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
  selectedCategory: null,
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
};

export const useVillageStore = create<VillageState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Filter actions
      setSearchQuery: (query) =>
        set({ searchQuery: query, currentPage: 1 }, false, 'setSearchQuery'),

      setPage: (page) => set({ page }, false, 'setPage'),

      setSelectedCategory: (category) =>
        set({ selectedCategory: category }, false, 'setSelectedCategory'),

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
              setPage(PageEnum.LIST);
            },
          },
        ];

        switch (page) {
          case PageEnum.LIST:
            newBreadcrumbs.push({
              label: 'Village List',
              isActive: true,
            });
            break;
          case PageEnum.ADD:
            newBreadcrumbs.push({
              label: villageName ? `Edit ${villageName}` : 'Add Village',
              isActive: true,
            });
            break;
          case PageEnum.DETAIL:
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
          { selectedVillage: village, page: PageEnum.DETAIL },
          false,
          'navigateToDetail'
        );
        updateBreadcrumbs(PageEnum.DETAIL, village.villageName);
      },

      navigateToEdit: (village) => {
        const { updateBreadcrumbs } = get();
        set(
          { selectedVillage: village, page: PageEnum.ADD },
          false,
          'navigateToEdit'
        );
        updateBreadcrumbs(PageEnum.ADD, village.villageName);
      },

      reset: () => set(initialState, false, 'reset'),
      resetVillage: () =>
        set(
          { selectedVillage: null, selectedCategory: null },
          false,
          'resetVillage'
        ),
    }),
    {
      name: 'village-store',
    }
  )
);
