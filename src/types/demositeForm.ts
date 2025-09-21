import { DemositeType } from './demosite';

export interface DemositeFormData {
  title: string;
  header: File;
  type: DemositeType;
  name: string;
  story: string;
  link: string;
  photos: File[];
}
