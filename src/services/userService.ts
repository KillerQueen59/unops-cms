import { apiClient } from '@/lib/api';
import { PaginatedResponse } from '@/types/common';
import { User, UserRole, UserStatus, UserHistoryLog } from '@/types/user';

// User API interfaces
export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

export interface UpdateUserData {
  id: string;
  name?: string;
  email?: string;
  role?: UserRole;
  status?: UserStatus;
}

// Pagination interfaces
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
}

// API Response interfaces
interface UserApiResponse {
  status: boolean;
  message: string;
  data: {
    users: Array<{
      _id: string;
      name: string;
      email: string;
      role: string;
      status?: string;
      lastLogin?: string;
      createdAt: string;
      updatedAt?: string;
      createdBy?: string;
      modifiedBy?: string;
    }>;
    totalData: number;
  };
}

interface SingleUserApiResponse {
  status: boolean;
  message: string;
  data: {
    _id: string;
    name: string;
    email: string;
    role: string;
    status?: string;
    lastLogin?: string;
    createdAt: string;
    updatedAt?: string;
    createdBy?: string;
    modifiedBy?: string;
  };
}

interface CreateUserApiResponse {
  status: boolean;
  message: string;
  data: {
    user: {
      _id: string;
      name: string;
      email: string;
      role: string;
      createdAt: string;
    };
  };
}

// Transform API response to our internal format
const transformUserFromAPI = (
  apiUser: UserApiResponse['data']['users'][0]
): User => {
  return {
    id: apiUser._id,
    name: apiUser.name || '',
    email: apiUser.email || '',
    role: (apiUser.role as UserRole) || UserRole.ADMIN,
    status: (apiUser.status as UserStatus) || UserStatus.ACTIVE,
    lastLogin: apiUser.lastLogin || 'Never',
    createdAt: apiUser.createdAt
      ? new Date(apiUser.createdAt).toISOString().split('T')[0]
      : '',
    createdBy: apiUser.createdBy || 'System',
    lastModified: apiUser.updatedAt
      ? new Date(apiUser.updatedAt).toISOString().split('T')[0]
      : '',
    modifiedBy: apiUser.modifiedBy || 'System',
  };
};

const transformSingleUserFromAPI = (
  apiUser: SingleUserApiResponse['data']
): User => {
  return {
    id: apiUser._id,
    name: apiUser.name || '',
    email: apiUser.email || '',
    role: (apiUser.role as UserRole) || UserRole.ADMIN,
    status: (apiUser.status as UserStatus) || UserStatus.ACTIVE,
    lastLogin: apiUser.lastLogin || 'Never',
    createdAt: apiUser.createdAt
      ? new Date(apiUser.createdAt).toISOString().split('T')[0]
      : '',
    createdBy: apiUser.createdBy || 'System',
    lastModified: apiUser.updatedAt
      ? new Date(apiUser.updatedAt).toISOString().split('T')[0]
      : '',
    modifiedBy: apiUser.modifiedBy || 'System',
  };
};

// User API Service
export const userService = {
  async getUsers(params?: PaginationParams): Promise<PaginatedResponse<User>> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.pageSize)
        queryParams.append('pageSize', params.pageSize.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);

      const url = `/user/all${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get<UserApiResponse>(url);

      if (response.status && response.data?.users) {
        const users = response.data.users.map(transformUserFromAPI);
        const totalData = response.data.totalData || users.length;
        const page = params?.page || 1;
        const pageSize = params?.pageSize || 10;

        return {
          data: users,
          totalData,
          page,
          limit: pageSize,
          totalPages: Math.ceil(totalData / pageSize),
        };
      }

      return {
        data: [],
        totalData: 0,
        page: params?.page || 1,
        limit: params?.pageSize || 10,
        totalPages: 0,
      };
    } catch (error) {
      console.error('Failed to fetch users:', error);
      return {
        data: [],
        totalData: 0,
        page: params?.page || 1,
        limit: params?.pageSize || 10,
        totalPages: 0,
      };
    }
  },

  async getUserById(id: string): Promise<User> {
    try {
      const response = await apiClient.get<SingleUserApiResponse>(
        `/user/${id}`
      );

      if (response.status && response.data) {
        return transformSingleUserFromAPI(response.data);
      }
      throw new Error('User not found');
    } catch (error) {
      console.error('Failed to fetch user by ID:', error);
      throw error;
    }
  },

  async createUser(userData: CreateUserData): Promise<{
    status: boolean;
    message: string;
  }> {
    try {
      const response = await apiClient.post<CreateUserApiResponse>(
        '/register',
        userData
      );

      return {
        status: response.status,
        message: response.message,
      };
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  },

  async updateUser(userData: UpdateUserData): Promise<{
    status: boolean;
    message: string;
  }> {
    try {
      const response = await apiClient.put<SingleUserApiResponse>(
        `/user/${userData.id}`,
        {
          name: userData.name,
          email: userData.email,
        }
      );

      return {
        status: response.status,
        message: response.message,
      };
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  },

  async deleteUser(id: string): Promise<void> {
    try {
      await apiClient.delete(`/user/${id}`);
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw error;
    }
  },
};
