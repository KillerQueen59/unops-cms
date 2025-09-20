import { z } from 'zod';

export const dataFormSchema = z
  .object({
    documentName: z.string().min(1, 'Document name is required'),
    category: z.enum(['regency', 'other']),
    regency: z.string().optional(),
    link: z.string().optional(),
    file: z
      .instanceof(File)
      .refine(
        (file) => file.size <= 5 * 1024 * 1024,
        'File size must be less than 5MB'
      )
      .refine(
        (file) =>
          ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'].includes(
            file.type
          ),
        'Only JPG, PNG, and PDF files are allowed'
      ),
  })
  .refine(
    (data) => {
      // If category is 'regency', regency must be provided
      if (data.category === 'regency' && !data.regency) {
        return false;
      }
      return true;
    },
    {
      message: 'Regency is required when category is Regency',
      path: ['regency'],
    }
  );

export type DataFormData = z.infer<typeof dataFormSchema>;
