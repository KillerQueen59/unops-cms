import { allVillages, southSumatraRegencies } from '../village/constants';

export const getLocationName = (villageCode: string): string => {
  if (villageCode === '16') {
    return 'South Sumatera';
  }

  const splittedCode = villageCode.split('.');
  if (splittedCode.length == 2) {
    const selectedRegency = southSumatraRegencies.find(
      (regency) => regency.code === splittedCode.join('.')
    );
    return selectedRegency ? selectedRegency.name : 'Unknown Regency';
  }

  if (splittedCode.length == 4) {
    const selectedVillage = allVillages.find(
      (village) => village.code === villageCode
    );
    return selectedVillage ? selectedVillage.name : 'Unknown Village';
  }

  return 'Unknown Location';
};
