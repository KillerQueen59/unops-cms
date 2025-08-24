export interface ActivityData {
  id: string;
  activityName: string;
  activityCategory: string; // enum soon
  description: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive';
  progress: number;
  files: File[];
}

export type ActivityTable = {
  [key in keyof ActivityData]: ActivityData[key];
};
