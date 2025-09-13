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
