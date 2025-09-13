import { useDataStore } from '@/stores/dataStore';
import { DataFile } from '@/types/data';
import { useDataFiles, useDeleteFile } from '@/hooks/useDataFiles';
import { createDataColumns } from './DataColumn';

export const useDataPageImpl = () => {
  const {
    searchQuery,
    isUploadModalOpen,
    isPreviewModalOpen,
    previewFile,
    groupBy,
    isGrouped,
    setSearchQuery,
    openUploadModal,
    closeUploadModal,
    openPreviewModal,
    closePreviewModal,
    setGroupBy,
    setIsGrouped,
  } = useDataStore();

  const { data: dataFiles = [], isLoading, error } = useDataFiles();
  const deleteMutation = useDeleteFile();

  const handleUpload = () => {
    openUploadModal();
  };

  const handleView = (file: DataFile) => {
    openPreviewModal(file);
  };

  const handleDownload = async (file: DataFile) => {
    try {
      if (file.file) {
        // For uploaded files, create download
        const url = URL.createObjectURL(file.file);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // For mock files, simulate download
        console.log(`Downloading ${file.fileName}...`);
        // In a real app, this would initiate actual file download
        alert(`Downloading ${file.fileName}...`);
      }
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleDelete = async (file: DataFile) => {
    if (
      window.confirm(`Are you sure you want to delete "${file.documentName}"?`)
    ) {
      try {
        await deleteMutation.mutateAsync(file.id);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const columns = createDataColumns({
    onView: handleView,
    onDownload: handleDownload,
    onDelete: handleDelete,
  });

  // Filter data based on search query and selected category
  const filteredData = dataFiles.filter((file) => {
    // First filter by search query
    const matchesSearch =
      !searchQuery ||
      file.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.description?.toLowerCase().includes(searchQuery.toLowerCase());

    // Then filter by category if grouping is enabled
    if (!isGrouped) return matchesSearch;

    // Filter by selected category
    if (groupBy === 'regency') {
      return matchesSearch && file.category === 'regency';
    } else if (groupBy === 'other') {
      return matchesSearch && file.category === 'other';
    }

    return matchesSearch;
  });

  const state = {
    columns,
    dataFiles: filteredData,
    error,
    isLoading,
    searchQuery,
    isUploadModalOpen,
    isPreviewModalOpen,
    previewFile,
    groupBy,
    isGrouped,
  };

  const action = {
    handleUpload,
    handleView,
    handleDownload,
    handleDelete,
    setSearchQuery,
    setGroupBy,
    setIsGrouped,
    closeUploadModal,
    closePreviewModal,
  };

  return { state, action };
};
