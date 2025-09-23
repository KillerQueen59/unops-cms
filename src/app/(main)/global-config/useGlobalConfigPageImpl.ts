'use client';

import { useEffect, useState } from 'react';
import { useGlobalConfigStore } from '@/stores/globalConfigStore';
import {
  useGlobalConfigs,
  useUpdateGlobalConfig,
} from '@/hooks/useGlobalConfigData';
import { ConfigItem } from '@/services/globalConfigService';

export interface GlobalConfigPageState {
  // Data state
  configs: ConfigItem[];
  isLoading: boolean;
  error: string | null;

  // UI state
  searchQuery: string;
  filteredConfigs: ConfigItem[];
  newItems: { [key: string]: string };
  expandedSections: { [key: string]: boolean };

  // Loading states for individual operations
  savingConfigs: { [key: string]: boolean };
  resettingConfigs: { [key: string]: boolean };

  // Snackbar state
  snackbar: {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  };
}

export interface GlobalConfigPageActions {
  // Search and filter
  setSearchQuery: (query: string) => void;

  // Config value management
  handleNumberChange: (key: string, value: string) => void;
  handleAddArrayItem: (key: string) => void;
  handleRemoveArrayItem: (key: string, item: string) => void;
  handleUpdateArrayItem: (
    key: string,
    oldItem: string,
    newItem: string
  ) => void;

  // New item management
  setNewItem: (key: string, value: string) => void;
  clearNewItem: (key: string) => void;

  // Save operations
  handleSaveConfig: (key: string) => void;

  // UI management
  toggleSection: (key: string) => void;
  handleCloseSnackbar: () => void;

  // Refresh
  handleRefreshConfig: (key: string) => void;
  handleRefreshAllConfigs: () => void;
}

export const useGlobalConfigPageImpl = () => {
  // Store state
  const {
    configs,
    searchQuery,
    expandedSections,
    isDirty,
    setConfigs,
    updateConfig,
    setSearchQuery,
    toggleSection,
    addArrayItem,
    removeArrayItem,
    updateArrayItem,
    getConfigByKey,
    getDirtyConfigs,
    setConfigDirty,
  } = useGlobalConfigStore();

  // Local state
  const [newItems, setNewItems] = useState<{ [key: string]: string }>({});
  const [savingConfigs, setSavingConfigs] = useState<{
    [key: string]: boolean;
  }>({});
  const [resettingConfigs, setResettingConfigs] = useState<{
    [key: string]: boolean;
  }>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  // API hooks
  const { data: apiConfigs, isLoading, error, refetch } = useGlobalConfigs();
  const updateConfigMutation = useUpdateGlobalConfig();
  // Update store when API data changes
  useEffect(() => {
    if (apiConfigs) {
      setConfigs(apiConfigs);
    }
  }, [apiConfigs, setConfigs]);

  // Filter configs based on search query
  const filteredConfigs = configs.filter(
    (config) =>
      config.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      config.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      config.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handlers
  const handleNumberChange = (key: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    updateConfig(key, numValue);
  };

  const handleAddArrayItem = (key: string) => {
    const newItem = newItems[key]?.trim();
    if (!newItem) return;

    addArrayItem(key, newItem);
    setNewItems((prev) => ({ ...prev, [key]: '' }));
  };

  const handleRemoveArrayItem = (key: string, item: string) => {
    removeArrayItem(key, item);
  };

  const handleUpdateArrayItem = (
    key: string,
    oldItem: string,
    newItem: string
  ) => {
    updateArrayItem(key, oldItem, newItem);
  };

  const setNewItem = (key: string, value: string) => {
    setNewItems((prev) => ({ ...prev, [key]: value }));
  };

  const clearNewItem = (key: string) => {
    setNewItems((prev) => ({ ...prev, [key]: '' }));
  };

  const handleSaveConfig = async (key: string) => {
    const config = getConfigByKey(key);
    if (!config) return;

    setSavingConfigs((prev) => ({ ...prev, [key]: true }));

    try {
      await updateConfigMutation.mutateAsync({ key, value: config.value });
      setConfigDirty(key, false);

      setSnackbar({
        open: true,
        message: `${config.label} saved successfully`,
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Failed to save ${config.label}`,
        severity: 'error',
      });
    } finally {
      setSavingConfigs((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleRefreshConfig = async (key: string) => {
    // Refresh individual config by refetching all (since we don't have individual endpoints)
    await refetch();

    setSnackbar({
      open: true,
      message: 'Configuration refreshed',
      severity: 'info',
    });
  };

  const handleRefreshAllConfigs = async () => {
    await refetch();

    setSnackbar({
      open: true,
      message: 'All configurations refreshed',
      severity: 'info',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // State object
  const state: GlobalConfigPageState = {
    configs,
    isLoading,
    error: error?.message || null,
    searchQuery,
    filteredConfigs,
    newItems,
    expandedSections,
    savingConfigs,
    resettingConfigs,
    snackbar,
  };

  // Actions object
  const actions: GlobalConfigPageActions = {
    setSearchQuery,
    handleNumberChange,
    handleAddArrayItem,
    handleRemoveArrayItem,
    handleUpdateArrayItem,
    setNewItem,
    clearNewItem,
    handleSaveConfig,
    toggleSection,
    handleCloseSnackbar,
    handleRefreshConfig,
    handleRefreshAllConfigs,
  };

  return { state, actions };
};
