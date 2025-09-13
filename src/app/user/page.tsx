'use client';

import {
  Paper,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  TuneOutlined,
} from '@mui/icons-material';
import React from 'react';
import DataTable from '@/components/DataTable/DataTable';
import { useUserPageImpl } from './useUserPageImpl';
import { UserPageEnum } from '@/stores/userStore';
import { AddUserPage } from './AddUserPage/AddUserPage';
import { DetailUserPage } from './DetailUserPage/DetailUserPage';
import { EditUserPage } from './EditUserPage/EditUserPage';
import { User as UserType } from '@/types/user';

export default function UserPage() {
  const { state, action } = useUserPageImpl();

  const { searchQuery, users, error, isLoading, columns, totalUsers, page } =
    state;

  const { handleAddNew, handleOpenFilter, setSearchQuery } = action;

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Failed to load users. Please try again.
      </Alert>
    );
  }

  // Route to different pages based on current page state
  if (page === UserPageEnum.ADD) {
    return <AddUserPage />;
  }

  if (page === UserPageEnum.DETAIL) {
    return <DetailUserPage />;
  }

  if (page === UserPageEnum.EDIT) {
    return <EditUserPage />;
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '16px' }}>
      {/* Header Section */}
      <Box sx={{ padding: '28px' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: '#374151',
              }}
            >
              User Management
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: '#6B7280',
                fontSize: '18px',
              }}
            >
              {isLoading
                ? 'Loading...'
                : `This page shows a list of ${totalUsers} users`}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              gap: '20px',
              alignItems: 'center',
              flexGrow: 1,
            }}
          >
            <TextField
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                minWidth: 480,
                height: 60,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="outlined"
              onClick={handleOpenFilter}
              startIcon={<TuneOutlined />}
              size="large"
              sx={{
                minWidth: 120,
                height: 54,
                borderColor: '#D1D5DB',
                color: '#6B7280',
                textTransform: 'none',
                fontWeight: 500,
                borderRadius: '12px',
                '&:hover': {
                  borderColor: '#9CA3AF',
                  backgroundColor: '#F9FAFB',
                },
              }}
            >
              Filter
            </Button>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddNew}
            startIcon={<AddIcon />}
            size="large"
            sx={{
              minWidth: 140,
              height: 54,
              transform: 'translateY(-2px)',
              '&.MuiButton-root': {
                borderRadius: '12px',
              },
              backgroundColor: '#0EA5E9',
              '&:hover': {
                backgroundColor: '#0284C7',
              },
            }}
          >
            Add New
          </Button>
        </Box>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DataTable<UserType>
          data={users}
          columns={columns}
          title="User Management"
          searchable={true}
          filterable={true}
          pageSize={10}
          pageSizeOptions={[5, 10, 25, 50]}
          stickyHeader={true}
          maxHeight={600}
          externalGlobalFilter={searchQuery}
          setExternalGlobalFilter={setSearchQuery}
        />
      )}
    </Paper>
  );
}
