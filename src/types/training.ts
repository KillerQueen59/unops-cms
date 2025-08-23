export interface TrainingData {
  id: string;
  trainingName: string;
  trainingType: string;
  startDate: string;
  endDate: string;
  village: string;
  communityParticipationMale: number;
  communityParticipationFemale: number;
  elderlyMale: number;
  elderlyFemale: number;
  youthMale: number;
  youthFemale: number;
  disabilityMale: number;
  disabilityFemale: number;
  preTestScoreMale: number;
  preTestScoreFemale: number;
  postTestScoreMale: number;
  postTestScoreFemale: number;
}

export type TrainingTable = {
  [key in keyof TrainingData]: TrainingData[key];
};
