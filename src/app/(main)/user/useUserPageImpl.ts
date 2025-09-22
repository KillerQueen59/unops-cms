import React, { useEffect, useState } from 'react';
import { useUserStore } from '@/stores/userStore';
import { User } from '@/types/user';
import { useUsers, useDeleteUser, useUser } from '@/hooks/useUserData';
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
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isEdit, setIsEdit] = useState(false);

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

  // Only fetch user detail when a user is selected
  const { data: userDetail, isLoading: isLoadingUser } = useUser(
    selectedUserId,
    {
      enabled: !!selectedUserId,
    }
  );

  const deleteMutation = useDeleteUser();

  // Ensure users is always an array
  const safeUsers = Array.isArray(users) ? users : [];

  // Reset page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Handle user detail navigation
  useEffect(() => {
    if (userDetail && selectedUserId && !isLoadingUser) {
      if (isEdit) {
        navigateToEdit(userDetail);
      } else {
        navigateToDetail(userDetail);
      }

      setSelectedUserId(null);
      setIsEdit(false);
    }
  }, [
    userDetail,
    selectedUserId,
    isLoadingUser,
    navigateToDetail,
    isEdit,
    navigateToEdit,
  ]);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleAddNew = () => {
    navigateToAdd();
  };

  const handleView = (user: User) => {
    setSelectedUserId(user.id);
  };

  const handleEdit = (user: User) => {
    setIsEdit(true);
    setSelectedUserId(user.id);
  };

  const handleDelete = async (user: User) => {
    if (window.confirm(`Are you sure you want to delete "${user.name}"?`)) {
      try {
        await deleteMutation.mutateAsync(user.id);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
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

  const columns = createUserColumns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete,
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
    isLoadingUser,
    // Pagination state
    totalItems,
    totalPages,
    currentPage,
    pageSize,
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
  };

  return { state, action };
};
