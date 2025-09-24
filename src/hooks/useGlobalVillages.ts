import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useGlobalStore } from '@/stores/globalStore';
import { villageService } from '@/services/villageService';
import { PaginatedResponse } from '@/types/common';
import { VillageData } from '@/types/village';

/**
 * Hook to manage global villages data with persistence
 * This hook fetches villages once and stores them globally with persistence
 */
export const useGlobalVillages = () => {
  const {
    villageOptions,
    villages,
    isVillagesLoaded,
    isLoadingVillages,
    setVillages,
    setIsLoadingVillages,
    shouldRefreshVillages,
  } = useGlobalStore();

  // Only fetch if villages are not loaded or need refresh
  const shouldFetch = shouldRefreshVillages();
  const [forceFetch, setForceFetch] = useState(shouldFetch);

  const {
    data: villagesResponse,
    isLoading: isApiLoading,
    error,
  } = useQuery({
    queryKey: ['global-villages'],
    queryFn: async (): Promise<PaginatedResponse<VillageData>> => {
      return await villageService.getVillages();
    },
    enabled: shouldFetch || forceFetch,
    staleTime: 5 * 60 * 1000,
  });

  // Update global store when data is fetched
  useEffect(() => {
    if (villagesResponse?.data && Array.isArray(villagesResponse.data)) {
      setVillages(villagesResponse.data);
    }
  }, [villagesResponse, setVillages]);

  // Update loading state
  useEffect(() => {
    setIsLoadingVillages(isApiLoading && shouldFetch);
  }, [isApiLoading, shouldFetch, setIsLoadingVillages]);

  return {
    villageOptions,
    villages,
    isLoading: isLoadingVillages,
    error,
    isLoaded: isVillagesLoaded,
    setForceFetch,
  };
};
