import { z } from 'zod';

export const villagePerMonthSchema = z.object({
  month: z.string().min(1, 'Bulan wajib diisi'),
  year: z
    .number()
    .min(2000, 'Tahun harus minimal 2000')
    .max(2100, 'Tahun harus maksimal 2100'),
});

export const fireIncidentSchema = villagePerMonthSchema.extend({
  data: z.number().min(0, 'Jumlah kebakaran tidak boleh negatif'),
});

export const incomeSchema = villagePerMonthSchema.extend({
  data: z.number().min(0, 'Pendapatan tidak boleh negatif'),
});

export const stakeholderSchema = z.object({
  government: z.number().min(0, 'Jumlah pemerintah tidak boleh negatif'),
  localCommunity: z
    .number()
    .min(0, 'Jumlah komunitas lokal tidak boleh negatif'),
  privateSector: z.number().min(0, 'Jumlah sektor swasta tidak boleh negatif'),
  ngo: z.number().min(0, 'Jumlah NGO tidak boleh negatif'),
  academics: z.number().min(0, 'Jumlah akademisi tidak boleh negatif'),
  other: z.number().min(0, 'Jumlah lainnya tidak boleh negatif'),
});

export const localInitiativeSchema = villagePerMonthSchema.extend({
  stakeholder: stakeholderSchema,
});

export const villageFormSchema = z.object({
  villageName: z.string().min(1, 'Nama desa wajib diisi'),
  villageCode: z.string().min(1, 'Kode desa wajib diisi'),
  totalPopulation: z.number().min(1, 'Total populasi harus lebih dari 0'),
  villageAddress: z.string().min(1, 'Alamat desa wajib diisi'),

  villageLat: z
    .number()
    .min(-90, 'Latitude harus antara -90 dan 90')
    .max(90, 'Latitude harus antara -90 dan 90'),
  villageLng: z
    .number()
    .min(-180, 'Longitude harus antara -180 dan 180')
    .max(180, 'Longitude harus antara -180 dan 180'),

  totalLandManage: z
    .number()
    .min(0, 'Total lahan yang dikelola tidak boleh negatif'),
  totalCarbonEmissions: z
    .number()
    .min(0, 'Total emisi karbon tidak boleh negatif'),

  isMitigationIntervention: z.boolean(),
  isAdaptationIntervention: z.boolean(),
});

export const fireIncidentFormSchema = z.object({
  fireIncidents: z
    .array(fireIncidentSchema)
    .min(1, 'Minimal satu data kebakaran diperlukan'),
});

export const incomeFormSchema = z.object({
  incomes: z
    .array(incomeSchema)
    .min(1, 'Minimal satu data pendapatan diperlukan'),
});

export const localInitiativeFormSchema = z.object({
  localInitiatives: z
    .array(localInitiativeSchema)
    .min(1, 'Minimal satu data inisiatif lokal diperlukan'),
});

export const villageFullFormSchema = villageFormSchema.extend({
  fireIncidents: z.array(fireIncidentSchema).optional().default([]),
  incomes: z.array(incomeSchema).optional().default([]),
  localInitiatives: z.array(localInitiativeSchema).optional().default([]),
});

export type VillageFormData = z.infer<typeof villageFormSchema>;
export type VillagePerMonthFormData = z.infer<typeof villagePerMonthSchema>;
export type FireIncidentFormData = z.infer<typeof fireIncidentFormSchema>;
export type IncomeFormData = z.infer<typeof incomeFormSchema>;
export type LocalInitiativeFormData = z.infer<typeof localInitiativeFormSchema>;
export type VillageFullFormData = z.infer<typeof villageFullFormSchema>;
export type StakeholderFormData = z.infer<typeof stakeholderSchema>;
