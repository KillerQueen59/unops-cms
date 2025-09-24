import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { VillageData } from '@/types/village';

interface VillageOption {
  label: string;
  value: string;
}

interface GlobalState {
  // Village options for dropdowns
  villageOptions: VillageOption[];
  villages: VillageData[];
  isVillagesLoaded: boolean;
  villagesLastFetch: number | null;

  // Loading states
  isLoadingVillages: boolean;

  // Actions
  setVillages: (villages: VillageData[]) => void;
  setVillageOptions: (options: VillageOption[]) => void;
  setIsLoadingVillages: (isLoading: boolean) => void;

  // Utility methods
  getVillageByCode: (villageCode: string) => VillageData | undefined;
  getVillageById: (villageId: string) => VillageData | undefined;
  refreshVillages: () => void;

  // Check if villages need refresh (older than 5 minutes)
  shouldRefreshVillages: () => boolean;
}

const VILLAGES_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const initialState = {
  villageOptions: [],
  villages: [],
  isVillagesLoaded: false,
  villagesLastFetch: null,
  isLoadingVillages: false,
};

export const useGlobalStore = create<GlobalState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setVillages: (villages) => {
          const villageOptions = villages.map((village) => ({
            label: village.villageName,
            value: village.villageCode,
          }));

          set(
            {
              villages,
              villageOptions,
              isVillagesLoaded: true,
              villagesLastFetch: Date.now(),
              isLoadingVillages: false,
            },
            false,
            'setVillages'
          );
        },

        setVillageOptions: (options) =>
          set({ villageOptions: options }, false, 'setVillageOptions'),

        setIsLoadingVillages: (isLoading) =>
          set({ isLoadingVillages: isLoading }, false, 'setIsLoadingVillages'),

        getVillageByCode: (villageCode) => {
          const { villages } = get();
          return villages.find(
            (village) => village.villageCode === villageCode
          );
        },

        getVillageById: (villageId) => {
          const { villages } = get();
          return villages.find((village) => village.id === villageId);
        },

        refreshVillages: () => {
          set(
            {
              villages: [],
              villageOptions: [],
              isVillagesLoaded: false,
              villagesLastFetch: null,
            },
            false,
            'refreshVillages'
          );
        },

        shouldRefreshVillages: () => {
          const { villagesLastFetch, isVillagesLoaded } = get();
          if (!isVillagesLoaded || !villagesLastFetch) {
            return true;
          }
          return Date.now() - villagesLastFetch > VILLAGES_CACHE_DURATION;
        },
      }),
      {
        name: 'global-store', // unique name for localStorage
        partialize: (state) => ({
          villages: state.villages,
          villageOptions: state.villageOptions,
          isVillagesLoaded: state.isVillagesLoaded,
          villagesLastFetch: state.villagesLastFetch,
        }),
      }
    ),
    {
      name: 'global-store',
    }
  )
);
