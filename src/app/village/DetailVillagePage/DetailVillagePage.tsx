import React from 'react';
import { Paper, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { useVillageStore } from '@/stores/villageStore';
import { MonthlyDataPerMonth } from './components/MonthlyDataPerMonth';
import { PageEnum } from '@/constants/page';

export const DetailVillagePage = () => {
  const { updateBreadcrumbs, setPage, selectedVillage, breadcrumbs } =
    useVillageStore();
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    updateBreadcrumbs(PageEnum.DETAIL, selectedVillage?.villageName);
  }, [updateBreadcrumbs]);

  const handleBack = () => {
    setPage(PageEnum.LIST);
    updateBreadcrumbs(PageEnum.LIST);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const villageData = selectedVillage || {
    id: '',
    villageName: 'Unknown Village',
    villageCode: 'N/A',
    villageCategory: 'N/A',
    totalPopulation: 0,
    villageLat: 0,
    villageLng: 0,
    landManageStart: 0,
    landManageEnd: 0,
    carbonEmisionStart: 0,
    carbonEmisionEnd: 0,
    potency: 'N/A',
    climateIssue: 'N/A',
    mainSourceOfEconomy: 'N/A',
    srnStatus: 'N/A',
    // Cat 1
    incomesStart: 0,
    incomesEnd: 0,
    unsustainableLandClearings: [],
    // Cat 2
    incomes: [],
    seedCapital: 0,
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
      {/* Category 1 Monthly Sustainable Lands Report */}

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
