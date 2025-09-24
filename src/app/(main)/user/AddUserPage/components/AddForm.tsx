import React from 'react';
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
import { UserFormData, userFormSchema } from '@/types/userForm';
import { Role } from '@/types/role';
import { useCreateUser } from '@/hooks/useUserData';
import { useUserStore } from '@/stores/userStore';
import { UserRole } from '@/types/user';

interface AddFormProps {
  roles: Role[];
  rolesLoading: boolean;
}

export const AddForm = ({ roles }: AddFormProps) => {
  const { navigateToList } = useUserStore();
  const createUserMutation = useCreateUser();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      role: UserRole.ADMIN.toLowerCase(),
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      await createUserMutation.mutateAsync({
        userData: data,
        roles: roles,
      });
      navigateToList();
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const handleCancel = () => {
    reset();
    navigateToList();
  };

  return (
    <Box sx={{ maxWidth: 800 }}>
      {createUserMutation.isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to create user. Please try again.
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Name and Email Row */}
        <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
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

        {/* Password Row */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
          {/* Password */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{ mb: 1, fontWeight: 'medium' }}
            >
              Password
            </Typography>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="password"
                  placeholder="Input password..."
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    },
                  }}
                />
              )}
            />
          </Box>

          {/* Confirm Password */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{ mb: 1, fontWeight: 'medium' }}
            >
              Confirm Password
            </Typography>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="password"
                  placeholder="Confirm password..."
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
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
            disabled={createUserMutation.isPending}
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
            disabled={createUserMutation.isPending}
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
            {createUserMutation.isPending ? 'Creating...' : 'Submit'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};
