import {
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Button,
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { VillageCategory } from '../../constants';
import { useVillageStore } from '@/stores/villageStore';
import { SustainableLandsModal } from './SustainableLandsModal';
import { IncomeModal } from './IncomeModal';
import { useState } from 'react';

// Category 1: Sustainable Lands Report Component
const SustainableLandsReport = ({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingData, setEditingData] = useState<{
    id?: number;
    month: string;
    year: string;
    count: number;
  } | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Mock data for sustainable lands - using state to make it updateable
  const [sustainableLandsData, setSustainableLandsData] = useState([
    {
      id: 1,
      month: 'January 2025',
      date: '02 Feb 2025 10:28:27',
      count: 47,
    },
    {
      id: 2,
      month: 'December 2024',
      date: '02 Feb 2025 10:28:27',
      count: 27,
    },
    {
      id: 3,
      month: 'November 2024',
      date: '02 Feb 2025 10:28:27',
      count: 4,
    },
    {
      id: 4,
      month: 'October 2024',
      date: '02 Feb 2025 10:28:27',
      count: 38,
    },
    {
      id: 5,
      month: 'September 2024',
      date: '02 Feb 2025 10:28:27',
      count: 16,
    },
  ]);

  const handleAddData = () => {
    setIsEditMode(false);
    setEditingData(null);
    setShowModal(true);
  };

  const handleEditData = (data: {
    id?: number;
    month: string;
    date: string;
    count: number;
  }) => {
    // Transform display data to modal format
    const [monthName, year] = data.month.split(' ');
    setEditingData({
      id: data.id,
      month: monthName,
      year: year,
      count: data.count,
    });
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleSaveData = (data: {
    month: string;
    year: string;
    count: number;
  }) => {
    if (isEditMode && editingData) {
      // Update existing data
      setSustainableLandsData((prev) =>
        prev.map((item) =>
          item.id === editingData.id
            ? {
                ...item,
                month: `${data.month} ${data.year}`,
                count: data.count,
                date: new Date()
                  .toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })
                  .replace(/,/g, ''),
              }
            : item
        )
      );
    } else {
      // Add new data
      const newId =
        Math.max(...sustainableLandsData.map((item) => item.id)) + 1;
      setSustainableLandsData((prev) => [
        ...prev,
        {
          id: newId,
          month: `${data.month} ${data.year}`,
          date: new Date()
            .toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })
            .replace(/,/g, ''),
          count: data.count,
        },
      ]);
    }
    setShowModal(false);
  };

  const getExistingEntries = () => {
    return sustainableLandsData.map((item) => {
      const [month, year] = item.month.split(' ');
      return { month, year };
    });
  };

  const filteredData = sustainableLandsData.filter((item) =>
    item.month.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        Monthly Sustainable Lands Report
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <TextField
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: 300,
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
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddData}
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
          Add Data for This Month
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filteredData.map((item) => (
          <Box
            key={item.id}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 3,
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              backgroundColor: '#FAFAFA',
              '&:hover': {
                backgroundColor: '#F3F4F6',
              },
            }}
          >
            <Box>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  color: '#1F2937',
                  mb: 0.5,
                }}
              >
                {item.month}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#6B7280',
                  fontSize: '14px',
                }}
              >
                {item.date}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#3B82F6',
                  fontSize: '32px',
                }}
              >
                {item.count}
              </Typography>
              <IconButton
                onClick={() => handleEditData(item)}
                sx={{
                  color: '#6B7280',
                  '&:hover': {
                    color: '#374151',
                    backgroundColor: '#F3F4F6',
                  },
                }}
              >
                <EditIcon />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Sustainable Lands Modal */}
      <SustainableLandsModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveData}
        existingData={editingData || undefined}
        existingEntries={getExistingEntries()}
        isEdit={isEditMode}
      />
    </>
  );
};

// Category 2: Income Report Component
const IncomeReport = ({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingData, setEditingData] = useState<{
    id?: number;
    month: string;
    year: string;
    amount: number;
  } | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Mock data for income report - using state to make it updateable
  const [incomeData, setIncomeData] = useState([
    {
      id: 1,
      month: 'January 2025',
      date: '02 Feb 2025 10:28:27',
      amount: 6543000,
      trend: 'down', // 'up' or 'down'
    },
    {
      id: 2,
      month: 'December 2024',
      date: '02 Feb 2025 10:28:27',
      amount: 8210000,
      trend: 'up',
    },
    {
      id: 3,
      month: 'November 2024',
      date: '02 Feb 2025 10:28:27',
      amount: 7890000,
      trend: 'up',
    },
    {
      id: 4,
      month: 'October 2024',
      date: '02 Feb 2025 10:28:27',
      amount: 5670000,
      trend: 'down',
    },
    {
      id: 5,
      month: 'September 2024',
      date: '02 Feb 2025 10:28:27',
      amount: 9345000,
      trend: 'up',
    },
  ]);

  const handleAddData = () => {
    setIsEditMode(false);
    setEditingData(null);
    setShowModal(true);
  };

  const handleEditData = (data: {
    id?: number;
    month: string;
    date: string;
    amount: number;
  }) => {
    // Transform display data to modal format
    const [monthName, year] = data.month.split(' ');
    setEditingData({
      id: data.id,
      month: monthName,
      year: year,
      amount: data.amount,
    });
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleSaveData = (data: {
    month: string;
    year: string;
    amount: number;
  }) => {
    if (isEditMode && editingData) {
      // Update existing data
      setIncomeData((prev) =>
        prev.map((item) =>
          item.id === editingData.id
            ? {
                ...item,
                month: `${data.month} ${data.year}`,
                amount: data.amount,
                date: new Date()
                  .toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })
                  .replace(/,/g, ''),
                // Determine trend by comparing with previous month
                trend:
                  prev.length > 1
                    ? data.amount >
                      prev[prev.findIndex((p) => p.id === item.id) - 1]?.amount
                      ? 'up'
                      : 'down'
                    : 'up',
              }
            : item
        )
      );
    } else {
      // Add new data
      const newId = Math.max(...incomeData.map((item) => item.id)) + 1;
      setIncomeData((prev) => [
        ...prev,
        {
          id: newId,
          month: `${data.month} ${data.year}`,
          date: new Date()
            .toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })
            .replace(/,/g, ''),
          amount: data.amount,
          trend: 'up', // Default trend for new entries
        },
      ]);
    }
    setShowModal(false);
  };

  const getExistingEntries = () => {
    return incomeData.map((item) => {
      const [month, year] = item.month.split(' ');
      return { month, year };
    });
  };

  const filteredData = incomeData.filter((item) =>
    item.month.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return `IDR ${amount.toLocaleString('id-ID')}`;
  };

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
        Monthly Income Report
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <TextField
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: 300,
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
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddData}
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
          Add Data for This Month
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filteredData.map((item) => (
          <Box
            key={item.id}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 3,
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              backgroundColor: '#FAFAFA',
              '&:hover': {
                backgroundColor: '#F3F4F6',
              },
            }}
          >
            <Box>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  color: '#1F2937',
                  mb: 0.5,
                }}
              >
                {item.month}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#6B7280',
                  fontSize: '14px',
                }}
              >
                {item.date}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: '#3B82F6',
                  fontSize: '24px',
                }}
              >
                {formatCurrency(item.amount)}
              </Typography>
              <Box
                sx={{
                  color: item.trend === 'up' ? '#10B981' : '#EF4444',
                  fontSize: '16px',
                }}
              >
                {item.trend === 'up' ? '↗' : '↘'}
              </Box>
              <IconButton
                onClick={() => handleEditData(item)}
                sx={{
                  color: '#6B7280',
                  '&:hover': {
                    color: '#374151',
                    backgroundColor: '#F3F4F6',
                  },
                }}
              >
                <EditIcon />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Income Modal */}
      <IncomeModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveData}
        existingData={editingData || undefined}
        existingEntries={getExistingEntries()}
        isEdit={isEditMode}
      />
    </>
  );
};

export const MonthlyDataPerMonth = ({
  activeTab,
  handleTabChange,
  searchTerm,
  setSearchTerm,
  filteredReports,
}: {
  activeTab: number;
  handleTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredReports: Array<{
    id: number;
    title: string;
    type: string;
    date: string;
  }>;
}) => {
  const { selectedVillage } = useVillageStore();

  // Determine which component to render based on village category
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
      {villageCategory === VillageCategory.Category1 ? (
        <SustainableLandsReport
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      ) : villageCategory === VillageCategory.Category2 ? (
        <IncomeReport searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      ) : (
        // Default fallback - show the original tabs interface
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
            Monthly Data Report
          </Typography>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="Fire Incidents" />
              <Tab label="Mitigation Performance" />
              <Tab label="Adaptation Performance" />
            </Tabs>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <TextField
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                width: 300,
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
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                backgroundColor: '#0EA5E9',
                '&:hover': {
                  backgroundColor: '#0284C7',
                },
                minWidth: 120,
                height: 54,
              }}
            >
              Add Data for This Month
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filteredReports.map((report) => (
              <Box
                key={report.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  backgroundColor: '#FAFAFA',
                }}
              >
                <Box>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color: '#1F2937',
                      mb: 0.5,
                    }}
                  >
                    {report.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#6B7280',
                      fontSize: '14px',
                    }}
                  >
                    {report.type} • {report.date}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </>
      )}
    </Paper>
  );
};
