import React, { useEffect } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserUpdateData, userUpdateSchema } from '@/types/userForm';
import { User } from '@/types/user';
import { useUpdateUser } from '@/hooks/useUserData';
import { useUserStore } from '@/stores/userStore';

export const EditForm = ({ selectedUser }: { selectedUser: User }) => {
  const { navigateToList } = useUserStore();
  const updateUserMutation = useUpdateUser();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserUpdateData>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  // Set form values when selectedUser changes
  useEffect(() => {
    if (selectedUser) {
      reset({
        name: selectedUser.name,
        email: selectedUser.email,
      });
    }
  }, [selectedUser, reset]);

  const onSubmit = async (data: UserUpdateData) => {
    try {
      await updateUserMutation.mutateAsync({
        id: selectedUser.id,
        userData: data,
      });
      navigateToList();
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleCancel = () => {
    reset();
    navigateToList();
  };

  return (
    <Box>
      {updateUserMutation.isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to update user. Please try again.
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Name and Email Row */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
          {/* Name */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{ mb: 1, fontWeight: 'medium' }}
            >
              Name
            </Typography>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  placeholder="Input name..."
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    },
                  }}
                />
              )}
            />
          </Box>

          {/* Email */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{ mb: 1, fontWeight: 'medium' }}
            >
              Email
            </Typography>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="email"
                  placeholder="Input email..."
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    },
                  }}
                />
              )}
            />
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={handleCancel}
            disabled={updateUserMutation.isPending}
            sx={{
              minWidth: 120,
              height: 48,
              borderColor: '#D1D5DB',
              color: '#6B7280',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                borderColor: '#9CA3AF',
                backgroundColor: '#F9FAFB',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={updateUserMutation.isPending}
            sx={{
              minWidth: 120,
              height: 48,
              backgroundColor: '#0EA5E9',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: '#0284C7',
              },
            }}
          >
            {updateUserMutation.isPending ? 'Updating...' : 'Update'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};
