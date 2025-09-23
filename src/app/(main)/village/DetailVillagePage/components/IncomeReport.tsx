/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  Typography,
  Box,
  TextField,
  InputAdornment,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import { useVillageStore } from '@/stores/villageStore';
import { IncomeModal } from './IncomeModal';
import { VillagerDataModal } from './VillagerDataModal';
import { MonthlyIncomeModal } from './MonthlyIncomeModal';
import { useState } from 'react';
import {
  useIncomeTrackingData,
  useAddIncomeTrackingData,
  useUpdateIncomeTrackingData,
  useDeleteIncomeTrackingData,
} from '@/hooks/useVillageData';

export interface DisplayIncomeData {
  _id?: string;
  id: undefined;
  villageId: string;
  villagerId?: string;
  villagerName?: string;
  month: string;
  date: string;
  amount: number;
  trend: string;
  rawMonth: string;
}

interface GroupedIncomeData {
  month: string;
  rawMonth: string;
  totalAmount: number;
  entries: DisplayIncomeData[];
  villagerCount: number;
}

import { EyeIcon } from '@phosphor-icons/react';
import React from 'react';

const IncomeReport = ({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}) => {
  const { selectedVillage } = useVillageStore();
  const [showModal, setShowModal] = useState(false);
  const [showVillagerModal, setShowVillagerModal] = useState(false);
  const [showMonthlyModal, setShowMonthlyModal] = useState(false);
  const [selectedMonthData, setSelectedMonthData] =
    useState<GroupedIncomeData | null>(null);

  // API queries and mutations
  const {
    data: apiResponse,
    isLoading,
    error,
  } = useIncomeTrackingData({
    page: 1,
    pageSize: 100,
    search: selectedVillage?.villageCode,
    sortBy: 'month',
  });

  const addMutation = useAddIncomeTrackingData();
  const updateMutation = useUpdateIncomeTrackingData();
  const deleteMutation = useDeleteIncomeTrackingData();

  // Transform API data to display format
  const incomeData: DisplayIncomeData[] =
    apiResponse?.data.incomes?.map((item: any) => {
      const [monthNum, year] = item.month.split('-');
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      const monthName = monthNames[parseInt(monthNum) - 1];

      const villagerName = item.villager?.name || 'Unknown Villager';
      const villagerId = item.villager?._id;

      return {
        _id: item._id,
        id: undefined,
        villageId: selectedVillage?.villageCode || '',
        villagerId,
        villagerName,
        month: `${monthName} ${year}`,
        rawMonth: item.month,
        date: new Date(item.createdAt)
          .toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
          .replace(/,/g, ''),
        amount: item.count,
        trend: 'up',
      };
    }) || [];

  // Group income data by month
  const groupedIncomeData: GroupedIncomeData[] = React.useMemo(() => {
    const groups: { [key: string]: GroupedIncomeData } = {};

    incomeData.forEach((item) => {
      if (!groups[item.rawMonth]) {
        groups[item.rawMonth] = {
          month: item.month,
          rawMonth: item.rawMonth,
          totalAmount: 0,
          entries: [],
          villagerCount: 0,
        };
      }

      groups[item.rawMonth].entries.push(item);
      groups[item.rawMonth].totalAmount += item.amount;
    });

    Object.values(groups).forEach((group) => {
      const uniqueVillagers = new Set(
        group.entries.map((entry) => entry.villagerId)
      );
      group.villagerCount = uniqueVillagers.size;
      group.entries.sort((a, b) =>
        (a.villagerName || '').localeCompare(b.villagerName || '')
      );
    });

    return Object.values(groups).sort((a, b) => {
      const [aMonth, aYear] = a.rawMonth.split('-');
      const [bMonth, bYear] = b.rawMonth.split('-');
      const aDate = new Date(parseInt(aYear), parseInt(aMonth) - 1);
      const bDate = new Date(parseInt(bYear), parseInt(bMonth) - 1);
      return bDate.getTime() - aDate.getTime();
    });
  }, [incomeData]);

  // Filter grouped data
  const filteredGroupedData = groupedIncomeData.filter((group) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      group.month.toLowerCase().includes(searchLower) ||
      group.entries.some((entry) =>
        entry.villagerName?.toLowerCase().includes(searchLower)
      )
    );
  });

  const handleAddData = () => {
    setShowModal(true);
  };

  const handleViewVillagerData = () => {
    setShowVillagerModal(true);
  };

  const handleMonthCardClick = (monthData: GroupedIncomeData) => {
    setSelectedMonthData(monthData);
    setShowMonthlyModal(true);
  };

  const handleSaveData = async (data: {
    month: string;
    year: string;
    entries: {
      villagerId: string;
      villagerName: string;
      amount: number;
    }[];
  }) => {
    if (!selectedVillage?.villageCode) return;

    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const monthNum = (monthNames.indexOf(data.month) + 1)
      .toString()
      .padStart(2, '0');
    const monthString = `${monthNum}-${data.year}`;

    const bulkPayload = {
      datas: data.entries.map((entry) => ({
        villagerId: entry.villagerId,
        month: monthString,
        income: entry.amount,
      })),
    };
    addMutation.mutate(bulkPayload);
    setShowModal(false);
  };

  const handleUpdateIncome = (
    incomeId: string,
    data: { villagerId: string; month: string; income: number }
  ) => {
    updateMutation.mutate({
      incomeId,
      data,
    });
  };

  const handleDeleteIncome = (incomeId: string) => {
    deleteMutation.mutate(incomeId);
  };

  const getExistingEntries = () => {
    return incomeData.map((item) => {
      const [month, year] = item.month.split(' ');
      return {
        month,
        year,
        villagerId: item.villagerId,
      };
    });
  };

  const formatCurrency = (amount: number) => {
    return `IDR ${amount.toLocaleString('id-ID')}`;
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">Failed to load income data</Alert>
      </Box>
    );
  }

  return (
    <>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: '#1F2937',
          mb: 3,
          fontSize: '18px',
        }}
      >
        Monthly Income Report by Villager
      </Typography>

      {/* Show mutation errors */}
      {(addMutation.error || updateMutation.error || deleteMutation.error) && (
        <Box sx={{ mb: 2 }}>
          <Alert severity="error">
            {addMutation.error?.message ||
              updateMutation.error?.message ||
              deleteMutation.error?.message ||
              'An error occurred'}
          </Alert>
        </Box>
      )}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <TextField
          placeholder="Search by month or villager name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: 350,
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon sx={{ color: '#9CA3AF' }} />
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<EyeIcon />}
            onClick={handleViewVillagerData}
            sx={{
              borderColor: '#0EA5E9',
              color: '#0EA5E9',
              '&:hover': {
                borderColor: '#0284C7',
                backgroundColor: 'rgba(14, 165, 233, 0.04)',
              },
              minWidth: 180,
              height: 54,
              borderRadius: '12px',
            }}
          >
            View Villager Data
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddData}
            disabled={addMutation.isPending}
            sx={{
              backgroundColor: '#0EA5E9',
              '&:hover': {
                backgroundColor: '#0284C7',
              },
              minWidth: 180,
              height: 54,
              borderRadius: '12px',
            }}
          >
            {addMutation.isPending ? 'Adding...' : 'Add Income Data'}
          </Button>
        </Box>
      </Box>

      {/* Monthly Cards List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filteredGroupedData.map((group) => (
          <Card
            key={group.rawMonth}
            sx={{
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: '#0EA5E9',
                boxShadow: '0 4px 12px -4px rgba(14, 165, 233, 0.2)',
                transform: 'translateY(-1px)',
              },
            }}
            onClick={() => handleMonthCardClick(group)}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: '#1F2937',
                      fontSize: '18px',
                      mb: 0.5,
                    }}
                  >
                    {group.month}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#6B7280',
                      fontSize: '14px',
                    }}
                  >
                    {group.villagerCount} villager
                    {group.villagerCount !== 1 ? 's' : ''} •{' '}
                    {group.entries.length} entr
                    {group.entries.length !== 1 ? 'ies' : 'y'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#6B7280',
                        fontSize: '12px',
                        mb: 0.5,
                      }}
                    >
                      Total Amount
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: '#3B82F6',
                        fontSize: '20px',
                      }}
                    >
                      {formatCurrency(group.totalAmount)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}

        {filteredGroupedData.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 6,
              color: '#6B7280',
            }}
          >
            <Typography variant="body1">
              {searchTerm
                ? 'No income data found matching your search.'
                : 'No income data available yet.'}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {!searchTerm && 'Click "Add Income Data" to get started.'}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Add Income Modal */}
      <IncomeModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveData}
        existingEntries={getExistingEntries()}
        isEdit={false}
        villageId={selectedVillage?.villageCode || ''}
      />

      {/* Monthly Income Management Modal */}
      <MonthlyIncomeModal
        open={showMonthlyModal}
        onClose={() => {
          setShowMonthlyModal(false);
          setSelectedMonthData(null);
        }}
        monthData={selectedMonthData}
        villageId={selectedVillage?.villageCode || ''}
        onUpdate={handleUpdateIncome}
        onDelete={handleDeleteIncome}
        onAdd={handleSaveData}
        isUpdating={updateMutation.isPending}
        isDeleting={deleteMutation.isPending}
      />

      {/* Villager Data Modal */}
      <VillagerDataModal
        open={showVillagerModal}
        onClose={() => setShowVillagerModal(false)}
        villageId={selectedVillage?.villageCode || ''}
      />
    </>
  );
};

export default IncomeReport;
