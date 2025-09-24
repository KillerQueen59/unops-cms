import { create } from 'zustand';
import { DataFile } from '@/types/data';

export enum DataPageEnum {
  LIST = 'list',
}

interface DataState {
  searchQuery: string;
  page: DataPageEnum;
  selectedData: DataFile | null;
  isUploadModalOpen: boolean;
  isPreviewModalOpen: boolean;
  previewFile: DataFile | null;
  groupBy: 'regency' | 'other';
  isGrouped: boolean;
  isFilterModalOpen: boolean;
  filters: {
    area: string;
  };
}

interface DataActions {
  setSearchQuery: (query: string) => void;
  setPage: (page: DataPageEnum) => void;
  setSelectedData: (data: DataFile | null) => void;
  openUploadModal: () => void;
  closeUploadModal: () => void;
  openPreviewModal: (file: DataFile) => void;
  closePreviewModal: () => void;
  setGroupBy: (groupBy: 'regency' | 'other') => void;
  setIsGrouped: (isGrouped: boolean) => void;
  resetData: () => void;
  setIsFilterModalOpen: (isOpen: boolean) => void;
  setFilters: (filters: Partial<DataState['filters']>) => void;
  clearFilters: () => void;
  removeFilter: (filterKey: keyof DataState['filters']) => void;
}

export const useDataStore = create<DataState & DataActions>((set) => ({
  // State
  searchQuery: '',
  page: DataPageEnum.LIST,
  selectedData: null,
  isUploadModalOpen: false,
  isPreviewModalOpen: false,
  previewFile: null,
  groupBy: 'regency',
  isGrouped: true,
  isFilterModalOpen: false,
  filters: {
    area: '',
  },

  // Actions
  setSearchQuery: (query) => set({ searchQuery: query }),
  setPage: (page) => set({ page }),
  setSelectedData: (data) => set({ selectedData: data }),
  openUploadModal: () => set({ isUploadModalOpen: true }),
  closeUploadModal: () => set({ isUploadModalOpen: false }),
  openPreviewModal: (file) =>
    set({ isPreviewModalOpen: true, previewFile: file }),
  closePreviewModal: () =>
    set({ isPreviewModalOpen: false, previewFile: null }),
  setGroupBy: (groupBy) => set({ groupBy }),
  setIsGrouped: (isGrouped) => set({ isGrouped }),
  resetData: () =>
    set({
      selectedData: null,
      searchQuery: '',
      isUploadModalOpen: false,
      isPreviewModalOpen: false,
      previewFile: null,
    }),
  setIsFilterModalOpen: (isOpen: boolean) => set({ isFilterModalOpen: isOpen }),
  setFilters: (filters: Partial<DataState['filters']>) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...filters,
        area: filters.area ?? state.filters.area,
      },
    })),
  clearFilters: () => set({ filters: { area: '' } }),
  removeFilter: (filterKey: keyof DataState['filters']) => {
    set((state) => ({
      filters: {
        ...state.filters,
        [filterKey]: '',
      },
    }));
  },
}));
