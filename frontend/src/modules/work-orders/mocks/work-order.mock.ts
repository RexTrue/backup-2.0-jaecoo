export const workOrderStatesMock = [
  { label: 'WO Aktif', value: '14', note: 'Sedang berjalan' },
  { label: 'Menunggu Sparepart', value: '2', note: 'Butuh tindak lanjut' },
  { label: 'Selesai Hari Ini', value: '9', note: 'Sudah ditutup' },
];

export const workOrderRowsMock = [
  { code: 'WO-240601', unit: 'JAECOO J7 SHS-P', owner: 'Budi Santoso', status: 'OPEN' },
  { code: 'WO-240602', unit: 'JAECOO J8 ARDIS', owner: 'Sari Wulandari', status: 'IN_PROGRESS' },
  { code: 'WO-240603', unit: 'JAECOO J5 EV', owner: 'Andra Pratama', status: 'CLOSED' },
];
