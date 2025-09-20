export enum TraininType {
  Livelihood = 'livelihood',
  AdaptationMitigation = 'adaptation_mitigation',
}

export const trainingTypeOptions = [
  { value: TraininType.AdaptationMitigation, label: 'Adaptation & Mitigation' },
  { value: TraininType.Livelihood, label: 'Livelihood' },
];
