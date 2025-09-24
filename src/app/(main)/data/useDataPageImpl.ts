import { useDataStore } from '@/stores/dataStore';
import { DataFile } from '@/types/data';
import { createDataColumns } from './DataColumn';
import { useDocuments, useDeleteDocument } from '@/hooks/useDocumentData';
import { useState, useEffect } from 'react';
import { useFileDownload } from '@/hooks/useFileDownload';
import toast from 'react-hot-toast';

export const useDataPageImpl = () => {
  const {
    searchQuery,
    isUploadModalOpen,
    isPreviewModalOpen,
    previewFile,
    groupBy,
    isGrouped,
    filters, // Add filters from store
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

  // Determine the area filter to use
  // Priority: filters.area (from FilterModal) > groupBy (from toggle buttons)
  const getAreaFilter = () => {
    if (filters.area) {
      return filters.area;
    }

    // Otherwise, use the groupBy for legacy toggle button functionality
    if (isGrouped && groupBy !== 'other') {
      return groupBy;
    }

    return undefined;
  };

  // Use pagination parameters
  const {
    data: documentsResponse,
    isLoading,
    error,
  } = useDocuments({
    page: currentPage,
    pageSize: pageSize,
    search: searchQuery,
    area: getAreaFilter(),
  });

  // Extract documents and pagination info from response
  const dataFiles = documentsResponse?.data || [];

  const totalItems = documentsResponse?.totalData || 0;
  const totalPages = documentsResponse?.totalPages || 0;

  const deleteMutation = useDeleteDocument();
  const { downloadFile } = useFileDownload();

  const handleDownload = async (file: DataFile) => {
    try {
      const success = await downloadFile(file);
      if (success) {
        toast.success('Download started');
      } else {
        toast.error('Download failed');
      }
    } catch (error) {
      toast.error('An error occurred during download');
    }
  };

  // Reset pagination when search, grouping, or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, groupBy, isGrouped, filters]);

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

  const handleDeleteConfirm = async () => {
    if (selectedData) {
      try {
        await deleteMutation.mutateAsync(selectedData._id);
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

  const state = {
    columns,
    dataFiles,
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
