import React from 'react';
import { Paper, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { useVillageStore, VillagePageEnum } from '@/stores/villageStore';
import { MonthlyDataPerMonth } from './components/MonthlyDataPerMonth';

export const DetailVillagePage = () => {
  const { updateBreadcrumbs, setPage, selectedVillage, breadcrumbs } =
    useVillageStore();
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    updateBreadcrumbs(VillagePageEnum.DETAIL);
  }, [updateBreadcrumbs]);

  const handleBack = () => {
    setPage(VillagePageEnum.LIST);
    updateBreadcrumbs(VillagePageEnum.LIST);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const villageData = selectedVillage || {
    id: '1',
    villageName: 'Desa Harapan Baru',
    villageLat: -6.2,
    villageLng: 106.816666,
    villageAddress: 'Jl. Raya Desa Harapan Baru No.1',
    villageCode: 'DHB001',
    totalPopulation: 1000,
    totalCarbonEmissions: 50000,
    totalArea: '50 km²',
    totalLandManage: 30,
    isMitigationIntervention: false,
    isAdaptationIntervention: false,
    mitigationIntervention: '',
    adaptationIntervention: '',
    fireIncidents: [],
    incomes: [],
    localInitiatives: [],
  };

  // Mock data for monthly reports
  const monthlyReports = [
    {
      id: 1,
      title: 'Training Fire community',
      type: 'Intervention Type 1',
      date: '23 April 2025',
    },
    {
      id: 2,
      title: 'Training Fire community',
      type: 'Intervention Type 1',
      date: '23 April 2025',
    },
    {
      id: 3,
      title: 'Training Fire community',
      type: 'Intervention Type 1',
      date: '23 April 2025',
    },
    {
      id: 4,
      title: 'Training Fire community',
      type: 'Intervention Type 1',
      date: '23 April 2025',
    },
    {
      id: 5,
      title: 'Training Fire community',
      type: 'Intervention Type 1',
      date: '23 April 2025',
    },
  ];

  const filteredReports = monthlyReports.filter((report) =>
    report.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 3,
      }}
    >
      <Paper
        sx={{
          width: '100%',
          overflow: 'hidden',
          borderRadius: '16px',
          padding: '28px',
        }}
      >
        <Header
          breadcrumbs={breadcrumbs}
          villageData={villageData}
          handleBack={handleBack}
        />
      </Paper>

      <MonthlyDataPerMonth
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filteredReports={filteredReports}
      />
    </Box>
  );
};
