export enum TrainingType {
  Livelihood = 'livelihood',
  AdaptationMitigation = 'adaptationMitigation',
}

export const trainingTypeOptions = [
  {
    value: TrainingType.AdaptationMitigation,
    label: 'Adaptation & Mitigation',
  },
  { value: TrainingType.Livelihood, label: 'Livelihood' },
];
