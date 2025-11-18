export interface DemositeData {
  id: string;
  header: string;
  title: string;
  name: string;
  description: string;
  photos: string[];
  story: string;
  link: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  isTop10: boolean;
}

export type DemositeTable = {
  [key in keyof DemositeData]: DemositeData[key];
};
