import { z } from 'zod';
import { UserRole, UserStatus } from './user';

// Original schema for creating users
export const userFormSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    role: z.nativeEnum(UserRole).refine((val) => val !== undefined, {
      message: 'Role is required',
    }),
    status: z.nativeEnum(UserStatus).refine((val) => val !== undefined, {
      message: 'Status is required',
    }),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Update schema for editing users (name and email only)
export const userUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
});

// Optional: If you want to allow role/status updates as well
export const userUpdateWithRoleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role: z.nativeEnum(UserRole).refine((val) => val !== undefined, {
    message: 'Role is required',
  }),
  status: z.nativeEnum(UserStatus).refine((val) => val !== undefined, {
    message: 'Status is required',
  }),
});

export type UserFormData = z.infer<typeof userFormSchema>;
export type UserUpdateData = z.infer<typeof userUpdateSchema>;
export type UserUpdateWithRoleData = z.infer<typeof userUpdateWithRoleSchema>;
