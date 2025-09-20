import { Paper } from '@mui/material';
import { useVillageStore } from '@/stores/villageStore';
import { CategoryEnum } from '@/constants/category';
import SustainableLandsReport from './SustainableLandsReport';
import IncomeReport from './IncomeReport';

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

  const villageCategory = selectedVillage?.villageCategory;

  return (
    <Paper
      sx={{
        width: '100%',
        overflow: 'hidden',
        borderRadius: '16px',
        padding: '28px',
      }}
    >
      {villageCategory === CategoryEnum.CATEGORY_1 ? (
        <SustainableLandsReport
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      ) : villageCategory === CategoryEnum.CATEGORY_2 ? (
        <IncomeReport searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      ) : null}
    </Paper>
  );
};
