export interface VillageData {
  id: string;
  villageName: string;
  villageCode: string;
  villageCategory: string;
  totalPopulation: number;
  villageLat: number;
  villageLng: number;
  landManageStart: number;
  landManageEnd?: number;
  carbonEmisionStart: number;
  carbonEmisionEnd?: number;
  potency: string;
  climateIssue: string;
  mainSourceOfEconomy: string;
  srnStatus: string;
  // Cat 1
  incomesStart?: number;
  incomesEnd?: number;
  unsustainableLandClearings?: VillagePerMonth[];

  // Cat 2
  incomes?: VillagePerMonth[];
  seedCapital?: number;
}

export interface VillagePerMonth {
  data: number;
  month: string;
  year: number;
}

export type VillageTable = {
  [key in keyof VillageData]: VillageData[key];
};
