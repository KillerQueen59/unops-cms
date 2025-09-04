import React from 'react';
import { TrainingPageEnum, useTrainingStore } from '@/stores/trainingStore';
import { Paper, Box, Typography } from '@mui/material';
import {
  PercentIcon,
  PersonArmsSpreadIcon,
  PersonSimpleHikeIcon,
  UsersFourIcon,
  WheelchairIcon,
} from '@phosphor-icons/react';
import { useEffect } from 'react';
import { ParticipantCard } from './components/ParticipantCard';
import { Header } from './components/Header';

export const DetailTrainingPage = () => {
  const { updateBreadcrumbs, setPage, selectedTraining, breadcrumbs } =
    useTrainingStore();

  const handleBack = () => {
    setPage(TrainingPageEnum.LIST);
    updateBreadcrumbs(TrainingPageEnum.LIST);
  };

  const trainingData = selectedTraining || {
    id: '1',
    trainingName: 'Pelatihan Keterampilan Warga Desa',
    trainingType: 'Training 1',
    village: 'Desa Harapan Baru',
    startDate: '10 April 2025',
    endDate: '-',
    communityParticipationMale: 123,
    communityParticipationFemale: 123,
    elderlyMale: 123,
    elderlyFemale: 123,
    youthMale: 123,
    youthFemale: 123,
    disabilityMale: 123,
    disabilityFemale: 123,
    preTestScoreMale: 123,
    preTestScoreFemale: 123,
    postTestScoreMale: 123,
    postTestScoreFemale: 123,
  };

  useEffect(() => {
    updateBreadcrumbs(TrainingPageEnum.DETAIL, trainingData.trainingName);
  }, [updateBreadcrumbs]);

  const participantCards = [
    {
      title: 'Community Participation',
      maleCount: parseInt(
        trainingData.communityParticipationMale?.toString() || '0'
      ),
      femaleCount: parseInt(
        trainingData.communityParticipationFemale?.toString() || '0'
      ),
      icon: <UsersFourIcon size={20} />,
      color: '#E0F2FE',
    },
    {
      title: 'Elderly',
      maleCount: parseInt(trainingData.elderlyMale?.toString() || '0'),
      femaleCount: parseInt(trainingData.elderlyFemale?.toString() || '0'),
      icon: <PersonSimpleHikeIcon size={20} />,
      color: '#E0F2FE',
    },
    {
      title: 'Youth',
      maleCount: parseInt(trainingData.youthMale?.toString() || '0'),
      femaleCount: parseInt(trainingData.youthFemale?.toString() || '0'),
      icon: <PersonArmsSpreadIcon size={20} />,
      color: '#E0F2FE',
    },
    {
      title: 'Disability',
      maleCount: parseInt(trainingData.disabilityMale?.toString() || '0'),
      femaleCount: parseInt(trainingData.disabilityFemale?.toString() || '0'),
      icon: <WheelchairIcon size={20} />,
      color: '#E0F2FE',
    },
    {
      title: 'Pre-Test Score Above 70%',
      maleCount: parseInt(trainingData.preTestScoreMale?.toString() || '0'),
      femaleCount: parseInt(trainingData.preTestScoreFemale?.toString() || '0'),
      icon: <PercentIcon size={20} />,
      color: '#E0F2FE',
    },
    {
      title: 'Post-Test Score Under 70%',
      maleCount: parseInt(trainingData.postTestScoreMale?.toString() || '0'),
      femaleCount: parseInt(
        trainingData.postTestScoreFemale?.toString() || '0'
      ),
      icon: <PercentIcon size={20} />,
      color: '#E0F2FE',
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
          trainingData={trainingData}
          handleBack={handleBack}
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
              fontSize: '18px',
            }}
          >
            Participant Demographics
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
            {participantCards.map((card, index) => (
              <ParticipantCard key={index} {...card} />
            ))}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
