import { z } from 'zod';

export const villagePerMonthSchema = z.object({
  data: z.number().min(0, 'Data cannot be negative'),
  month: z.string().min(1, 'Month is required'),
  year: z
    .number()
    .min(2000, 'Year must be at least 2000')
    .max(2100, 'Year must be at most 2100'),
});

export const villageDataSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  villageName: z.string().min(1, 'Village name is required'),
  villageCode: z.string().min(1, 'Village code is required'),
  villageCategory: z.string().min(1, 'Village category is required'),
  // totalPopulation: z.number().min(1, 'Total population must be greater than 0'),
  villageLat: z
    .number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90'),
  villageLng: z
    .number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180'),
  landManageStart: z
    .string()
    .min(1, 'Initial managed land is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'Initial managed land must be a number and cannot be negative',
    }),
  landManageEnd: z
    .string()
    .refine((val) => val === '' || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: 'Final managed land must be a number and cannot be negative',
    })
    .optional(),
  carbonEmisionStart: z
    .string()
    .min(1, 'Initial carbon emission is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message:
        'Initial carbon emission must be a number and cannot be negative',
    }),
  carbonEmisionEnd: z
    .string()
    .refine((val) => val === '' || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: 'Final carbon emission must be a number and cannot be negative',
    })
    .optional(),
  potency: z.string().min(1, 'Potential is required'),
  climateIssue: z.string().min(1, 'Climate issue is required'),
  mainSourceOfEconomy: z.string().min(1, 'Main source of economy is required'),
  srnStatus: z.string().min(1, 'SRN status is required'),

  // Cat 1 - exactly as in your interface
  incomesStart: z
    .string()
    .refine((val) => val === '' || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: 'Initial income must be a number and cannot be negative',
    })
    .optional(),
  incomesEnd: z
    .string()
    .refine((val) => val === '' || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: 'Final income must be a number and cannot be negative',
    })
    .optional(),
  unsustainableLandClearings: z.array(villagePerMonthSchema).optional(),

  // Cat 2 - exactly as in your interface
  incomes: z.array(villagePerMonthSchema).optional(),
  seedCapital: z
    .string()
    .refine((val) => val === '' || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: 'Seed capital must be a number and cannot be negative',
    })
    .optional(),
});

// Create a function to validate village form with category information
export const createVillageFormSchema = (
  villageCategories: { _id: string; name: string }[]
) =>
  villageDataSchema
    .omit({ id: true })
    .refine((data) => !(data.villageLat === 0 && data.villageLng === 0), {
      message:
        'Village location must be selected (cannot be 0.000000, 0.000000)',
      path: ['villageLat'], // This will show the error on the latitude field
    })
    .superRefine((data, ctx) => {
      // Find the category by ID
      const category = villageCategories.find(
        (cat) => cat._id === data.villageCategory
      );
      const categoryName = category?.name;

      // Conditional validation based on village category
      if (categoryName === 'category1') {
        // For Category1: make only incomesStart required
        if (!data.incomesStart || data.incomesStart.trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Initial income is required for Category 1',
            path: ['incomesStart'],
          });
        }
      } else if (categoryName === 'category2') {
        // For Category2: make seedCapital required
        if (!data.seedCapital || data.seedCapital.trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Seed capital is required for Category 2',
            path: ['seedCapital'],
          });
        }
      }
    });

// Keep the original schema for backward compatibility
export const villageFormSchema = villageDataSchema
  .omit({ id: true })
  .refine((data) => !(data.villageLat === 0 && data.villageLng === 0), {
    message: 'Village location must be selected (cannot be 0.000000, 0.000000)',
    path: ['villageLat'], // This will show the error on the latitude field
  });

export type VillageData = z.infer<typeof villageDataSchema>;
export type VillageFormData = z.infer<
  ReturnType<typeof createVillageFormSchema>
>;
export type VillagePerMonth = z.infer<typeof villagePerMonthSchema>;

export type VillageTable = {
  [key in keyof VillageData]: VillageData[key];
};
