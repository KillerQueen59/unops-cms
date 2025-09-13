import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, UserRole, UserStatus, UserHistoryLog } from '@/types/user';
import { UserFormData } from '@/types/userForm';

// Mock function to create user
const createMockUser = (
  name: string,
  email: string,
  role: UserRole,
  status: UserStatus = UserStatus.ACTIVE
): User => ({
  id: Math.random().toString(36).substr(2, 9),
  name,
  email,
  role,
  status,
  lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0],
  createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0],
  createdBy: 'System Admin',
  lastModified: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0],
  modifiedBy: 'System Admin',
});

// Mock data - simulating user management
const mockUsers: User[] = [
  createMockUser(
    'Muhammad Hafizhan',
    'team@communitylearning.org',
    UserRole.SUPER_ADMIN
  ),
  createMockUser('Alex Johnson', 'alex@villagetraining.org', UserRole.ADMIN),
  createMockUser('Sarah Wilson', 'innovation@villagecamp.com', UserRole.ADMIN),
  createMockUser(
    'Mike Chen',
    'support@communityschool.org',
    UserRole.SUPER_ADMIN
  ),
  createMockUser(
    'Emma Davis',
    'creativity@villageworkshop.com',
    UserRole.ADMIN,
    UserStatus.INACTIVE
  ),
  createMockUser(
    'John Smith',
    'community@training@village.org',
    UserRole.ADMIN
  ),
  createMockUser(
    'Lisa Brown',
    'info@innovativevillage.com',
    UserRole.ADMIN,
    UserStatus.INACTIVE
  ),
  createMockUser(
    'David Lee',
    'harvest@farmtotable.com',
    UserRole.SUPER_ADMIN,
    UserStatus.INACTIVE
  ),
  createMockUser(
    'Anna Martinez',
    'info@communityle@rninghub.com',
    UserRole.ADMIN
  ),
  createMockUser(
    'Tom Johnson',
    'contact@agriculturaltraining.com',
    UserRole.SUPER_ADMIN
  ),
];

// Mock history logs
const mockHistoryLogs: UserHistoryLog[] = [
  {
    id: '1',
    userId: mockUsers[0].id,
    action: 'Changed password',
    details: '',
    performedBy: 'Muhammad Hafizhan',
    performedAt: '2025-04-23 10:34:22',
  },
  {
    id: '2',
    userId: mockUsers[0].id,
    action: 'Changed Email',
    details: 'from hafizhan@email.com to hafizhan12@email.com',
    performedBy: 'Muhammad Hafizhan',
    performedAt: '2025-04-23 10:34:22',
  },
  {
    id: '3',
    userId: mockUsers[0].id,
    action: 'Changed Status',
    details: 'from Inactive to Active',
    performedBy: 'Muhammad Hafizhan',
    performedAt: '2025-04-23 10:34:22',
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const userApi = {
  // Get all users
  getUsers: async (): Promise<User[]> => {
    await delay(1000);
    return mockUsers;
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User | undefined> => {
    await delay(500);
    return mockUsers.find((user) => user.id === id);
  },

  // Get user history
  getUserHistory: async (userId: string): Promise<UserHistoryLog[]> => {
    await delay(500);
    return mockHistoryLogs.filter((log) => log.userId === userId);
  },

  // Create new user
  createUser: async (data: UserFormData): Promise<User> => {
    await delay(1500);

    const newUser: User = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      role: data.role,
      status: data.status,
      lastLogin: 'Never',
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: 'Current User',
      lastModified: new Date().toISOString().split('T')[0],
      modifiedBy: 'Current User',
    };

    // Add to mock data
    mockUsers.unshift(newUser);

    return newUser;
  },

  // Update user
  updateUser: async (
    id: string,
    data: Partial<UserFormData>
  ): Promise<User> => {
    await delay(1500);

    const userIndex = mockUsers.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const updatedUser = {
      ...mockUsers[userIndex],
      ...data,
      lastModified: new Date().toISOString().split('T')[0],
      modifiedBy: 'Current User',
    };

    mockUsers[userIndex] = updatedUser;

    return updatedUser;
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    await delay(1000);

    const userIndex = mockUsers.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    mockUsers.splice(userIndex, 1);
  },
};

// React Query hooks
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: userApi.getUsers,
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userApi.getUserById(id),
    enabled: !!id,
  });
};

export const useUserHistory = (userId: string) => {
  return useQuery({
    queryKey: ['userHistory', userId],
    queryFn: () => userApi.getUserHistory(userId),
    enabled: !!userId,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UserFormData> }) =>
      userApi.updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
