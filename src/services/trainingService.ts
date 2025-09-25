import { apiClient } from '@/lib/api';
import { PaginatedResponse } from '@/types/common';
import { TrainingData } from '@/types/training';

// Training API interfaces
export interface CreateTrainingData {
  villageId: string;
  name: string;
  type: string;
  date: string;
  assessment: {
    pre: number;
    post: number;
  };
  beneficiaries: {
    gender: {
      men: number;
      women: number;
    };
    gedsi: {
      elderly: string;
      youth: string;
      widow: string;
      disabled: string;
    };
  };
  stakeholders: {
    ngo: number;
    government: number;
    academation: number;
    privateSector: number;
    localCommunity: number;
    others: number;
  };
}

export interface UpdateTrainingData extends CreateTrainingData {
  _id: string;
}

// Pagination interfaces
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  trainingType?: string;
  village?: string;
  startDate?: string;
  endDate?: string;
}

// API Response interfaces
interface TrainingApiResponse {
  status: boolean;
  message: string;
  data: {
    trainings: Array<{
      _id: string;
      villageId: string;
      name: string;
      type: string;
      date: string;
      assessment: {
        pre: number;
        post: number;
      };
      beneficiaries: {
        gender: {
          men: number;
          women: number;
        };
        gedsi: {
          elderly: string;
          youth: string;
          widow: string;
          disabled: string;
        };
      };
      stakeholders: {
        ngo: number;
        government: number;
        academation: number;
        privateSector: number;
        localCommunity: number;
        others: number;
      };
    }>;
    totalData: number;
    page: number;
    totalPages: number;
  };
}

// Transform API response to our internal format
const transformTrainingFromAPI = (
  apiTraining: TrainingApiResponse['data']['trainings'][0]
): TrainingData => {
  return {
    id: apiTraining._id,
    trainingName: apiTraining.name || '',
    trainingType: apiTraining.type || '',
    date: apiTraining.date || '',
    village: apiTraining.villageId || '',
    villageId: apiTraining.villageId || '',
    // Number of beneficiaries
    male: apiTraining.beneficiaries?.gender?.men || 0,
    female: apiTraining.beneficiaries?.gender?.women || 0,
    elderly: parseInt(apiTraining.beneficiaries?.gedsi?.elderly || '0'),
    youth: parseInt(apiTraining.beneficiaries?.gedsi?.youth || '0'),
    disability: parseInt(apiTraining.beneficiaries?.gedsi?.disabled || '0'),
    widow: parseInt(apiTraining.beneficiaries?.gedsi?.widow || '0'),
    // Training Assessment
    pretest: apiTraining.assessment?.pre || 0,
    posttest: apiTraining.assessment?.post || 0,
    // Stakeholders Involved
    ngo: apiTraining.stakeholders?.ngo || 0,
    government: apiTraining.stakeholders?.government || 0,
    privateSector: apiTraining.stakeholders?.privateSector || 0,
    academics: apiTraining.stakeholders?.academation || 0,
    localCommunity: apiTraining.stakeholders?.localCommunity || 0,
    others: apiTraining.stakeholders?.others || 0,
  };
};

// Training API Service
export const trainingService = {
  async getTrainings(
    params?: PaginationParams
  ): Promise<PaginatedResponse<TrainingData>> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.pageSize)
        queryParams.append('pageSize', params.pageSize.toString());
      // Always add sortBy for consistent results
      queryParams.append('sortBy', params?.sortBy || 'createdAt');
      if (params?.search) queryParams.append('search', params.search);
      if (params?.trainingType) queryParams.append('type', params.trainingType);
      if (params?.village) queryParams.append('village', params.village);
      if (params?.startDate) queryParams.append('startDate', params.startDate);
      if (params?.endDate) queryParams.append('endDate', params.endDate);

      const url = `/village/training/all${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get<TrainingApiResponse>(url);

      if (response.status && response.data?.trainings) {
        const trainings = response.data.trainings.map(transformTrainingFromAPI);
        const totalData = response.data.totalData || 0;
        const page = response.data.page || params?.page || 1;
        const pageSize = params?.pageSize || 10;
        const totalPages =
          response.data.totalPages || Math.ceil(totalData / pageSize);

        return {
          data: trainings,
          totalData,
          page,
          limit: pageSize,
          totalPages,
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
      console.error('Failed to fetch trainings:', error);
      return {
        data: [],
        totalData: 0,
        page: params?.page || 1,
        limit: params?.pageSize || 10,
        totalPages: 0,
      };
    }
  },

  async getTrainingById(id: string): Promise<TrainingData> {
    try {
      const response = await apiClient.get<{
        status: boolean;
        message: string;
        data: TrainingApiResponse['data']['trainings'][0];
      }>(`/village/training/${id}`);

      if (response.status && response.data) {
        return transformTrainingFromAPI(response.data);
      }
      throw new Error('Training not found');
    } catch (error) {
      console.error('Failed to fetch training by ID:', error);
      throw error;
    }
  },

  async createTraining(trainingData: CreateTrainingData): Promise<{
    status: boolean;
    message: string;
  }> {
    const response = await apiClient.post<{
      status: boolean;
      message: string;
      data: TrainingApiResponse['data']['trainings'][0];
    }>('/village/training', trainingData);
    return {
      status: response.status,
      message: response.message,
    };
  },

  async updateTraining(
    trainingData: CreateTrainingData,
    id: string
  ): Promise<{
    status: boolean;
    message: string;
  }> {
    const response = await apiClient.put<{
      status: boolean;
      message: string;
      data: TrainingApiResponse['data']['trainings'][0];
    }>(`/village/training/${id}`, trainingData);
    return {
      status: response.status,
      message: response.message,
    };
  },

  async deleteTraining(id: string): Promise<void> {
    await apiClient.delete(`/village/training/${id}`);
  },
};

// Helper function to transform UI data to API format
export const transformUITrainingForAPI = (
  training: Partial<TrainingData>
): CreateTrainingData => {
  return {
    villageId: training.villageId || '',
    name: training.trainingName || '',
    type: training.trainingType || '',
    date: training.date || '',
    assessment: {
      pre: training.pretest || 0,
      post: training.posttest || 0,
    },
    beneficiaries: {
      gender: {
        men: training.male || 0,
        women: training.female || 0,
      },
      gedsi: {
        elderly: (training.elderly || 0).toString(),
        youth: (training.youth || 0).toString(),
        widow: (training.widow || 0).toString(),
        disabled: (training.disability || 0).toString(),
      },
    },
    stakeholders: {
      ngo: training.ngo || 0,
      government: training.government || 0,
      academation: training.academics || 0,
      privateSector: training.privateSector || 0,
      localCommunity: training.localCommunity || 0,
      others: training.others || 0,
    },
  };
};
