export enum TraininType {
  Livelihood = 'livelihood',
  AdaptationMitigation = 'adaptationMitigation',
}

export const trainingTypeOptions = [
  { value: TraininType.AdaptationMitigation, label: 'Adaptation & Mitigation' },
  { value: TraininType.Livelihood, label: 'Livelihood' },
];
