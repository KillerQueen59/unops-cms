import { apiClient } from '@/lib/api';
import {
  TrainingListParams,
  TrainingListResponse,
  TrainingResponse,
  TrainingCategoriesResponse,
  CreateTrainingData,
  UpdateTrainingData,
  Training,
} from '@/types/training';

export const trainingApi = {
  getTrainings: async (
    params: TrainingListParams = {}
  ): Promise<TrainingListResponse> => {
    const cleanParams = Object.fromEntries(
      Object.entries(params)
        .filter(
          ([, value]) => value !== undefined && value !== null && value !== ''
        )
        .map(([key, value]) => [key, value.toString()])
    );

    return apiClient.get<TrainingListResponse>('/village/training/all');
  },

  getTrainingById: async (trainingId: string): Promise<TrainingResponse> => {
    return apiClient.get<TrainingResponse>(`/village/training/${trainingId}`);
  },

  createTraining: async (
    trainingData: CreateTrainingData,
    files?: File[]
  ): Promise<TrainingResponse> => {
    if (files && files.length > 0) {
      const formData = createTrainingFormData(trainingData, files);
      return apiClient.post<TrainingResponse>('/village/training', formData);
    }

    return apiClient.post<TrainingResponse>('/village/training', trainingData);
  },

  updateTraining: async (
    trainingId: string,
    trainingData: UpdateTrainingData,
    files?: File[]
  ): Promise<TrainingResponse> => {
    if (files && files.length > 0) {
      const formData = createTrainingFormData(trainingData, files);
      return apiClient.put<TrainingResponse>(
        `/village/training/${trainingId}`,
        formData
      );
    }

    return apiClient.put<TrainingResponse>(
      `/village/training/${trainingId}`,
      trainingData
    );
  },

  deleteTraining: async (
    trainingId: string
  ): Promise<{ status: boolean; message: string }> => {
    return apiClient.delete(`/village/training/${trainingId}`);
  },
};

// Helper functions for data transformation
export const transformTrainingForUI = (
  training: Training
): import('@/types/training').TrainingData => {
  return {
    id: training._id,
    trainingName: training.name,
    trainingType: training.trainingType,
    date: training.startDate,
    village: training.villageId,
    villageId: training.villageId,
    // Number of beneficiaries
    male: training.beneficiaries?.male || 0,
    female: training.beneficiaries?.female || 0,
    elderly: training.beneficiaries?.elderly || 0,
    youth: training.beneficiaries?.youth || 0,
    disability: training.beneficiaries?.disability || 0,
    widow: training.beneficiaries?.widow || 0,
    // Training Assessment
    pretest: training.assessment?.pretest || 0,
    posttest: training.assessment?.posttest || 0,
    // Stakeholders Involved
    ngo: training.stakeholders?.ngo || 0,
    government: training.stakeholders?.government || 0,
    privateSector: training.stakeholders?.privateSector || 0,
    academics: training.stakeholders?.academics || 0,
    localCommunity: training.stakeholders?.localCommunity || 0,
    others: training.stakeholders?.others || 0,
  };
};

export const transformUITrainingForAPI = (
  training: Partial<import('@/types/training').TrainingData>
): UpdateTrainingData => {
  // Map UI data to API format
  return {
    name: training.trainingName,
    startDate: training.date,
    endDate: training.date, // UI only has one date field
    description: '', // No description in UI, could add later
    status: 'ongoing', // Default status
    trainingType: training.trainingType || 'In-Person', // Default training type
    beneficiaries: {
      male: training.male || 0,
      female: training.female || 0,
      elderly: training.elderly || 0,
      youth: training.youth || 0,
      disability: training.disability || 0,
      widow: training.widow || 0,
    },
    assessment: {
      pretest: training.pretest || 0,
      posttest: training.posttest || 0,
    },
    stakeholders: {
      ngo: training.ngo || 0,
      government: training.government || 0,
      privateSector: training.privateSector || 0,
      academics: training.academics || 0,
      localCommunity: training.localCommunity || 0,
      others: training.others || 0,
    },
  };
};

export const createTrainingFormData = (
  data: CreateTrainingData | UpdateTrainingData,
  files?: File[]
): FormData => {
  const formData = new FormData();

  // Add training data fields
  if (data.name) formData.append('name', data.name);
  if (data.description) formData.append('description', data.description);
  if (data.startDate) formData.append('startDate', data.startDate);
  if (data.endDate) formData.append('endDate', data.endDate);
  if (data.status) formData.append('status', data.status);
  if (data.trainingType) formData.append('trainingType', data.trainingType);

  // Add nested objects as JSON strings or individual fields
  if (data.beneficiaries) {
    formData.append('beneficiaries', JSON.stringify(data.beneficiaries));
  }
  if (data.assessment) {
    formData.append('assessment', JSON.stringify(data.assessment));
  }
  if (data.stakeholders) {
    formData.append('stakeholders', JSON.stringify(data.stakeholders));
  }

  // Add files if provided
  if (files) {
    files.forEach((file) => {
      formData.append('files', file);
    });
  }

  return formData;
};
