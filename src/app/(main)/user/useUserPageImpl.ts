import { useEffect, useState } from 'react';
import { useUserStore } from '@/stores/userStore';
import { User } from '@/types/user';
import { useUsers, useDeleteUser } from '@/hooks/useUserData';
import { createUserColumns } from './UserColumn';

export const useUserPageImpl = () => {
  const {
    searchQuery,
    isFilterModalOpen,
    page,
    setSearchQuery,
    setIsFilterModalOpen,
    navigateToAdd,
    navigateToDetail,
    navigateToEdit,
  } = useUserStore();

  // Local state for pagination and selected user
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Use pagination parameters
  const {
    data: usersResponse,
    isLoading,
    error,
  } = useUsers({
    page: currentPage,
    pageSize: pageSize,
    search: searchQuery,
    sortBy: 'createdAt',
  });

  // Extract users and pagination info from response
  const users = usersResponse?.data || [];
  const totalItems = usersResponse?.totalData || 0;
  const totalPages = usersResponse?.totalPages || 0;

  const deleteMutation = useDeleteUser();

  // Ensure users is always an array
  const safeUsers = Array.isArray(users) ? users : [];

  // Reset page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleAddNew = () => {
    navigateToAdd();
  };

  const handleView = (user: User) => {
    navigateToDetail(user);
  };

  const handleEdit = (user: User) => {
    navigateToEdit(user);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleOpenFilter = () => {
    setIsFilterModalOpen(true);
  };

  const handleCloseFilter = () => {
    setIsFilterModalOpen(false);
  };

  const handleApplyFilter = (filters: Record<string, unknown>) => {
    setIsFilterModalOpen(false);
  };

  const handleClearFilter = () => {
    setIsFilterModalOpen(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedUser) {
      try {
        await deleteMutation.mutateAsync(selectedUser.id);
        setShowDeleteModal(false);
        setSelectedUser(null);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const columns = createUserColumns({
    onDelete: handleDelete,
    onEdit: handleEdit,
    onView: handleView,
  });

  const state = {
    columns,
    users: safeUsers,
    error: error?.message || null,
    isLoading,
    searchQuery,
    isFilterModalOpen,
    totalUsers: totalItems,
    page,
    // Pagination state
    totalItems,
    totalPages,
    currentPage,
    pageSize,
    showDeleteModal,
    selectedUser,
  };

  const action = {
    handleAddNew,
    handleView,
    handleEdit,
    handleDelete,
    handleOpenFilter,
    handleCloseFilter,
    handleApplyFilter,
    handleClearFilter,
    setSearchQuery,
    // Pagination actions
    handlePageChange,
    handlePageSizeChange,
    handleDeleteConfirm,
    handleDeleteCancel,
  };

  return { state, action };
};
