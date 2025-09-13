import React from 'react';
import {
  Paper,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useEffect } from 'react';
import { File, FileText } from '@phosphor-icons/react';
import { Header } from './components/Header';
import { ActivityPageEnum, useActivityStore } from '@/stores/activityStore';

export const DetailActivityPage = () => {
  const { updateBreadcrumbs, setPage, selectedActivity, breadcrumbs } =
    useActivityStore();

  useEffect(() => {
    updateBreadcrumbs(ActivityPageEnum.DETAIL);
  }, [updateBreadcrumbs]);

  const handleBack = () => {
    setPage(ActivityPageEnum.LIST);
    updateBreadcrumbs(ActivityPageEnum.LIST);
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
          Documentation
        </Typography>

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
      </Paper>
    </Box>
  );
};
