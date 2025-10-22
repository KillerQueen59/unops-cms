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
  calendarEventIds?: Record<string, string>; // Maps calendarId to eventId for Google Calendar sync
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
