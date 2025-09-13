'use client';

import React, { useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUpdateUser } from '@/hooks/useUserData';
import { useUserStore } from '@/stores/userStore';
import { UserRole, UserStatus } from '@/types/user';

const editUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  role: z.nativeEnum(UserRole),
  status: z.nativeEnum(UserStatus),
});

type EditUserForm = z.infer<typeof editUserSchema>;

export const Form = () => {
  const { selectedUser, navigateToDetail } = useUserStore();
  const updateUserMutation = useUpdateUser();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditUserForm>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: '',
      email: '',
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
    },
  });

  // Set form values when selectedUser changes
  useEffect(() => {
    if (selectedUser) {
      reset({
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedUser.role,
        status: selectedUser.status,
      });
    }
  }, [selectedUser, reset]);

  const onSubmit = async (data: EditUserForm) => {
    if (!selectedUser) return;

    try {
      await updateUserMutation.mutateAsync({
        id: selectedUser.id,
        data: data,
      });

      // Navigate back to detail page
      navigateToDetail(selectedUser);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleCancel = () => {
    if (selectedUser) {
      navigateToDetail(selectedUser);
    }
  };

  if (!selectedUser) return null;

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      {updateUserMutation.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to update user. Please try again.
        </Alert>
      )}

      <Box
        sx={{
          display: 'flex',
          gap: 3,
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {/* Left Column */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            Basic Information
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Full Name"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  fullWidth
                />
              )}
            />
          </Box>
        </Box>

        {/* Right Column */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            Account Settings
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.role}>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, color: 'text.secondary' }}
                  >
                    Role
                  </Typography>
                  <Select {...field}>
                    <MenuItem value={UserRole.SUPER_ADMIN}>
                      {UserRole.SUPER_ADMIN}
                    </MenuItem>
                    <MenuItem value={UserRole.ADMIN}>{UserRole.ADMIN}</MenuItem>
                    <MenuItem value={UserRole.USER}>{UserRole.USER}</MenuItem>
                  </Select>
                  {errors.role && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 0.5 }}
                    >
                      {errors.role.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.status}>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, color: 'text.secondary' }}
                  >
                    Status
                  </Typography>
                  <Select {...field}>
                    <MenuItem value={UserStatus.ACTIVE}>
                      {UserStatus.ACTIVE}
                    </MenuItem>
                    <MenuItem value={UserStatus.INACTIVE}>
                      {UserStatus.INACTIVE}
                    </MenuItem>
                  </Select>
                  {errors.status && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 0.5 }}
                    >
                      {errors.status.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />
          </Box>
        </Box>
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
        <Button variant="outlined" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={updateUserMutation.isPending}
        >
          {updateUserMutation.isPending ? 'Updating...' : 'Update User'}
        </Button>
      </Box>
    </Box>
  );
};
