import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  globalConfigService,
  ConfigItem,
  ConfigKeys,
} from '@/services/globalConfigService';
import toast from 'react-hot-toast';

// Query Keys
export const globalConfigKeys = {
  all: ['global-configs'] as const,
  lists: () => [...globalConfigKeys.all, 'list'] as const,
  details: () => [...globalConfigKeys.all, 'detail'] as const,
  detail: (key: string) => [...globalConfigKeys.details(), key] as const,
} as const;

/**
 * Hook to fetch all global configuration items
 */
export const useGlobalConfigs = () => {
  return useQuery({
    queryKey: globalConfigKeys.lists(),
    queryFn: async (): Promise<ConfigItem[]> => {
      try {
        const result = await globalConfigService.getAllConfigs();
        return result;
      } catch (error) {
        toast.error('Failed to fetch global configurations');
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Hook to fetch a specific global configuration by key
 */
export const useGlobalConfig = (
  key: string,
  options?: { enabled?: boolean }
) => {
  const enabled = options?.enabled ?? true;

  return useQuery({
    queryKey: globalConfigKeys.detail(key),
    queryFn: () => globalConfigService.getConfigByKey(key),
    enabled: enabled && !!key,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to update a single global configuration
 */
export const useUpdateGlobalConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      key,
      value,
    }: {
      key: string;
      value: string | number | string[];
    }) => globalConfigService.updateConfig(key, value),
    onSuccess: (updatedConfig) => {
      // Invalidate the all configs list to refresh it
      queryClient.invalidateQueries({
        queryKey: globalConfigKeys.lists(),
      });

      toast.success(`updated successfully`);
    },
    onError: (error, variables) => {
      console.error(`Failed to update config ${variables.key}:`, error);
      toast.error(`Failed to update ${variables.key}`);
    },
  });
};

/**
 * Hook specifically for assessment threshold
 */
export const useAssessmentThreshold = () => {
  return useGlobalConfig(ConfigKeys.ASSESSMENT_THRESHOLD);
};

/**
 * Hook specifically for training livelihood
 */
export const useTrainingLivelihood = () => {
  return useGlobalConfig(ConfigKeys.TRAINING_LIVELIHOOD);
};

/**
 * Hook specifically for training adaptation mitigation
 */
export const useTrainingAdaptationMitigation = () => {
  return useGlobalConfig(ConfigKeys.TRAINING_ADAPTATION_MITIGATION);
};

/**
 * Utility hook that provides all config-specific hooks
 */
export const useAllSpecificConfigs = () => {
  const assessmentThreshold = useAssessmentThreshold();
  const trainingLivelihood = useTrainingLivelihood();
  const trainingAdaptationMitigation = useTrainingAdaptationMitigation();

  return {
    assessmentThreshold,
    trainingLivelihood,
    trainingAdaptationMitigation,
    isLoading:
      assessmentThreshold.isLoading ||
      trainingLivelihood.isLoading ||
      trainingAdaptationMitigation.isLoading,
    isError:
      assessmentThreshold.isError ||
      trainingLivelihood.isError ||
      trainingAdaptationMitigation.isError,
  };
};
