import { z } from 'zod';

export const villagePerMonthSchema = z.object({
  data: z.number().min(0, 'Data tidak boleh negatif'),
  month: z.string().min(1, 'Bulan wajib diisi'),
  year: z
    .number()
    .min(2000, 'Tahun harus minimal 2000')
    .max(2100, 'Tahun harus maksimal 2100'),
});

export const villageDataSchema = z.object({
  id: z.string().min(1, 'ID wajib diisi'),
  villageName: z.string().min(1, 'Nama desa wajib diisi'),
  villageCode: z.string().min(1, 'Kode desa wajib diisi'),
  villageCategory: z.string().min(1, 'Kategori desa wajib diisi'),
  // totalPopulation: z.number().min(1, 'Total populasi harus lebih dari 0'),
  villageLat: z
    .number()
    .min(-90, 'Latitude harus antara -90 dan 90')
    .max(90, 'Latitude harus antara -90 dan 90'),
  villageLng: z
    .number()
    .min(-180, 'Longitude harus antara -180 dan 180')
    .max(180, 'Longitude harus antara -180 dan 180'),
  landManageStart: z
    .string()
    .min(1, 'Lahan kelola awal wajib diisi')
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'Lahan kelola awal harus berupa angka dan tidak boleh negatif',
    }),
  landManageEnd: z
    .string()
    .refine((val) => val === '' || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: 'Lahan kelola akhir harus berupa angka dan tidak boleh negatif',
    })
    .optional(),
  carbonEmisionStart: z
    .string()
    .min(1, 'Emisi karbon awal wajib diisi')
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'Emisi karbon awal harus berupa angka dan tidak boleh negatif',
    }),
  carbonEmisionEnd: z
    .string()
    .refine((val) => val === '' || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: 'Emisi karbon akhir harus berupa angka dan tidak boleh negatif',
    })
    .optional(),
  potency: z.string().min(1, 'Potensi wajib diisi'),
  climateIssue: z.string().min(1, 'Isu iklim wajib diisi'),
  mainSourceOfEconomy: z.string().min(1, 'Sumber ekonomi utama wajib diisi'),
  srnStatus: z.string().min(1, 'Status SRN wajib diisi'),

  // Cat 1 - exactly as in your interface
  incomesStart: z
    .string()
    .refine((val) => val === '' || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: 'Pendapatan awal harus berupa angka dan tidak boleh negatif',
    })
    .optional(),
  incomesEnd: z
    .string()
    .refine((val) => val === '' || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: 'Pendapatan akhir harus berupa angka dan tidak boleh negatif',
    })
    .optional(),
  unsustainableLandClearings: z.array(villagePerMonthSchema).optional(),

  // Cat 2 - exactly as in your interface
  incomes: z.array(villagePerMonthSchema).optional(),
  seedCapital: z
    .string()
    .refine((val) => val === '' || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: 'Modal benih harus berupa angka dan tidak boleh negatif',
    })
    .optional(),
});

export const villageFormSchema = villageDataSchema.omit({ id: true });

export type VillageData = z.infer<typeof villageDataSchema>;
export type VillageFormData = z.infer<typeof villageFormSchema>;
export type VillagePerMonth = z.infer<typeof villagePerMonthSchema>;

export type VillageTable = {
  [key in keyof VillageData]: VillageData[key];
};
