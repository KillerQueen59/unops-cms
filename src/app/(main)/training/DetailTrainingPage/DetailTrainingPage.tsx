'use client';

import React, { useState } from 'react';
import { useTrainingStore } from '@/stores/trainingStore';
import { Paper, Box, Typography, Alert } from '@mui/material';
import {
  BankIcon,
  DetectiveIcon,
  DotsThreeIcon,
  GenderFemaleIcon,
  GenderMaleIcon,
  GraduationCapIcon,
  PersonArmsSpreadIcon,
  PersonSimpleCircleIcon,
  PersonSimpleHikeIcon,
  TreeStructureIcon,
  UsersFourIcon,
  WheelchairIcon,
} from '@phosphor-icons/react';
import { useEffect } from 'react';
import { ParticipantCard } from './components/ParticipantCard';
import { Header } from './components/Header';
import { PageEnum } from '@/constants/page';
import { ConfirmationModal } from '@/components';
import { useDeleteTraining } from '@/hooks/useTrainingData';

export const DetailTrainingPage = ({
  villageOptions,
}: {
  villageOptions: { label: string; value: string }[];
}) => {
  const {
    updateBreadcrumbs,
    setPage,
    navigateToEdit,
    selectedTraining,
    breadcrumbs,
  } = useTrainingStore();

  const handleBack = () => {
    setPage(PageEnum.LIST);
    updateBreadcrumbs(PageEnum.LIST);
  };

  const trainingData = selectedTraining;
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const deleteTrainingMutation = useDeleteTraining();

  useEffect(() => {
    if (!trainingData) return;
    updateBreadcrumbs(PageEnum.DETAIL, trainingData.trainingName);
  }, [trainingData, updateBreadcrumbs]);

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (trainingData?.id) {
        await deleteTrainingMutation.mutateAsync(trainingData.id);
        setShowDeleteModal(false);
        handleBack();
      } else {
        throw new Error('Training ID is missing.');
      }
    } catch (error) {
      console.error('Failed to delete training:', error);
    }
  };

  const numberOfBeneficiaries = [
    {
      title: 'Male',
      count: trainingData?.male || 0,
      icon: <GenderMaleIcon size={20} />,
      color: '#E0F2FE',
    },
    {
      title: 'Female',
      count: trainingData?.female || 0,
      icon: <GenderFemaleIcon size={20} />,
      color: '#E0F2FE',
    },
    {
      title: 'Elderly',
      count: trainingData?.elderly || 0,
      icon: <PersonSimpleHikeIcon size={20} />,
      color: '#E0F2FE',
    },
    {
      title: 'Youth',
      count: trainingData?.youth || 0,
      icon: <PersonArmsSpreadIcon size={20} />,
      color: '#E0F2FE',
    },
    {
      title: 'Disability',
      count: trainingData?.disability || 0,
      icon: <WheelchairIcon size={20} />,
      color: '#E0F2FE',
    },
    {
      title: 'Widow',
      count: trainingData?.widow || 0,
      icon: <PersonSimpleCircleIcon size={20} />,
      color: '#E0F2FE',
    },
  ];

  const trainingAssessment = [
    {
      title: 'Pre-test',
      count: trainingData?.pretest || 0,
      icon: <PersonArmsSpreadIcon size={20} />,
      color: '#E0F2FE',
    },
    {
      title: 'Post-Test',
      count: trainingData?.posttest || 0,
      icon: <PersonArmsSpreadIcon size={20} />,
      color: '#E0F2FE',
    },
  ];

  const stakeholderInvolve = [
    {
      title: 'Government',
      count: trainingData?.government || 0,
      icon: <BankIcon size={20} />,
      color: '#E0F2FE',
    },
    {
      title: 'Academics',
      count: trainingData?.academics || 0,
      icon: <GraduationCapIcon size={20} />,
      color: '#E0F2FE',
    },
    {
      title: 'Private Sector',
      count: trainingData?.privateSector || 0,
      icon: <DetectiveIcon size={20} />,
      color: '#E0F2FE',
    },
    {
      title: 'Local Community',
      count: trainingData?.localCommunity || 0,
      icon: <UsersFourIcon size={20} />,
      color: '#E0F2FE',
    },
    {
      title: 'NGO',
      count: trainingData?.ngo || 0,
      icon: <TreeStructureIcon size={20} />,
      color: '#E0F2FE',
    },
    {
      title: 'Others',
      count: trainingData?.others || 0,
      icon: <DotsThreeIcon size={20} />,
      color: '#E0F2FE',
    },
  ];

  if (!trainingData) {
    return (
      <Alert severity="info" sx={{ borderRadius: '8px' }}>
        No training selected. Please go back to the list and select a training
        to view details.
      </Alert>
    );
  }

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
          trainingData={trainingData}
          handleBack={handleBack}
          handleDelete={() => {
            setShowDeleteModal(true);
          }}
          handleEdit={() => navigateToEdit(trainingData)}
          villageOptions={villageOptions}
        />
      </Paper>

      <Paper
        sx={{
          width: '100%',
          overflow: 'hidden',
          borderRadius: '16px',
          padding: '28px',
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: '#1F2937',
              mb: 3,
              fontSize: '24px',
            }}
          >
            Number of Beneficiaries
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 3,
            }}
          >
            {numberOfBeneficiaries.map((card) => (
              <ParticipantCard
                key={card.title}
                title={card.title}
                count={card.count}
                icon={card.icon}
                color={card.color}
              />
            ))}
          </Box>
        </Box>
      </Paper>

      <Paper
        sx={{
          width: '100%',
          overflow: 'hidden',
          borderRadius: '16px',
          padding: '28px',
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: '#1F2937',
              mb: 3,
              fontSize: '24px',
            }}
          >
            Training Assessment
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(2, 1fr)',
              },
              gap: 3,
            }}
          >
            {trainingAssessment.map((card) => (
              <ParticipantCard
                key={card.title}
                title={card.title}
                count={card.count}
                icon={card.icon}
                color={card.color}
              />
            ))}
          </Box>
        </Box>
      </Paper>

      <Paper
        sx={{
          width: '100%',
          overflow: 'hidden',
          borderRadius: '16px',
          padding: '28px',
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: '#1F2937',
              mb: 3,
              fontSize: '24px',
            }}
          >
            Stakeholders Participation
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 3,
            }}
          >
            {stakeholderInvolve.map((card) => (
              <ParticipantCard
                key={card.title}
                title={card.title}
                count={card.count}
                icon={card.icon}
                color={card.color}
              />
            ))}
          </Box>
        </Box>
      </Paper>
      <ConfirmationModal
        open={showDeleteModal}
        onClose={handleDeleteCancel}
        onSecondaryButtonClick={handleDeleteCancel}
        onPrimaryButtonClick={() => {
          handleDeleteConfirm();
          handleBack();
        }}
        title="Delete Training?"
        message={`Are you sure you want to delete "${trainingData?.trainingName}"? This action cannot be undone.`}
        primaryButtonText={'Delete'}
        secondaryButtonText="Cancel"
      />
    </Box>
  );
};
