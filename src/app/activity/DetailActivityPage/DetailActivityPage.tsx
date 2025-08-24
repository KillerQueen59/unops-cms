import React from 'react';
import {
  Paper,
  Box,
  Tabs,
  Tab,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { File, FileText } from '@phosphor-icons/react';
import { Header } from './components/Header';
import { ActivityPageEnum, useActivityStore } from '@/stores/activityStore';

export const DetailActivityPage = () => {
  const { updateBreadcrumbs, setPage, selectedActivity, breadcrumbs } =
    useActivityStore();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    updateBreadcrumbs(ActivityPageEnum.DETAIL);
  }, [updateBreadcrumbs]);

  const handleBack = () => {
    setPage(ActivityPageEnum.LIST);
    updateBreadcrumbs(ActivityPageEnum.LIST);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const activityData = selectedActivity || {
    id: '',
    activityName: '',
    activityCategory: '',
    startDate: '',
    endDate: '',
    status: 'active',
    progress: 0,
    description: '',
    files: [],
  };

  // Mock activity log data
  const activityLogs = [
    {
      id: 1,
      title: 'Changed End Date from 10 September 2024 to 15 September 2024',
      subtitle: 'Mohammad Hafidzan • 3 hari yang lalu',
      type: 'date-change',
    },
    {
      id: 2,
      title: 'Changed Status from Inactive to Active',
      subtitle: 'Mohammad Hafidzan • 3 hari yang lalu',
      type: 'status-change',
    },
    {
      id: 3,
      title: 'Changed Status from Active to In Progress',
      subtitle: 'Mohammad Hafidzan • 3 hari yang lalu',
      type: 'status-change',
    },
  ];

  // Mock documentation files
  const documentationFiles = [
    {
      id: 1,
      name: 'Dokumentasi rapat pelatihan ternak lele.jpg',
      date: '23 April 2025 • 10:41',
      type: 'image',
    },
    {
      id: 2,
      name: 'Foto bersama rapat pelatihan ternak lele.png',
      date: '23 April 2025 • 10:41',
      type: 'image',
    },
    {
      id: 3,
      name: 'Draft materi pelatihan.pdf',
      date: '23 April 2025 • 10:41',
      type: 'pdf',
    },
  ];

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
          activityData={activityData}
          handleBack={handleBack}
        />
      </Paper>

      {/* Activity Log Section */}
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
            fontWeight: 'bold',
            color: '#374151',
            mb: 3,
          }}
        >
          Activity Log
        </Typography>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            mb: 3,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '14px',
              color: '#6B7280',
              '&.Mui-selected': {
                color: '#1F2937',
              },
            },
          }}
        >
          <Tab label="Activity Log" />
          <Tab label="Documentation" />
        </Tabs>

        {activeTab === 0 && (
          <List sx={{ padding: 0 }}>
            {activityLogs.map((log, index) => (
              <ListItem
                key={log.id}
                sx={{
                  padding: '16px 0',
                  borderBottom:
                    index < activityLogs.length - 1
                      ? '1px solid #F3F4F6'
                      : 'none',
                  alignItems: 'flex-start',
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: '#F59E0B',
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 'medium', color: '#374151' }}
                    >
                      {log.title}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {log.subtitle}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}

        {activeTab === 1 && (
          <List sx={{ padding: 0 }}>
            {documentationFiles.map((doc, index) => (
              <ListItem
                key={doc.id}
                sx={{
                  padding: '16px 0',
                  borderBottom:
                    index < documentationFiles.length - 1
                      ? '1px solid #F3F4F6'
                      : 'none',
                  alignItems: 'flex-start',
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                  {doc.type === 'pdf' ? (
                    <FileText size={24} color="#EF4444" weight="fill" />
                  ) : (
                    <File size={24} color="#F59E0B" weight="fill" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 'medium', color: '#374151' }}
                    >
                      {doc.name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {doc.date}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};
