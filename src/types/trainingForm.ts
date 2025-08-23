import { z } from 'zod';

export const trainingFormSchema = z.object({
  // Detail Training
  trainingName: z.string().min(1, 'Nama training wajib diisi'),
  trainingType: z.string().min(1, 'Tipe training wajib diisi'),
  mandatoryTraining: z.enum(['yes', 'no']),
  therapeuticTraining: z.enum(['yes', 'no']),
  interventionType: z.string().min(1, 'Tipe intervensi wajib diisi'),
  village: z.string().min(1, 'Desa wajib diisi'),

  // Community Participation
  communityParticipationMale: z
    .string()
    .min(1, 'Jumlah populasi pria wajib diisi'),
  communityParticipationFemale: z
    .string()
    .min(1, 'Jumlah populasi wanita wajib diisi'),

  // Community Capacity
  elderlyMale: z.string().min(1, 'Jumlah lansia pria wajib diisi'),
  elderlyFemale: z.string().min(1, 'Jumlah lansia wanita wajib diisi'),
  youthMale: z.string().min(1, 'Jumlah pemuda pria wajib diisi'),
  youthFemale: z.string().min(1, 'Jumlah pemuda wanita wajib diisi'),
  disabilityMale: z.string().min(1, 'Jumlah disabilitas pria wajib diisi'),
  disabilityFemale: z.string().min(1, 'Jumlah disabilitas wanita wajib diisi'),

  // Knowledge Improvement
  preTestScoreMale: z.string().min(1, 'Nilai pre-test pria wajib diisi'),
  preTestScoreFemale: z.string().min(1, 'Nilai pre-test wanita wajib diisi'),
  postTestScoreMale: z.string().min(1, 'Nilai post-test pria wajib diisi'),
  postTestScoreFemale: z.string().min(1, 'Nilai post-test wanita wajib diisi'),
});

export type TrainingFormData = z.infer<typeof trainingFormSchema>;
