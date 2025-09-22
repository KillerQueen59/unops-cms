import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ActivityData } from '@/types/activity';
import { PageEnum } from '@/constants/page';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
  onClick?: () => void;
}

interface ActivityState {
  // Activity list state
  activities: ActivityData[];
  selectedActivity: ActivityData | null;
  isLoading: boolean;
  error: string | null;
  page: PageEnum;

  // Breadcrumb state
  breadcrumbs: BreadcrumbItem[];

  // Filter and search state
  searchQuery: string;
  currentPage: number;
  itemsPerPage: number;
  isFilterModalOpen: boolean;

  // Actions
  setPage: (page: PageEnum) => void;

  // Navigation actions
  navigateToDetail: (activity: ActivityData) => void;
  navigateToEdit: (activity: ActivityData) => void;

  // Breadcrumb actions
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
  updateBreadcrumbs: (page: PageEnum, activityName?: string) => void;

  // Filter actions
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  setIsFilterModalOpen: (isOpen: boolean) => void;

  // Activity CRUD actions
  addActivity: (activity: ActivityData) => void;
  updateActivity: (id: string, activity: Partial<ActivityData>) => void;
  deleteActivity: (id: string) => void;

  // Reset function
  reset: () => void;
  resetActivity: () => void;
}

const initialState = {
  activities: [],
  selectedActivity: null,
  isLoading: false,
  error: null,
  searchQuery: '',
  statusFilter: 'all',
  currentPage: 1,
  itemsPerPage: 10,
  isAddModalOpen: false,
  isEditModalOpen: false,
  isDeleteModalOpen: false,
  isFilterModalOpen: false,
  page: PageEnum.LIST,
  breadcrumbs: [] as BreadcrumbItem[],
};

export const useActivityStore = create<ActivityState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Filter actions
      setSearchQuery: (query) =>
        set({ searchQuery: query, currentPage: 1 }, false, 'setSearchQuery'),

      setIsFilterModalOpen: (isOpen) =>
        set({ isFilterModalOpen: isOpen }, false, 'setIsFilterModalOpen'),

      setPage: (page) => set({ page }, false, 'setPage'),

      // Breadcrumb actions
      setBreadcrumbs: (breadcrumbs) =>
        set({ breadcrumbs }, false, 'setBreadcrumbs'),

      updateBreadcrumbs: (page, activityName) => {
        const { setPage } = get();
        const newBreadcrumbs: BreadcrumbItem[] = [
          {
            label: 'Activity',
            href: '/activity',
            onClick: () => {
              setPage(PageEnum.LIST);
            },
          },
        ];

        switch (page) {
          case PageEnum.LIST:
            newBreadcrumbs.push({
              label: 'Activity List',
              isActive: true,
            });
            break;
          case PageEnum.ADD:
            newBreadcrumbs.push({
              label: 'Add Activity',
              isActive: true,
            });
            break;
          case PageEnum.EDIT:
            newBreadcrumbs.push({
              label: 'Edit Activity',
              isActive: true,
            });
            break;
          case PageEnum.DETAIL:
            newBreadcrumbs.push({
              label: activityName || 'Activity Detail',
              isActive: true,
            });
            break;
        }

        set({ breadcrumbs: newBreadcrumbs, page }, false, 'updateBreadcrumbs');
      },

      // CRUD operations
      addActivity: (activity) => {
        const { activities } = get();
        set({ activities: [...activities, activity] }, false, 'addActivity');
      },

      updateActivity: (id, updatedActivity) => {
        const { activities } = get();
        const updatedActivities = activities.map((activity) =>
          activity.id === id ? { ...activity, ...updatedActivity } : activity
        );
        set({ activities: updatedActivities }, false, 'updateActivity');
      },

      deleteActivity: (id) => {
        const { activities } = get();
        const filteredActivities = activities.filter(
          (activity) => activity.id !== id
        );
        set({ activities: filteredActivities }, false, 'deleteActivity');
      },

      // Navigation actions
      navigateToDetail: (activity) => {
        const { updateBreadcrumbs } = get();
        set(
          { selectedActivity: activity, page: PageEnum.DETAIL },
          false,
          'navigateToDetail'
        );
        updateBreadcrumbs(PageEnum.DETAIL, activity.activityName);
      },

      navigateToEdit: (activity) => {
        console.log('Navigating to edit activity:', activity);

        const { updateBreadcrumbs } = get();
        set(
          { selectedActivity: activity, page: PageEnum.EDIT },
          false,
          'navigateToEdit'
        );
        updateBreadcrumbs(PageEnum.EDIT, 'Edit ' + activity.activityName);
      },

      reset: () => set(initialState, false, 'reset'),
      resetActivity: () =>
        set({ selectedActivity: null }, false, 'resetActivity'),
    }),
    {
      name: 'activity-store',
    }
  )
);
