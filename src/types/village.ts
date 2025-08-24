export interface VillageData {
  id: string;
  villageName: string;
  villageCode: string;
  totalPopulation: number;
  villageAddress: string;
  villageLat: number;
  villageLng: number;
  totalLandManage: number;
  totalCarbonEmissions: number;
  isMitigationIntervention: boolean;
  isAdaptationIntervention: boolean;
  fireIncidents: FireIncidentData[];
  incomes: Income[];
  localInitiatives: LocalInitiative[];
}

export interface VillagePerMonth {
  month: string;
  year: number;
}

export interface FireIncidentData extends VillagePerMonth {
  data: number;
}

export interface Income extends VillagePerMonth {
  data: number;
}

export interface LocalInitiative extends VillagePerMonth {
  stakeholder: {
    government: number;
    localCommunity: number;
    privateSector: number;
    ngo: number;
    academics: number;
    other: number;
  };
}

export type VillageTable = {
  [key in keyof VillageData]: VillageData[key];
};
