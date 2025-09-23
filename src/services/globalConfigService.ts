import { apiClient } from '@/lib/api';

// Global Config API interfaces
export interface ConfigItem {
  key: string;
  value: string | number | string[];
  type: 'number' | 'array';
  label: string;
  description: string;
}

export interface UpdateConfigRequest {
  value: string | number;
}

export interface ConfigApiResponse {
  status: boolean;
  message: string;
  data: {
    value: string | number;
  };
}

export interface AllConfigsApiResponse {
  status: boolean;
  message: string;
  data: {
    configs: Array<{
      key: string;
      value: string | number;
      updatedAt: string;
    }>;
  };
}

// Config keys enum for type safety
export enum ConfigKeys {
  ASSESSMENT_THRESHOLD = 'assessmentTreshold',
  TRAINING_LIVELIHOOD = 'trainingLivelihood',
  TRAINING_ADAPTATION_MITIGATION = 'trainingAdaptationMitigation',
}

// Transform API response to our internal format
const transformConfigFromAPI = (
  key: string,
  apiValue: string | number
): ConfigItem => {
  const configMeta = {
    [ConfigKeys.ASSESSMENT_THRESHOLD]: {
      type: 'number' as const,
      label: 'Assessment Threshold',
      description: 'Threshold value for assessments',
    },
    [ConfigKeys.TRAINING_LIVELIHOOD]: {
      type: 'array' as const,
      label: 'Training Livelihood',
      description: 'List of training livelihood options',
    },
    [ConfigKeys.TRAINING_ADAPTATION_MITIGATION]: {
      type: 'array' as const,
      label: 'Training Adaptation Mitigation',
      description: 'List of training adaptation mitigation options',
    },
  };

  const meta = configMeta[key as ConfigKeys] || {
    type: 'number' as const,
    label: key,
    description: `Configuration for ${key}`,
  };

  let transformedValue: string | number | string[];

  if (meta.type === 'array' && typeof apiValue === 'string') {
    transformedValue = apiValue
      ? apiValue.split(';').filter((item) => item.trim() !== '')
      : [];
  } else {
    transformedValue = apiValue;
  }

  return {
    key,
    value: transformedValue,
    type: meta.type,
    label: meta.label,
    description: meta.description,
  };
};

// Global Config API Service
export const globalConfigService = {
  /**
   * Get all configuration items
   */
  async getAllConfigs(): Promise<ConfigItem[]> {
    try {
      // Since there's no single endpoint to get all configs, we'll fetch them individually
      const configKeys = Object.values(ConfigKeys);
      const configPromises = configKeys.map((key) => this.getConfigByKey(key));

      const configs = await Promise.allSettled(configPromises);

      return configs
        .filter(
          (result): result is PromiseFulfilledResult<ConfigItem> =>
            result.status === 'fulfilled'
        )
        .map((result) => result.value);
    } catch (error) {
      console.error('Failed to fetch all configs:', error);
      return [];
    }
  },

  /**
   * Get configuration by key
   */
  async getConfigByKey(key: string): Promise<ConfigItem> {
    try {
      const response = await apiClient.get<ConfigApiResponse>(`/config/${key}`);

      if (response.status && response.data) {
        return transformConfigFromAPI(key, response.data.value);
      }

      throw new Error(`Config ${key} not found`);
    } catch (error) {
      console.error(`Failed to fetch config ${key}:`, error);
      throw error;
    }
  },

  /**
   * Update configuration by key
   */
  async updateConfig(
    key: string,
    value: string | number | string[]
  ): Promise<{
    status: boolean;
    message: string;
  }> {
    try {
      let requestValue: string | number;

      if (Array.isArray(value)) {
        // Remove duplicates and join with semicolon
        const uniqueValues = Array.from(
          new Set(value.filter((item) => item.trim() !== ''))
        );
        requestValue = uniqueValues.join(';');
      } else {
        requestValue = value;
      }

      const response = await apiClient.put<ConfigApiResponse>(
        `/config/${key}`,
        {
          value: requestValue,
        }
      );

      return {
        status: response.status,
        message: response.message,
      };
    } catch (error) {
      console.error(`Failed to update config ${key}:`, error);
      throw error;
    }
  },
};
