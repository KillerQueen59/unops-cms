import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ConfigItem } from '@/services/globalConfigService';

interface GlobalConfigState {
  // Config state
  configs: ConfigItem[];
  selectedConfig: ConfigItem | null;
  isLoading: boolean;
  error: string | null;

  // UI state
  searchQuery: string;
  isDirty: { [key: string]: boolean }; // Track which configs have unsaved changes
  expandedSections: { [key: string]: boolean }; // For collapsible sections

  // Actions - Config management
  setConfigs: (configs: ConfigItem[]) => void;
  updateConfig: (key: string, value: string | number | string[]) => void;
  setSelectedConfig: (config: ConfigItem | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Actions - UI state
  setSearchQuery: (query: string) => void;
  setConfigDirty: (key: string, isDirty: boolean) => void;
  toggleSection: (key: string) => void;
  setExpandedSection: (key: string, expanded: boolean) => void;

  // Actions - Array manipulation for array-type configs
  addArrayItem: (configKey: string, item: string) => void;
  removeArrayItem: (configKey: string, item: string) => void;
  updateArrayItem: (
    configKey: string,
    oldItem: string,
    newItem: string
  ) => void;

  // Utility actions
  getConfigByKey: (key: string) => ConfigItem | undefined;
  hasUnsavedChanges: () => boolean;
  getDirtyConfigs: () => ConfigItem[];
  reset: () => void;
  resetConfig: (key: string) => void;
}

const initialState = {
  configs: [],
  selectedConfig: null,
  isLoading: false,
  error: null,
  searchQuery: '',
  isDirty: {},
  expandedSections: {},
};

export const useGlobalConfigStore = create<GlobalConfigState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Config management actions
      setConfigs: (configs) => set({ configs }, false, 'setConfigs'),

      updateConfig: (key, value) => {
        const { configs, setConfigDirty } = get();
        const updatedConfigs = configs.map((config) => {
          if (config.key === key) {
            return { ...config, value };
          }
          return config;
        });

        set({ configs: updatedConfigs }, false, 'updateConfig');
        setConfigDirty(key, true);
      },

      setSelectedConfig: (config) =>
        set({ selectedConfig: config }, false, 'setSelectedConfig'),

      setLoading: (loading) => set({ isLoading: loading }, false, 'setLoading'),

      setError: (error) => set({ error }, false, 'setError'),

      // UI state actions
      setSearchQuery: (query) =>
        set({ searchQuery: query }, false, 'setSearchQuery'),

      setConfigDirty: (key, isDirty) => {
        const { isDirty: currentDirty } = get();
        const newDirty = { ...currentDirty };

        if (isDirty) {
          newDirty[key] = true;
        } else {
          delete newDirty[key];
        }

        set({ isDirty: newDirty }, false, 'setConfigDirty');
      },

      toggleSection: (key) => {
        const { expandedSections } = get();
        const newExpanded = {
          ...expandedSections,
          [key]: !expandedSections[key],
        };
        set({ expandedSections: newExpanded }, false, 'toggleSection');
      },

      setExpandedSection: (key, expanded) => {
        const { expandedSections } = get();
        const newExpanded = {
          ...expandedSections,
          [key]: expanded,
        };
        set({ expandedSections: newExpanded }, false, 'setExpandedSection');
      },

      // Array manipulation actions
      addArrayItem: (configKey, item) => {
        const { configs, updateConfig } = get();
        const config = configs.find((c) => c.key === configKey);

        if (config && config.type === 'array') {
          const currentArray = Array.isArray(config.value) ? config.value : [];
          const trimmedItem = item.trim();

          // Check for duplicates
          if (trimmedItem && !currentArray.includes(trimmedItem)) {
            updateConfig(configKey, [...currentArray, trimmedItem]);
          }
        }
      },

      removeArrayItem: (configKey, item) => {
        const { configs, updateConfig } = get();
        const config = configs.find((c) => c.key === configKey);

        if (config && config.type === 'array') {
          const currentArray = Array.isArray(config.value) ? config.value : [];
          updateConfig(
            configKey,
            currentArray.filter((arrayItem: string) => arrayItem !== item)
          );
        }
      },

      updateArrayItem: (configKey, oldItem, newItem) => {
        const { configs, updateConfig } = get();
        const config = configs.find((c) => c.key === configKey);

        if (config && config.type === 'array') {
          const currentArray = Array.isArray(config.value) ? config.value : [];
          const trimmedNewItem = newItem.trim();

          // Check for duplicates (excluding the item being updated)
          const otherItems = currentArray.filter(
            (item: string) => item !== oldItem
          );
          if (trimmedNewItem && !otherItems.includes(trimmedNewItem)) {
            const updatedArray = currentArray.map((item: string) =>
              item === oldItem ? trimmedNewItem : item
            );
            updateConfig(configKey, updatedArray);
          }
        }
      },

      // Utility actions
      getConfigByKey: (key) => {
        const { configs } = get();
        return configs.find((config) => config.key === key);
      },

      hasUnsavedChanges: () => {
        const { isDirty } = get();
        return Object.keys(isDirty).length > 0;
      },

      getDirtyConfigs: () => {
        const { configs, isDirty } = get();
        return configs.filter((config) => isDirty[config.key]);
      },

      reset: () => set(initialState, false, 'reset'),

      resetConfig: (key) => {
        const { configs, setConfigDirty } = get();
        // This would typically reset to the original/default value
        // For now, we'll just mark it as clean
        setConfigDirty(key, false);

        set(
          {
            configs: configs.map((config) => {
              if (config.key === key) {
                // Reset to default values based on type
                if (config.type === 'array') {
                  return { ...config, value: [] };
                } else {
                  return { ...config, value: 0 };
                }
              }
              return config;
            }),
          },
          false,
          'resetConfig'
        );
      },
    }),
    {
      name: 'global-config-store',
    }
  )
);
