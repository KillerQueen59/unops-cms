'use client';

import React, { useState } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { CaretLeftIcon, TrashIcon } from '@phosphor-icons/react';
import { EditIcon } from 'lucide-react';
import { BreadcrumbItem, useUserStore } from '@/stores/userStore';
import { CustomBreadcrumbs } from '@/components';
import { User } from '@/types/user';

export const Header = ({
  breadcrumbs,
  userData,
  handleBack,
  handleDelete,
  handleEdit,
}: {
  breadcrumbs: BreadcrumbItem[];
  userData: User;
  handleBack: () => void;
  handleDelete: () => void;
  handleEdit: () => void;
}) => {
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <CustomBreadcrumbs breadcrumbs={breadcrumbs} />
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 4,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <IconButton
            onClick={handleBack}
            sx={{
              border: '1px solid #0092D1',
              borderRadius: '12px',
              width: 48,
              height: 48,
              color: '#0092D1',
            }}
          >
            <CaretLeftIcon />
          </IconButton>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              color: '#374151',
            }}
          >
            {userData.name}
          </Typography>
        </Box>
      </Box>

      {/* User Info Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 4,
          mb: 4,
          px: 2,
        }}
      >
        <Box>
          <Typography
            variant="body2"
            sx={{ color: '#6B7280', fontSize: '13px', mb: 0.5 }}
          >
            Email
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#1F2937', fontWeight: 600, fontSize: '16px' }}
          >
            {userData.email}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="body2"
            sx={{ color: '#6B7280', fontSize: '13px', mb: 0.5 }}
          >
            Name
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#1F2937', fontWeight: 600, fontSize: '16px' }}
          >
            {userData.name}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="body2"
            sx={{ color: '#6B7280', fontSize: '13px', mb: 0.5 }}
          >
            Role
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#1F2937', fontWeight: 600, fontSize: '16px' }}
          >
            {userData.role}
          </Typography>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
          mb: 4,
          px: 2,
        }}
      >
        <Button
          variant="outlined"
          color="error"
          startIcon={<TrashIcon />}
          onClick={handleDelete}
          sx={{
            borderRadius: '12px',
            width: '180px',
            minHeight: '50px',
            px: 3,
          }}
        >
          Delete
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<EditIcon />}
          onClick={handleEdit}
          sx={{
            borderRadius: '12px',
            width: '180px',
            minHeight: '50px',
            px: 3,
          }}
        >
          Edit
        </Button>
      </Box>
    </Box>
  );
};
