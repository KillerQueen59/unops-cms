import {
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Button,
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';

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
  return (
    <Paper
      sx={{
        width: '100%',
        overflow: 'hidden',
        borderRadius: '16px',
        padding: '28px',
      }}
    >
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
    </Paper>
  );
};
