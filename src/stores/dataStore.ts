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
}

interface DataActions {
  setSearchQuery: (query: string) => void;
  setPage: (page: DataPageEnum) => void;
  setSelectedData: (data: DataFile | null) => void;
  openUploadModal: () => void;
  closeUploadModal: () => void;
  openPreviewModal: (file: DataFile) => void;
  closePreviewModal: () => void;
  resetData: () => void;
}

export const useDataStore = create<DataState & DataActions>((set) => ({
  // State
  searchQuery: '',
  page: DataPageEnum.LIST,
  selectedData: null,
  isUploadModalOpen: false,
  isPreviewModalOpen: false,
  previewFile: null,

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
  resetData: () =>
    set({
      selectedData: null,
      searchQuery: '',
      isUploadModalOpen: false,
      isPreviewModalOpen: false,
      previewFile: null,
    }),
}));
