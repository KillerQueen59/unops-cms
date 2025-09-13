export enum VillageCategory {
  Category1 = 'Category 1',
  Category2 = 'Category 2',
}

export const villageCategoryOptions = [
  { value: VillageCategory.Category1, label: 'Category 1' },
  { value: VillageCategory.Category2, label: 'Category 2' },
];

// Complete South Sumatra Location Constants based on kodewilayah.id
export const PROVINCE_CODE = '16';
export const PROVINCE_NAME = 'Sumatera Selatan';

export const southSumatraRegencies = [
  {
    code: '16.01',
    name: 'Kabupaten Ogan Komering Ulu',
    capital: 'Baturaja',
    type: 'regency',
  },
  {
    code: '16.02',
    name: 'Kabupaten Ogan Komering Ilir',
    capital: 'Kayu Agung',
    type: 'regency',
  },
  {
    code: '16.03',
    name: 'Kabupaten Muara Enim',
    capital: 'Muara Enim',
    type: 'regency',
  },
  { code: '16.04', name: 'Kabupaten Lahat', capital: 'Lahat', type: 'regency' },
  {
    code: '16.05',
    name: 'Kabupaten Musi Rawas',
    capital: 'Muara Beliti',
    type: 'regency',
  },
  {
    code: '16.06',
    name: 'Kabupaten Musi Banyuasin',
    capital: 'Sekayu',
    type: 'regency',
  },
  {
    code: '16.07',
    name: 'Kabupaten Banyuasin',
    capital: 'Pangkalan Balai',
    type: 'regency',
  },
  {
    code: '16.08',
    name: 'Kabupaten Ogan Komering Ulu Selatan',
    capital: 'Muara Dua',
    type: 'regency',
  },
  {
    code: '16.09',
    name: 'Kabupaten Ogan Komering Ulu Timur',
    capital: 'Martapura',
    type: 'regency',
  },
  {
    code: '16.10',
    name: 'Kabupaten Ogan Ilir',
    capital: 'Indralaya',
    type: 'regency',
  },
  {
    code: '16.11',
    name: 'Kabupaten Empat Lawang',
    capital: 'Tebing Tinggi',
    type: 'regency',
  },
  {
    code: '16.12',
    name: 'Kabupaten Penukal Abab Lematang Ilir',
    capital: 'Talang Ubi',
    type: 'regency',
  },
  {
    code: '16.13',
    name: 'Kabupaten Musi Rawas Utara',
    capital: 'Rupit',
    type: 'regency',
  },

  // Cities (Kota)
  { code: '16.71', name: 'Kota Palembang', capital: 'Palembang', type: 'city' },
  {
    code: '16.72',
    name: 'Kota Prabumulih',
    capital: 'Prabumulih',
    type: 'city',
  },
  {
    code: '16.73',
    name: 'Kota Pagar Alam',
    capital: 'Pagar Alam',
    type: 'city',
  },
  {
    code: '16.74',
    name: 'Kota Lubuklinggau',
    capital: 'Lubuklinggau',
    type: 'city',
  },
];

// Comprehensive village data for each regency/city
// This includes major villages and districts (skip kecamatan level as requested)
export const villagesByRegency: Record<
  string,
  Array<{ code: string; name: string; type: 'desa' | 'kelurahan' }>
> = {
  // Kabupaten Ogan Komering Ulu (16.01)
  '16.01': [
    { code: '16.01.01.001', name: 'Baturaja Barat', type: 'kelurahan' },
    { code: '16.01.01.002', name: 'Baturaja Timur', type: 'kelurahan' },
    { code: '16.01.01.003', name: 'Benteng Makarti', type: 'kelurahan' },
    { code: '16.01.01.004', name: 'Bukit Besar', type: 'kelurahan' },
    { code: '16.01.02.001', name: 'Simpang Tiga', type: 'desa' },
    { code: '16.01.02.002', name: 'Tanjung Urip', type: 'desa' },
    { code: '16.01.02.003', name: 'Mekar Sari', type: 'desa' },
    { code: '16.01.03.001', name: 'Sembawa Tengah', type: 'desa' },
    { code: '16.01.03.002', name: 'Sembawa Barat', type: 'desa' },
    { code: '16.01.04.001', name: 'Pengandonan', type: 'desa' },
    { code: '16.01.04.002', name: 'Muara Dua Kisam', type: 'desa' },
    { code: '16.01.05.001', name: 'Lubuk Batang', type: 'desa' },
    { code: '16.01.05.002', name: 'Sumber Mulyo', type: 'desa' },
    { code: '16.01.06.001', name: 'Tanjung Pandan', type: 'desa' },
    { code: '16.01.06.002', name: 'Ulak Depati', type: 'desa' },
  ],

  // Kabupaten Ogan Komering Ilir (16.02)
  '16.02': [
    { code: '16.02.01.001', name: 'Kayu Agung', type: 'kelurahan' },
    { code: '16.02.01.002', name: 'Tanjung Raja', type: 'kelurahan' },
    { code: '16.02.01.003', name: 'Sungai Pinang', type: 'kelurahan' },
    { code: '16.02.02.001', name: 'Sembawa', type: 'desa' },
    { code: '16.02.02.002', name: 'Jejawi', type: 'desa' },
    { code: '16.02.02.003', name: 'Tanjung Senai', type: 'desa' },
    { code: '16.02.03.001', name: 'Sirah Pulau Padang', type: 'desa' },
    { code: '16.02.03.002', name: 'Mesuji', type: 'desa' },
    { code: '16.02.04.001', name: 'Pedamaran', type: 'desa' },
    { code: '16.02.04.002', name: 'Cengal', type: 'desa' },
    { code: '16.02.05.001', name: 'Air Sugihan', type: 'desa' },
    { code: '16.02.05.002', name: 'Tulung Selapan', type: 'desa' },
  ],

  // Kabupaten Muara Enim (16.03)
  '16.03': [
    { code: '16.03.01.001', name: 'Muara Enim', type: 'kelurahan' },
    { code: '16.03.01.002', name: 'Talang Ubi', type: 'kelurahan' },
    { code: '16.03.02.001', name: 'Gelumbang', type: 'desa' },
    { code: '16.03.02.002', name: 'Tanjung Agung', type: 'desa' },
    { code: '16.03.03.001', name: 'Lawang Kidul', type: 'desa' },
    { code: '16.03.03.002', name: 'Benakat', type: 'desa' },
    { code: '16.03.04.001', name: 'Gunung Megang', type: 'desa' },
    { code: '16.03.04.002', name: 'Semangus', type: 'desa' },
    { code: '16.03.05.001', name: 'Rambang', type: 'desa' },
    { code: '16.03.05.002', name: 'Belimbing', type: 'desa' },
    { code: '16.03.06.001', name: 'Ujan Mas', type: 'desa' },
    { code: '16.03.06.002', name: 'Lembak', type: 'desa' },
  ],

  // Kabupaten Lahat (16.04)
  '16.04': [
    { code: '16.04.01.001', name: 'Lahat', type: 'kelurahan' },
    { code: '16.04.01.002', name: 'Bandar Agung', type: 'kelurahan' },
    { code: '16.04.01.003', name: 'Talang Jawa', type: 'kelurahan' },
    { code: '16.04.02.001', name: 'Pajar Bulan', type: 'desa' },
    { code: '16.04.02.002', name: 'Tanjung Tebat', type: 'desa' },
    { code: '16.04.03.001', name: 'Pseksu', type: 'desa' },
    { code: '16.04.03.002', name: 'Kikim', type: 'desa' },
    { code: '16.04.04.001', name: 'Mulak Ulu', type: 'desa' },
    { code: '16.04.04.002', name: 'Jarai', type: 'desa' },
    { code: '16.04.05.001', name: 'Tanjung Sakti Pumu', type: 'desa' },
    { code: '16.04.05.002', name: 'Gumay Ulu', type: 'desa' },
  ],

  // Kabupaten Musi Rawas (16.05)
  '16.05': [
    { code: '16.05.01.001', name: 'Muara Beliti', type: 'kelurahan' },
    { code: '16.05.01.002', name: 'Muara Lakitan', type: 'kelurahan' },
    { code: '16.05.02.001', name: 'Rawas Ulu', type: 'desa' },
    { code: '16.05.02.002', name: 'Karang Jaya', type: 'desa' },
    { code: '16.05.03.001', name: 'Tugumulyo', type: 'desa' },
    { code: '16.05.03.002', name: 'Selangit', type: 'desa' },
    { code: '16.05.04.001', name: 'Rawas Ilir', type: 'desa' },
    { code: '16.05.04.002', name: 'Nibung', type: 'desa' },
    { code: '16.05.05.001', name: 'Sumber Harta', type: 'desa' },
    { code: '16.05.05.002', name: 'Jayaloka', type: 'desa' },
  ],

  // Kabupaten Musi Banyuasin (16.06)
  '16.06': [
    { code: '16.06.01.001', name: 'Sekayu', type: 'kelurahan' },
    { code: '16.06.01.002', name: 'Sungai Keruh', type: 'kelurahan' },
    { code: '16.06.02.001', name: 'Babat Toman', type: 'desa' },
    { code: '16.06.02.002', name: 'Babat Supat', type: 'desa' },
    { code: '16.06.03.001', name: 'Bayung Lencir', type: 'desa' },
    { code: '16.06.03.002', name: 'Lalan', type: 'desa' },
    { code: '16.06.04.001', name: 'Plakat Tinggi', type: 'desa' },
    { code: '16.06.04.002', name: 'Sanga Desa', type: 'desa' },
    { code: '16.06.05.001', name: 'Keluang', type: 'desa' },
    { code: '16.06.05.002', name: 'Tungkal Jaya', type: 'desa' },
  ],

  // Kabupaten Banyuasin (16.07)
  '16.07': [
    { code: '16.07.01.001', name: 'Pangkalan Balai', type: 'kelurahan' },
    { code: '16.07.01.002', name: 'Betung Bedaro', type: 'kelurahan' },
    { code: '16.07.02.001', name: 'Talang Kelapa', type: 'desa' },
    { code: '16.07.02.002', name: 'Sembawa', type: 'desa' },
    { code: '16.07.03.001', name: 'Rambutan', type: 'desa' },
    { code: '16.07.03.002', name: 'Banyuasin II', type: 'desa' },
    { code: '16.07.04.001', name: 'Air Kumbang', type: 'desa' },
    { code: '16.07.04.002', name: 'Muara Sugihan', type: 'desa' },
    { code: '16.07.05.001', name: 'Rantau Bayur', type: 'desa' },
    { code: '16.07.05.002', name: 'Tanjung Lago', type: 'desa' },
  ],

  // Kabupaten Ogan Komering Ulu Selatan (16.08)
  '16.08': [
    { code: '16.08.01.001', name: 'Muara Dua', type: 'kelurahan' },
    { code: '16.08.01.002', name: 'Belitang', type: 'kelurahan' },
    { code: '16.08.02.001', name: 'Buana Pemaca', type: 'desa' },
    { code: '16.08.02.002', name: 'Simpang', type: 'desa' },
    { code: '16.08.03.001', name: 'Warkuk Ranau Selatan', type: 'desa' },
    { code: '16.08.03.002', name: 'Buay Rawan', type: 'desa' },
    { code: '16.08.04.001', name: 'Buay Sandang Aji', type: 'desa' },
    { code: '16.08.04.002', name: 'Kisam Tinggi', type: 'desa' },
  ],

  // Kabupaten Ogan Komering Ulu Timur (16.09)
  '16.09': [
    { code: '16.09.01.001', name: 'Martapura', type: 'kelurahan' },
    { code: '16.09.01.002', name: 'Belitang Jaya', type: 'kelurahan' },
    { code: '16.09.02.001', name: 'Cempaka', type: 'desa' },
    { code: '16.09.02.002', name: 'Buay Madang', type: 'desa' },
    { code: '16.09.03.001', name: 'Belitang Madang Raya', type: 'desa' },
    { code: '16.09.03.002', name: 'Madang Suku I', type: 'desa' },
    { code: '16.09.04.001', name: 'Madang Suku II', type: 'desa' },
    { code: '16.09.04.002', name: 'Madang Suku III', type: 'desa' },
  ],

  // Kabupaten Ogan Ilir (16.10)
  '16.10': [
    { code: '16.10.01.001', name: 'Indralaya', type: 'kelurahan' },
    { code: '16.10.01.002', name: 'Indralaya Utara', type: 'kelurahan' },
    { code: '16.10.01.003', name: 'Indralaya Selatan', type: 'kelurahan' },
    { code: '16.10.02.001', name: 'Pemulutan', type: 'desa' },
    { code: '16.10.02.002', name: 'Pemulutan Barat', type: 'desa' },
    { code: '16.10.03.001', name: 'Rantau Alai', type: 'desa' },
    { code: '16.10.03.002', name: 'Rantau Panjang', type: 'desa' },
    { code: '16.10.04.001', name: 'Tanjung Batu', type: 'desa' },
    { code: '16.10.04.002', name: 'Lubuk Keliat', type: 'desa' },
  ],

  // Kabupaten Empat Lawang (16.11)
  '16.11': [
    { code: '16.11.01.001', name: 'Tebing Tinggi', type: 'kelurahan' },
    { code: '16.11.01.002', name: 'Lintang Kanan', type: 'kelurahan' },
    { code: '16.11.02.001', name: 'Talang Padang', type: 'desa' },
    { code: '16.11.02.002', name: 'Muara Pinang', type: 'desa' },
    { code: '16.11.03.001', name: 'Pendopo', type: 'desa' },
    { code: '16.11.03.002', name: 'Ulu Musi', type: 'desa' },
    { code: '16.11.04.001', name: 'Sikap Dalam', type: 'desa' },
    { code: '16.11.04.002', name: 'Pasemah Air Keruh', type: 'desa' },
  ],

  // Kabupaten Penukal Abab Lematang Ilir (16.12)
  '16.12': [
    { code: '16.12.01.001', name: 'Talang Ubi', type: 'kelurahan' },
    { code: '16.12.01.002', name: 'Penukal Utara', type: 'kelurahan' },
    { code: '16.12.02.001', name: 'Tanah Abang', type: 'desa' },
    { code: '16.12.02.002', name: 'Abab', type: 'desa' },
    { code: '16.12.03.001', name: 'Penukal', type: 'desa' },
    { code: '16.12.03.002', name: 'Lematang Ilir', type: 'desa' },
  ],

  // Kabupaten Musi Rawas Utara (16.13)
  '16.13': [
    { code: '16.13.01.001', name: 'Rupit', type: 'kelurahan' },
    { code: '16.13.01.002', name: 'Rawas Ilir', type: 'kelurahan' },
    { code: '16.13.02.001', name: 'Karang Dapo', type: 'desa' },
    { code: '16.13.02.002', name: 'Karang Jaya', type: 'desa' },
    { code: '16.13.03.001', name: 'Ulu Rawas', type: 'desa' },
    { code: '16.13.03.002', name: 'STL Ulu Terawas', type: 'desa' },
  ],

  // Kota Palembang (16.71) - Major kelurahan
  '16.71': [
    { code: '16.71.01.001', name: 'Ilir Barat I', type: 'kelurahan' },
    { code: '16.71.01.002', name: 'Ilir Barat II', type: 'kelurahan' },
    { code: '16.71.01.003', name: 'Ilir Barat III', type: 'kelurahan' },
    { code: '16.71.02.001', name: 'Ilir Timur I', type: 'kelurahan' },
    { code: '16.71.02.002', name: 'Ilir Timur II', type: 'kelurahan' },
    { code: '16.71.02.003', name: 'Ilir Timur III', type: 'kelurahan' },
    { code: '16.71.03.001', name: 'Seberang Ulu I', type: 'kelurahan' },
    { code: '16.71.03.002', name: 'Seberang Ulu II', type: 'kelurahan' },
    { code: '16.71.04.001', name: 'Kertapati', type: 'kelurahan' },
    { code: '16.71.04.002', name: 'Gandus', type: 'kelurahan' },
    { code: '16.71.05.001', name: 'Bukit Kecil', type: 'kelurahan' },
    { code: '16.71.05.002', name: 'Kemuning', type: 'kelurahan' },
    { code: '16.71.06.001', name: 'Kalidoni', type: 'kelurahan' },
    { code: '16.71.06.002', name: 'Sako', type: 'kelurahan' },
    { code: '16.71.07.001', name: 'Sukarami', type: 'kelurahan' },
    { code: '16.71.07.002', name: 'Alang Alang Lebar', type: 'kelurahan' },
    { code: '16.71.08.001', name: 'Sematang Borang', type: 'kelurahan' },
    { code: '16.71.08.002', name: 'Jakabaring', type: 'kelurahan' },
  ],

  // Kota Prabumulih (16.72)
  '16.72': [
    { code: '16.72.01.001', name: 'Prabumulih Barat', type: 'kelurahan' },
    { code: '16.72.01.002', name: 'Prabumulih Timur', type: 'kelurahan' },
    { code: '16.72.01.003', name: 'Prabumulih Utara', type: 'kelurahan' },
    { code: '16.72.01.004', name: 'Prabumulih Selatan', type: 'kelurahan' },
    { code: '16.72.02.001', name: 'Cambai', type: 'kelurahan' },
    { code: '16.72.02.002', name: 'Rambang Kapak Tengah', type: 'kelurahan' },
  ],

  // Kota Pagar Alam (16.73)
  '16.73': [
    { code: '16.73.01.001', name: 'Pagar Alam Selatan', type: 'kelurahan' },
    { code: '16.73.01.002', name: 'Pagar Alam Utara', type: 'kelurahan' },
    { code: '16.73.02.001', name: 'Dempo Selatan', type: 'kelurahan' },
    { code: '16.73.02.002', name: 'Dempo Utara', type: 'kelurahan' },
    { code: '16.73.02.003', name: 'Dempo Tengah', type: 'kelurahan' },
  ],

  // Kota Lubuklinggau (16.74)
  '16.74': [
    { code: '16.74.01.001', name: 'Lubuklinggau Barat I', type: 'kelurahan' },
    { code: '16.74.01.002', name: 'Lubuklinggau Barat II', type: 'kelurahan' },
    { code: '16.74.02.001', name: 'Lubuklinggau Timur I', type: 'kelurahan' },
    { code: '16.74.02.002', name: 'Lubuklinggau Timur II', type: 'kelurahan' },
    { code: '16.74.03.001', name: 'Lubuklinggau Utara I', type: 'kelurahan' },
    { code: '16.74.03.002', name: 'Lubuklinggau Utara II', type: 'kelurahan' },
    { code: '16.74.04.001', name: 'Lubuklinggau Selatan I', type: 'kelurahan' },
    {
      code: '16.74.04.002',
      name: 'Lubuklinggau Selatan II',
      type: 'kelurahan',
    },
  ],
};
