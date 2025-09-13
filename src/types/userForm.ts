import { z } from 'zod';
import { UserRole, UserStatus } from './user';

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

export type UserFormData = z.infer<typeof userFormSchema>;
