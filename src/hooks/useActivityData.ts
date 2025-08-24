import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ActivityData } from '@/types/activity';

const createMockFile = (name: string, type: string, size: number): File => {
  const file = new File(['mock content'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

const mockApi = {
  getActivities: async (): Promise<ActivityData[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return [
      {
        id: '1',
        activityName: 'Community Fire Prevention Training',
        activityCategory: 'Training',
        description:
          'Comprehensive fire prevention training for local community members focusing on early detection and response strategies.',
        startDate: '2024-08-15',
        endDate: '2024-08-25',
        status: 'active',
        progress: 75,
        files: [
          createMockFile('training-manual.pdf', 'application/pdf', 2048576),
          createMockFile(
            'safety-guidelines.docx',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            512000
          ),
          createMockFile(
            'participant-list.xlsx',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            256000
          ),
        ],
      },
      {
        id: '2',
        activityName: 'Forest Restoration Project',
        activityCategory: 'Environmental',
        description:
          'Large-scale forest restoration initiative involving native tree planting and ecosystem rehabilitation.',
        startDate: '2024-07-01',
        endDate: '2024-12-31',
        status: 'active',
        progress: 45,
        files: [
          createMockFile('project-proposal.pdf', 'application/pdf', 3145728),
          createMockFile('site-map.jpg', 'image/jpeg', 1024000),
          createMockFile('species-list.csv', 'text/csv', 128000),
          createMockFile(
            'budget-breakdown.xlsx',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            384000
          ),
        ],
      },
      {
        id: '3',
        activityName: 'Carbon Monitoring Program',
        activityCategory: 'Monitoring',
        description:
          'Monthly carbon emission monitoring and reporting program for industrial facilities in the region.',
        startDate: '2024-06-01',
        endDate: '2024-11-30',
        status: 'active',
        progress: 60,
        files: [
          createMockFile(
            'monitoring-report-q2.pdf',
            'application/pdf',
            1536000
          ),
          createMockFile(
            'emission-data.xlsx',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            768000
          ),
          createMockFile('facility-photos.zip', 'application/zip', 5242880),
        ],
      },
      {
        id: '4',
        activityName: 'Water Conservation Workshop',
        activityCategory: 'Education',
        description:
          'Educational workshop series on water conservation techniques and sustainable water management practices.',
        startDate: '2024-05-15',
        endDate: '2024-05-30',
        status: 'inactive',
        progress: 100,
        files: [
          createMockFile(
            'workshop-presentation.pptx',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            2048000
          ),
          createMockFile('conservation-tips.pdf', 'application/pdf', 512000),
          createMockFile(
            'attendance-record.xlsx',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            128000
          ),
          createMockFile(
            'feedback-summary.docx',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            256000
          ),
        ],
      },
      {
        id: '5',
        activityName: 'Emergency Response Drill',
        activityCategory: 'Safety',
        description:
          'Quarterly emergency response drill for natural disaster preparedness and community safety.',
        startDate: '2024-09-01',
        endDate: '2024-09-05',
        status: 'active',
        progress: 25,
        files: [
          createMockFile('drill-protocol.pdf', 'application/pdf', 1024000),
          createMockFile('evacuation-routes.png', 'image/png', 2048000),
        ],
      },
      {
        id: '6',
        activityName: 'Biodiversity Assessment Survey',
        activityCategory: 'Research',
        description:
          'Comprehensive biodiversity assessment of protected areas to monitor ecosystem health and species population.',
        startDate: '2024-04-01',
        endDate: '2024-10-31',
        status: 'active',
        progress: 80,
        files: [
          createMockFile('survey-methodology.pdf', 'application/pdf', 1792000),
          createMockFile(
            'species-database.xlsx',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            1024000
          ),
          createMockFile('field-photos.zip', 'application/zip', 8388608),
          createMockFile(
            'preliminary-findings.docx',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            512000
          ),
        ],
      },
      {
        id: '7',
        activityName: 'Renewable Energy Installation',
        activityCategory: 'Infrastructure',
        description:
          'Installation of solar panels and wind turbines for sustainable energy generation in rural communities.',
        startDate: '2024-03-15',
        endDate: '2024-09-30',
        status: 'active',
        progress: 65,
        files: [
          createMockFile('installation-guide.pdf', 'application/pdf', 2560000),
          createMockFile(
            'equipment-specs.xlsx',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            384000
          ),
          createMockFile(
            'site-layout.dwg',
            'application/octet-stream',
            1024000
          ),
          createMockFile('progress-photos.zip', 'application/zip', 6291456),
        ],
      },
      {
        id: '8',
        activityName: 'Waste Management Training Program',
        activityCategory: 'Training',
        description:
          'Training program for local officials on proper waste management and recycling practices.',
        startDate: '2024-02-01',
        endDate: '2024-02-28',
        status: 'inactive',
        progress: 100,
        files: [
          createMockFile('training-curriculum.pdf', 'application/pdf', 1536000),
          createMockFile('waste-sorting-guide.jpg', 'image/jpeg', 768000),
          createMockFile(
            'completion-certificates.pdf',
            'application/pdf',
            2048000
          ),
        ],
      },
      {
        id: '9',
        activityName: 'Climate Change Awareness Campaign',
        activityCategory: 'Education',
        description:
          'Public awareness campaign about climate change impacts and adaptation strategies for local communities.',
        startDate: '2024-01-15',
        endDate: '2024-06-30',
        status: 'active',
        progress: 90,
        files: [
          createMockFile('campaign-materials.zip', 'application/zip', 4194304),
          createMockFile('impact-assessment.pdf', 'application/pdf', 1024000),
          createMockFile(
            'social-media-content.pptx',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            3145728
          ),
          createMockFile(
            'outreach-metrics.xlsx',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            256000
          ),
        ],
      },
      {
        id: '10',
        activityName: 'Disaster Risk Reduction Planning',
        activityCategory: 'Planning',
        description:
          'Development of comprehensive disaster risk reduction plans for vulnerable coastal communities.',
        startDate: '2024-10-01',
        endDate: '2024-12-15',
        status: 'active',
        progress: 15,
        files: [
          createMockFile(
            'risk-assessment-draft.pdf',
            'application/pdf',
            2048000
          ),
          createMockFile(
            'community-mapping.kml',
            'application/vnd.google-earth.kml+xml',
            128000
          ),
        ],
      },
    ];
  },

  createActivity: async (
    activity: Omit<ActivityData, 'id'>
  ): Promise<ActivityData> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      id: Date.now().toString(),
      activityName: activity.activityName,
      activityCategory: activity.activityCategory,
      description: activity.description,
      startDate: activity.startDate,
      endDate: activity.endDate,
      status: activity.status,
      progress: activity.progress,
      files: activity.files,
    };
  },

  updateActivity: async (
    id: string,
    activity: Partial<ActivityData>
  ): Promise<ActivityData> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      id,
      activityName: activity.activityName || '',
      activityCategory: activity.activityCategory || '',
      description: activity.description || '',
      startDate: activity.startDate || '',
      endDate: activity.endDate || '',
      status: activity.status || 'inactive',
      progress: activity.progress || 0,
      files: activity.files || [],
      ...activity,
    } as ActivityData;
  },

  deleteActivity: async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
  },
};

// Query keys
export const activityKeys = {
  all: ['activities'] as const,
  lists: () => [...activityKeys.all, 'list'] as const,
  list: (filters: string) => [...activityKeys.lists(), { filters }] as const,
  details: () => [...activityKeys.all, 'detail'] as const,
  detail: (id: string) => [...activityKeys.details(), id] as const,
};

// Custom hooks
export function useActivities(filters?: string) {
  return useQuery({
    queryKey: activityKeys.list(filters || ''),
    queryFn: () => mockApi.getActivities(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockApi.createActivity,
    onSuccess: () => {
      // Invalidate and refetch activity list
      queryClient.invalidateQueries({ queryKey: activityKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to create activity:', error);
    },
  });
}

export function useUpdateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ActivityData> }) =>
      mockApi.updateActivity(id, data),
    onSuccess: (updatedActivity) => {
      // Update the cache
      queryClient.setQueryData(
        activityKeys.detail(updatedActivity.id),
        updatedActivity
      );
      // Invalidate list to refetch
      queryClient.invalidateQueries({ queryKey: activityKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to update activity:', error);
    },
  });
}

export function useDeleteActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockApi.deleteActivity,
    onSuccess: () => {
      // Invalidate and refetch activity list
      queryClient.invalidateQueries({ queryKey: activityKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to delete activity:', error);
    },
  });
}
