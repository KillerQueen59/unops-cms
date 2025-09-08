import { DemositeType } from './demosite';

export interface DemositeFormData {
  title: string;
  description: string;
  type: DemositeType;
  locationName: string;
  story: string;
  isTop10: boolean;
  images: File[];
}
