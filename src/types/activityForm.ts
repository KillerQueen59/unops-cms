import { z } from 'zod';

export const activityFormSchema = z
  .object({
    activityName: z
      .string()
      .min(1, 'Activity name is required')
      .min(3, 'Activity name must be at least 3 characters')
      .max(100, 'Activity name must not exceed 100 characters'),

    activityCategory: z.string().min(1, 'Activity category is required'),
    villageCode: z.string().min(1, 'Location is required'),

    description: z
      .string()
      .min(1, 'Description is required')
      .min(10, 'Description must be at least 10 characters'),
    startDate: z
      .string()
      .min(1, 'Start date is required')
      .refine((date) => {
        const parsed = new Date(date);
        return !isNaN(parsed.getTime());
      }, 'Invalid start date format'),

    endDate: z
      .string()
      .min(1, 'End date is required')
      .refine((date) => {
        const parsed = new Date(date);
        return !isNaN(parsed.getTime());
      }, 'Invalid end date format'),

    status: z.enum(['not yet', 'ongoing', 'completed'], {
      message: 'Status must be either not yet, ongoing, or completed',
    }),

    type: z.enum(
      ['workshop', 'training', 'demosite', 'meeting', 'field visit', 'fgd'],
      {
        message: 'Type must be either workshop, training, or demosite',
      }
    ),
    percentage: z
      .string()
      .min(1, 'Percentage is required')
      .refine((val) => !isNaN(Number(val)), 'Percentage must be a valid number')
      .refine((val) => Number(val) >= 0, 'Percentage cannot be less than 0')
      .refine((val) => Number(val) <= 100, 'Percentage cannot be more than 100')
      .refine(
        (val) => Number.isInteger(Number(val)),
        'Percentage must be a whole number'
      ),

    files: z.array(z.any()),

    remarks: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.length >= 5,
        'Remarks must be at least 5 characters if provided'
      ),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      return startDate <= endDate;
    },
    {
      message: 'End date must be after or equal to start date',
      path: ['endDate'],
    }
  );

// Form schema for creating new activity (without id)
export const createActivityFormSchema = activityFormSchema;

// Form schema for updating existing activity (all fields optional except id)
export const updateActivityFormSchema = z
  .object({
    id: z.string().min(1, 'ID is required'),
  })
  .merge(activityFormSchema.partial());

export type ActivityFormData = z.infer<typeof activityFormSchema>;
export type CreateActivityFormData = z.infer<typeof createActivityFormSchema>;
export type UpdateActivityFormData = z.infer<typeof updateActivityFormSchema>;
