export interface TrainingData {
  id: string;
  trainingName: string;
  trainingType: string;
  date: string;
  village: string;
  villageId: string;
  // Number of beneficiaries
  male: number;
  female: number;
  elderly: number;
  youth: number;
  disability: number;
  widow: number;
  // Training Assestment
  pretest: number;
  posttest: number;
  // Stakeholders Involved
  ngo: number;
  government: number;
  privateSector: number;
  academics: number;
  localCommunity: number;
  others: number;
}

export type TrainingTable = {
  [key in keyof TrainingData]: TrainingData[key];
};

export type TrainingFilters = {
  searchQuery?: string;
  trainingType?: string;
  village?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
};

// Training API
export interface Training {
  _id: string;
  villageId: string;
  name: string;
  startDate: string;
  endDate: string;
  description?: string;
  status: 'not yet' | 'ongoing' | 'completed';
  trainingType: string; // e.g., 'Online', 'In-Person', 'Hybrid'
  // Beneficiaries
  beneficiaries: {
    male: number;
    female: number;
    elderly: number;
    youth: number;
    disability: number;
    widow: number;
  };
  // Assessment
  assessment: {
    pretest: number;
    posttest: number;
  };
  // Stakeholders
  stakeholders: {
    ngo: number;
    government: number;
    privateSector: number;
    academics: number;
    localCommunity: number;
    others: number;
  };
  // Training-specific metadata
  location?: string;
  facilitator?: string;
  materials?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTrainingData {
  villageId: string;
  name: string;
  startDate: string;
  endDate: string;
  description?: string;
  status: 'not yet' | 'ongoing' | 'completed';
  trainingType: string; // e.g., 'Online', 'In-Person', 'Hybrid'
  beneficiaries: {
    male: number;
    female: number;
    elderly: number;
    youth: number;
    disability: number;
    widow: number;
  };
  assessment: {
    pretest: number;
    posttest: number;
  };
  stakeholders: {
    ngo: number;
    government: number;
    privateSector: number;
    academics: number;
    localCommunity: number;
    others: number;
  };
  location?: string;
  facilitator?: string;
  materials?: string[];
  attachments?: File[]; // Files for upload
}

export interface UpdateTrainingData {
  name?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  status?: 'not yet' | 'ongoing' | 'completed';
  trainingType?: string;
  beneficiaries?: {
    male: number;
    female: number;
    elderly: number;
    youth: number;
    disability: number;
    widow: number;
  };
  assessment?: {
    pretest: number;
    posttest: number;
  };
  stakeholders?: {
    ngo: number;
    government: number;
    privateSector: number;
    academics: number;
    localCommunity: number;
    others: number;
  };
  location?: string;
  facilitator?: string;
  materials?: string[];
  attachments?: File[]; // Files for upload
}

export interface TrainingListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: 'not yet' | 'ongoing' | 'completed';
  type?: 'training' | 'workshop' | 'demosite';
  category?:
    | 'capacity_building'
    | 'infrastructure'
    | 'environmental'
    | 'social'
    | 'economic'
    | 'other';
  trainingType?: string;
  village?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
}

export interface TrainingListResponse {
  data: Training[];
  total: number;
  page: number;
  pageSize: number;
}
export interface TrainingCategoriesResponse {
  data: string[];
}

export interface TrainingResponse {
  status: boolean;
  message: string;
  data: Training;
}
