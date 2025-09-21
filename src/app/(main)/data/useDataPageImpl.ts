import { useDataStore } from '@/stores/dataStore';
import { DataFile } from '@/types/data';
import { createDataColumns } from './DataColumn';
import {
  useDocuments,
  useDeleteDocument,
  useDownloadFile,
} from '@/hooks/useDocumentData';
import { useState, useEffect } from 'react';

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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedData, setSelectedData] = useState<DataFile | null>(null);

  // Use pagination parameters
  const {
    data: documentsResponse,
    isLoading,
    error,
  } = useDocuments({
    page: currentPage,
    pageSize: pageSize,
    search: searchQuery,
    area: isGrouped && groupBy !== 'other' ? groupBy : undefined,
  });

  // Extract documents and pagination info from response
  const dataFiles = documentsResponse?.data || [];

  const totalItems = documentsResponse?.totalData || 0;
  const totalPages = documentsResponse?.totalPages || 0;

  const deleteMutation = useDeleteDocument();
  const downloadMutation = useDownloadFile();

  // Reset page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, groupBy, isGrouped]);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleUpload = () => {
    openUploadModal();
  };

  const handleView = (file: DataFile) => {
    openPreviewModal(file);
  };

  const handleDownload = async (file: DataFile) => {
    try {
      await downloadMutation.mutateAsync(file);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedData) {
      try {
        await deleteMutation.mutateAsync(selectedData.id);
        setShowDeleteModal(false);
        setSelectedData(null);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleDelete = (file: DataFile) => {
    setShowDeleteModal(true);
    setSelectedData(file);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setSelectedData(null);
  };

  const columns = createDataColumns({
    onView: handleView,
    onDownload: handleDownload,
    onDelete: handleDelete,
  });

  // Filter data based on grouping (if needed for client-side filtering)
  const filteredData = dataFiles.filter((file) => {
    if (!isGrouped) return true;

    // Filter by selected category
    if (groupBy === 'regency') {
      return file.category === 'regency';
    } else if (groupBy === 'other') {
      return file.category === 'other';
    }

    return true;
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
    // Pagination state
    totalItems,
    totalPages,
    currentPage,
    pageSize,
    isDeleting: deleteMutation.isPending,
    isDownloading: downloadMutation.isPending,
    showDeleteModal,
    selectedData,
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
    // Pagination actions
    handlePageChange,
    handlePageSizeChange,
    setShowDeleteModal,
    handleDeleteConfirm,
    handleDeleteCancel,
  };

  return { state, action };
};
