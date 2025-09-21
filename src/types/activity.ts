export interface ActivityData {
  id: string;
  activityName: string;
  villageId: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'not yet' | 'ongoing' | 'completed';
  percentage: string;
  type?: 'workshop' | 'training' | 'demosite';
  files: File[] | string[];
  category?: string;
}

export type ActivityTable = {
  [key in keyof ActivityData]: ActivityData[key];
};
