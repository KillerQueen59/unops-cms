'use client';

import React, { useMemo, useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { useEffect } from 'react';
import { Header } from './components/Header';
import { useActivityStore } from '@/stores/activityStore';
import { useVillages } from '@/hooks/useVillageData';
import { ConfirmationModal } from '@/components';
import { useDeleteActivity } from '@/hooks/useActivityData';
import { useFileDownload } from '@/hooks/useFileDownload';
import { DataFile } from '@/types/data';
import {
  UnifiedFile,
  isApiFile,
  getFileTitle,
  getFileMimetype,
} from '@/types/activity';
import { File, FileText, Download } from '@phosphor-icons/react';
import toast from 'react-hot-toast';
import { PageEnum } from '@/constants/page';

export const DetailActivityPage = () => {
  const {
    updateBreadcrumbs,
    setPage,
    navigateToEdit,
    selectedActivity,
    breadcrumbs,
  } = useActivityStore();

  useEffect(() => {
    updateBreadcrumbs(PageEnum.DETAIL);
  }, [updateBreadcrumbs]);

  const handleBack = () => {
    setPage(PageEnum.LIST);
    updateBreadcrumbs(PageEnum.LIST);
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const deleteActivityMutation = useDeleteActivity();

  const { downloadFile, isDownloading } = useFileDownload();

  const { data: villagesResponse } = useVillages();
  const villages = villagesResponse?.data || [];

  const villageOptions = villages.map((village) => ({
    label: village.villageName,
    value: village.villageCode,
    category: village.categoryName,
  }));

  const category = useMemo(() => {
    if (!selectedActivity) return '';
    const village = villageOptions.find(
      (village) => village.value === selectedActivity.villageId
    );
    return village?.category || '';
  }, [selectedActivity, villageOptions]);

  const villageName = useMemo(() => {
    if (!selectedActivity) return '';
    const village = villageOptions.find(
      (village) => village.value === selectedActivity.villageId
    );
    return village?.label || '';
  }, [selectedActivity, villageOptions]);

  const activityData = selectedActivity || {
    id: '',
    activityName: '',
    activityCategory: '',
    startDate: '',
    endDate: '',
    status: 'not yet',
    percentage: '0',
    description: '',
    type: 'demosite',
    files: [],
    villageId: '',
    category: '',
    remarks: '',
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteActivityMutation.mutateAsync(activityData.id);
      setShowDeleteModal(false);
      handleBack();
    } catch (error) {
      console.error('Failed to delete activity:', error);
    }
  };

  const handleDownload = async (file: UnifiedFile) => {
    try {
      // Only handle download for API files (existing files with URLs)
      if (isApiFile(file)) {
        // Convert file object to DataFile format expected by useFileDownload
        const dataFile: DataFile = {
          _id: file.title,
          title: file.title,
          documentName: file.title,
          fileName: file.title,
          fileUrl: file.url.startsWith('http') ? file.url : `${file.url}`,
          mimetype: file.mimetype,
          areaId: '', // Add required fields with default values
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };

        const success = await downloadFile(dataFile);
        if (success) {
          toast.success('Download started');
        } else {
          toast.error('Download failed');
        }
      } else {
        // Handle regular File objects differently if needed
        toast.error("Cannot download files that haven't been uploaded yet");
      }
    } catch {
      toast.error('An error occurred during download');
    }
  };

  // Using helper functions from types/activity

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return <FileText size={24} color="#EF4444" weight="fill" />;
    } else if (fileType.includes('image')) {
      return <File size={24} color="#F59E0B" weight="fill" />;
    }
    return <File size={24} color="#6B7280" weight="fill" />;
  };

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
          category={category}
          handleDelete={() => {
            setShowDeleteModal(true);
          }}
          handleEdit={() => navigateToEdit(activityData)}
        />
      </Paper>

      {/* Documentation Section */}
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

        {selectedActivity?.files && selectedActivity.files.length > 0 ? (
          <List sx={{ padding: 0 }}>
            {selectedActivity.files.map((file, index) => {
              const fileName = getFileTitle(file);
              const fileMimeType = getFileMimetype(file);

              return (
                <ListItem
                  key={`${fileName}-${index}`}
                  sx={{
                    padding: '16px 0',
                    borderBottom:
                      index < selectedActivity.files.length - 1
                        ? '1px solid #F3F4F6'
                        : 'none',
                    alignItems: 'center',
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {getFileIcon(fileMimeType)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 'medium', color: '#374151' }}
                      >
                        {fileName}
                      </Typography>
                    }
                    secondary={
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          mt: 0.5,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            backgroundColor: '#F3F4F6',
                            color: '#6B7280',
                            px: 1,
                            py: 0.25,
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                          }}
                        >
                          {fileMimeType.split('/')[1]}
                        </Typography>
                      </Box>
                    }
                  />
                  <IconButton
                    onClick={() => handleDownload(file)}
                    disabled={isDownloading(fileName)}
                    sx={{
                      color: '#0EA5E9',
                      '&:hover': {
                        backgroundColor: '#F0F9FF',
                      },
                    }}
                  >
                    {isDownloading(fileName) ? (
                      <CircularProgress size={20} />
                    ) : (
                      <Download size={20} />
                    )}
                  </IconButton>
                </ListItem>
              );
            })}
          </List>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 6,
              textAlign: 'center',
            }}
          >
            <File size={48} color="#9CA3AF" weight="light" />
            <Typography
              variant="body1"
              sx={{
                color: '#6B7280',
                mt: 2,
              }}
            >
              No documents available
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#9CA3AF',
                mt: 1,
              }}
            >
              Files uploaded for this activity will appear here
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={showDeleteModal}
        onClose={handleDeleteCancel}
        onSecondaryButtonClick={handleDeleteCancel}
        onPrimaryButtonClick={() => {
          handleDeleteConfirm();
          handleBack();
        }}
        title="Delete Activity?"
        message={`Are you sure you want to delete "${selectedActivity?.activityName}"? This action cannot be undone.`}
        primaryButtonText={'Delete'}
        secondaryButtonText="Cancel"
      />
    </Box>
  );
};
