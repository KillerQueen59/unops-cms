import { southSumatraRegencies, villagesByRegency, allVillages } from './constants';

export const getRegencyOptions = () => {
  return southSumatraRegencies.map((regency) => ({
    value: regency.code,
    label: regency.name,
  }));
};

export const getVillageOptions = (regencyCode: string) => {
  const villages = villagesByRegency[regencyCode] || [];
  return villages.map((village) => ({
    value: village.code,
    label: village.name,
  }));
};

export const getVillageCodeFromName = (
  regencyCode: string,
  villageName: string
) => {
  const villages = villagesByRegency[regencyCode] || [];
  const village = villages.find((v) => v.name === villageName);
  return village?.code || '';
};

export const getRegencyName = (regencyCode: string) => {
  const regency = southSumatraRegencies.find((r) => r.code === regencyCode);
  return regency?.name || '';
};

export const getVillageName = (regencyCode: string, villageCode: string) => {
  const villages = villagesByRegency[regencyCode] || [];
  const village = villages.find((v) => v.code === villageCode);
  return village?.name || '';
};

// Statistics
export const getTotalVillagesCount = () => {
  return Object.values(villagesByRegency).reduce(
    (total, villages) => total + villages.length,
    0
  );
};

export const getVillagesCountByRegency = (regencyCode: string) => {
  return villagesByRegency[regencyCode]?.length || 0;
};

// Get village centroid coordinates by village code
export const getVillageCentroid = (villageCode: string) => {
  const village = allVillages.find((v) => v.code === villageCode);
  return village?.centroid || null;
};
