import { Paper } from '@mui/material';
import { useVillageStore } from '@/stores/villageStore';
import SustainableLandsReport from './SustainableLandsReport';
import IncomeReport from './IncomeReport';
import { VillageCategory } from '../../constants';

export const MonthlyDataPerMonth = ({
  searchTerm,
  setSearchTerm,
}: {
  activeTab: number;
  handleTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}) => {
  const { selectedVillage } = useVillageStore();

  const villageCategory = selectedVillage?.villageCategory.name;

  return (
    <Paper
      sx={{
        width: '100%',
        overflow: 'hidden',
        borderRadius: '16px',
        padding: '28px',
      }}
    >
      {villageCategory === VillageCategory.Category1 ? (
        <SustainableLandsReport
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      ) : villageCategory === VillageCategory.Category2 ? (
        <IncomeReport searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      ) : null}
    </Paper>
  );
};
