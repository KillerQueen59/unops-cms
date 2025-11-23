// Types for handling both File objects and API file responses
export interface ApiFile {
  url: string;
  title: string;
  mimetype: string;
}

export interface FileWithMetadata extends File {
  isExisting?: false;
}

export interface ApiFileWithMetadata extends ApiFile {
  isExisting: true;
}

export type UnifiedFile = FileWithMetadata | ApiFileWithMetadata;

// Updated ActivityData interface
export interface ActivityData {
  id: string;
  activityName: string;
  villageId: string;
  description: string;
  remarks: string;
  startDate: string;
  endDate: string;
  status: 'not yet' | 'ongoing' | 'completed';
  percentage: string;
  type?: 'workshop' | 'training' | 'demosite';
  files: UnifiedFile[];
  category?: string;
  event_id?: string;
}

// Helper functions for type checking
export const isApiFile = (file: UnifiedFile): file is ApiFileWithMetadata => {
  return 'isExisting' in file && file.isExisting === true;
};

export const isFileObject = (file: UnifiedFile): file is FileWithMetadata => {
  return file instanceof File;
};

// Helper to get file properties regardless of type
export const getFileTitle = (file: UnifiedFile): string => {
  return isApiFile(file) ? file.title : file.name;
};

export const getFileMimetype = (file: UnifiedFile): string => {
  return isApiFile(file) ? file.mimetype : file.type;
};

export const getFileId = (file: UnifiedFile, index: number): string => {
  if (isApiFile(file)) {
    return file.title;
  } else {
    return `${file.name}-${file.lastModified}-${index}`;
  }
};
export type ActivityTable = {
  [key in keyof ActivityData]: ActivityData[key];
};

// Activity API interfaces based on the curl commands
export interface Activity {
  _id: string;
  villageId: string;
  name: string;
  start_date: string;
  end_date: string;
  description: string;
  remarks?: string;
  status: 'not yet' | 'ongoing' | 'completed';
  type: 'training' | 'workshop' | 'demosite';
  percentage: number;
  files?: ApiFile[];
  event_id?: string;
  createdAt: string;
  updatedAt: string;
  village?: {
    _id: string;
    name: string;
    areaId: string;
  };
  category?: {
    _id: string;
    name: string;
  };
}

export interface CreateActivityData {
  villageId: string;
  name: string;
  start_date: string;
  end_date: string;
  description: string;
  remarks?: string;
  status: 'not yet' | 'ongoing' | 'completed';
  type: 'training' | 'workshop' | 'demosite';
  percentage: number;
  categoryId?: string;
}

export interface UpdateActivityData {
  villageId?: string;
  name?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  remarks?: string;
  status?: 'not yet' | 'ongoing' | 'completed';
  type?: 'training' | 'workshop' | 'demosite';
  percentage?: number;
  categoryId?: string;
}

// Pagination interfaces
export interface ActivityListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  type?: string;
  village?: string;
  sortBy?: string;
  startDate?: string;
  endDate?: string;
}

// API Response interfaces
export interface ActivityApiResponse {
  status: boolean;
  message: string;
  data: {
    activities: Activity[];
    totalData: number;
    page: number;
    totalPages: number;
  };
}

export interface SingleActivityApiResponse {
  status: boolean;
  message: string;
  data?: Activity;
}

export interface CreateActivityApiResponse {
  status: boolean;
  message: string;
  data?: {
    _id?: string;
  };
}

export interface ActivityCategoriesResponse {
  status: boolean;
  message: string;
  data: string[];
}
