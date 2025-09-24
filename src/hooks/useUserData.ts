/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User } from '@/types/user';
import { UserFormData } from '@/types/userForm';
import {
  userService,
  CreateUserData,
  UpdateUserData,
  PaginationParams,
} from '@/services/userService';
import { PaginatedResponse } from '@/types/common';
import toast from 'react-hot-toast';
import { Role } from '@/types/role';

// Query Keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: string) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string | null) => [...userKeys.details(), id] as const,
  history: (userId: string) => [...userKeys.all, 'history', userId] as const,
} as const;

// React Query hooks
export const useUsers = (params?: PaginationParams) => {
  return useQuery({
    queryKey: userKeys.list(JSON.stringify(params || {})),
    queryFn: async (): Promise<PaginatedResponse<User>> => {
      try {
        const result = await userService.getUsers(params);
        return result;
      } catch {
        toast.error('Failed to fetch users');
        return {
          data: [],
          totalData: 0,
          page: params?.page || 1,
          limit: params?.pageSize || 10,
          totalPages: 0,
        };
      }
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
};

export const useUser = (id: string | null, options?: { enabled?: boolean }) => {
  const enabled = options?.enabled ?? true;
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.getUserById(id!),
    enabled: enabled && !!id,
    refetchOnMount: 'always',
    staleTime: 0,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userData,
      roles,
    }: {
      userData: UserFormData;
      roles: Role[];
    }) => {
      const createData: CreateUserData = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        roleId: roles.find((role) => role.name === userData.role)?.id || '',
      };
      return userService.createUser(createData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success('User created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create user');
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      userData,
    }: {
      id: string;
      userData: Partial<UserFormData>;
    }) => {
      const updateData: UpdateUserData = {
        id,
        name: userData.name,
        email: userData.email,
        roleId: userData.role,
      };
      return userService.updateUser(updateData);
    },
    onSuccess: (updatedUser, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.setQueryData(userKeys.detail(variables.id), updatedUser);
      toast.success('User updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update user');
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.removeQueries({ queryKey: userKeys.detail(deletedId) });
      toast.success('User deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to delete user');
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) =>
      userService.changePassword(id, password),
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to change password');
    },
  });
};
