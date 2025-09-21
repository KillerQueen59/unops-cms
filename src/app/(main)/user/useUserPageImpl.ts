import React from 'react';
import { useUserStore } from '@/stores/userStore';
import { User } from '@/types/user';
import { useUsers, useDeleteUser } from '@/hooks/useUserData';
import { createUserColumns } from './UserColumn';

export const useUserPageImpl = () => {
  const {
    searchQuery,
    currentPage,
    itemsPerPage,
    isFilterModalOpen,
    users,
    isLoading,
    error,
    page,
    setSearchQuery,
    setCurrentPage,
    setItemsPerPage,
    setIsFilterModalOpen,
    navigateToAdd,
    navigateToDetail,
    navigateToEdit,
    setUsers,
    setLoading,
    setError,
  } = useUserStore();

  const {
    data: fetchedUsers = [],
    isLoading: isFetching,
    error: fetchError,
  } = useUsers();
  const deleteMutation = useDeleteUser();

  // Update store when data changes - use refs to avoid dependency issues
  const storeActionsRef = React.useRef({ setUsers, setLoading, setError });
  storeActionsRef.current = { setUsers, setLoading, setError };

  React.useEffect(() => {
    const { setUsers, setLoading, setError } = storeActionsRef.current;
    setUsers(fetchedUsers);
    setLoading(isFetching);
    setError(fetchError?.message || null);
  }, [isFetching]);

  const handleAddNew = () => {
    navigateToAdd();
  };

  const handleView = (user: User) => {
    navigateToDetail(user);
  };

  const handleEdit = (user: User) => {
    navigateToEdit(user);
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
    // Implementation for applying filters
    console.log('Applying filters:', filters);
    setIsFilterModalOpen(false);
  };

  const handleClearFilter = () => {
    // Implementation for clearing filters
    console.log('Clearing filters');
    setIsFilterModalOpen(false);
  };

  const columns = createUserColumns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  // Filter data based on search query
  const filteredUsers = users.filter((user) => {
    if (!searchQuery) return true;
    return (
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const state = {
    columns,
    users: filteredUsers,
    error,
    isLoading,
    searchQuery,
    currentPage,
    itemsPerPage,
    isFilterModalOpen,
    totalUsers: filteredUsers.length,
    page,
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
    setCurrentPage,
    setItemsPerPage,
  };

  return { state, action };
};
