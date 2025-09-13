import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { User, UserHistoryLog } from '@/types/user';

export enum UserPageEnum {
  LIST = 'list',
  ADD = 'add',
  DETAIL = 'detail',
  EDIT = 'edit',
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
  onClick?: () => void;
}

interface UserState {
  // User list state
  users: User[];
  selectedUser: User | null;
  userHistory: UserHistoryLog[];
  isLoading: boolean;
  error: string | null;
  page: UserPageEnum;

  // Breadcrumb state
  breadcrumbs: BreadcrumbItem[];

  // Filter and search state
  searchQuery: string;
  currentPage: number;
  itemsPerPage: number;

  // Modal state
  isFilterModalOpen: boolean;
}

interface UserActions {
  // Navigation actions
  setPage: (page: UserPageEnum) => void;
  navigateToAdd: () => void;
  navigateToDetail: (user: User) => void;
  navigateToEdit: (user: User) => void;
  navigateToList: () => void;

  // Breadcrumb actions
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
  updateBreadcrumbs: (page: UserPageEnum, userName?: string) => void;

  // Filter actions
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  setIsFilterModalOpen: (isOpen: boolean) => void;

  // User actions
  setUsers: (users: User[]) => void;
  setSelectedUser: (user: User | null) => void;
  setUserHistory: (history: UserHistoryLog[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // Reset actions
  reset: () => void;
  resetUser: () => void;
}

const initialState: UserState = {
  users: [],
  selectedUser: null,
  userHistory: [],
  isLoading: false,
  error: null,
  page: UserPageEnum.LIST,
  breadcrumbs: [{ label: 'User Management', isActive: true }],
  searchQuery: '',
  currentPage: 1,
  itemsPerPage: 10,
  isFilterModalOpen: false,
};

export const useUserStore = create<UserState & UserActions>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Navigation actions
      setPage: (page) => set({ page }, false, 'setPage'),

      navigateToAdd: () => {
        const { updateBreadcrumbs } = get();
        set(
          { page: UserPageEnum.ADD, selectedUser: null },
          false,
          'navigateToAdd'
        );
        updateBreadcrumbs(UserPageEnum.ADD);
      },

      navigateToDetail: (user) => {
        const { updateBreadcrumbs } = get();
        set(
          { selectedUser: user, page: UserPageEnum.DETAIL },
          false,
          'navigateToDetail'
        );
        updateBreadcrumbs(UserPageEnum.DETAIL, user.name);
      },

      navigateToEdit: (user) => {
        const { updateBreadcrumbs } = get();
        set(
          { selectedUser: user, page: UserPageEnum.EDIT },
          false,
          'navigateToEdit'
        );
        updateBreadcrumbs(UserPageEnum.EDIT, user.name);
      },

      navigateToList: () => {
        const { updateBreadcrumbs } = get();
        set(
          { page: UserPageEnum.LIST, selectedUser: null },
          false,
          'navigateToList'
        );
        updateBreadcrumbs(UserPageEnum.LIST);
      },

      // Breadcrumb actions
      setBreadcrumbs: (breadcrumbs) =>
        set({ breadcrumbs }, false, 'setBreadcrumbs'),

      updateBreadcrumbs: (page, userName) => {
        const newBreadcrumbs: BreadcrumbItem[] = [
          { label: 'User Management', onClick: () => get().navigateToList() },
        ];

        switch (page) {
          case UserPageEnum.ADD:
            newBreadcrumbs.push({ label: 'Add New User', isActive: true });
            break;
          case UserPageEnum.DETAIL:
            if (userName) {
              newBreadcrumbs.push({ label: userName, isActive: true });
            }
            break;
          case UserPageEnum.EDIT:
            if (userName) {
              newBreadcrumbs.push(
                {
                  label: userName,
                  onClick: () => get().navigateToDetail(get().selectedUser!),
                },
                { label: 'Edit', isActive: true }
              );
            }
            break;
          default:
            newBreadcrumbs[0].isActive = true;
            break;
        }

        set({ breadcrumbs: newBreadcrumbs }, false, 'updateBreadcrumbs');
      },

      // Filter actions
      setSearchQuery: (searchQuery) =>
        set({ searchQuery }, false, 'setSearchQuery'),
      setCurrentPage: (currentPage) =>
        set({ currentPage }, false, 'setCurrentPage'),
      setItemsPerPage: (itemsPerPage) =>
        set({ itemsPerPage }, false, 'setItemsPerPage'),
      setIsFilterModalOpen: (isFilterModalOpen) =>
        set({ isFilterModalOpen }, false, 'setIsFilterModalOpen'),

      // User actions
      setUsers: (users) => set({ users }, false, 'setUsers'),
      setSelectedUser: (selectedUser) =>
        set({ selectedUser }, false, 'setSelectedUser'),
      setUserHistory: (userHistory) =>
        set({ userHistory }, false, 'setUserHistory'),
      setLoading: (isLoading) => set({ isLoading }, false, 'setLoading'),
      setError: (error) => set({ error }, false, 'setError'),

      // Reset actions
      reset: () => set(initialState, false, 'reset'),
      resetUser: () => set({ selectedUser: null }, false, 'resetUser'),
    }),
    {
      name: 'user-store',
    }
  )
);
