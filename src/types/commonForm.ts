import { z } from 'zod';

export const numericString = (message: string) =>
  z
    .string()
    .min(1, message)
    .regex(/^\d+$/, 'Must be a valid number')
    .refine((val) => parseInt(val) >= 0, 'Must be a positive number');

export const scoreString = (message: string) =>
  z
    .string()
    .min(1, message)
    .regex(/^\d+$/, 'Must be a valid number')
    .refine((val) => {
      const num = parseInt(val);
      return num >= 0 && num <= 100;
    }, 'Score must be between 0 and 100');
