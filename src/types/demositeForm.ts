import { z } from 'zod';
import { DemositeType } from './demosite';

// File validation helpers
const isValidImageFile = (file: File) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  return validTypes.includes(file.type);
};

const isValidDocumentFile = (file: File) => {
  const validTypes = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  return validTypes.includes(file.type);
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const demositeFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),

  header: z
    .instanceof(File, { message: 'Header photo is required' })
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      'Header photo must be less than 5MB'
    )
    .refine(
      (file) => isValidImageFile(file),
      'Header photo must be JPG or PNG'
    ),

  type: z.nativeEnum(DemositeType, {
    message: 'Please select a valid type',
  }),

  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),

  story: z
    .string()
    .min(1, 'Story is required')
    .min(10, 'Story must be at least 10 characters')
    .max(5000, 'Story must be less than 5000 characters'),

  link: z
    .string()
    .optional()
    .refine(
      (val) => !val || z.string().url().safeParse(val).success,
      'Please enter a valid URL (e.g., https://example.com)'
    ),

  photos: z
    .array(
      z
        .instanceof(File)
        .refine(
          (file) => file.size <= MAX_FILE_SIZE,
          'Each file must be less than 5MB'
        )
        .refine(
          (file) => isValidDocumentFile(file),
          'Files must be JPG, PNG, PDF, or Word documents'
        )
    )
    .min(1, 'At least one photo is required')
    .max(10, 'Maximum 10 photos allowed'),
});

// Schema for edit mode where header is optional if existing
export const demositeEditFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),

  header: z
    .instanceof(File)
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      'Header photo must be less than 5MB'
    )
    .refine((file) => isValidImageFile(file), 'Header photo must be JPG or PNG')
    .optional(),

  type: z.nativeEnum(DemositeType, {
    message: 'Please select a valid type',
  }),

  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),

  story: z
    .string()
    .min(1, 'Story is required')
    .min(10, 'Story must be at least 10 characters')
    .max(5000, 'Story must be less than 5000 characters'),

  link: z
    .string()
    .optional()
    .refine(
      (val) => !val || z.string().url().safeParse(val).success,
      'Please enter a valid URL (e.g., https://example.com)'
    ),

  photos: z
    .array(
      z
        .instanceof(File)
        .refine(
          (file) => file.size <= MAX_FILE_SIZE,
          'Each file must be less than 5MB'
        )
        .refine(
          (file) => isValidDocumentFile(file),
          'Files must be JPG, PNG, PDF, or Word documents'
        )
    )
    .min(1, 'At least one photo is required')
    .max(10, 'Maximum 10 photos allowed'),
});

export type DemositeFormData = z.infer<typeof demositeFormSchema>;
export type DemositeEditFormData = z.infer<typeof demositeEditFormSchema>;
