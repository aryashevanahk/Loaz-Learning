export const SEMESTER_OPTIONS = [
  { value: 'GANJIL', label: 'Semester Ganjil' },
  { value: 'GENAP', label: 'Semester Genap' },
  { value: 'PENDEK', label: 'Semester Pendek' },
] as const;

export const SEMESTER_STATUS = {
  ACTIVE: 'Aktif',
  INACTIVE: 'Tidak Aktif',
  COMPLETED: 'Selesai',
} as const;

export type SemesterStatus = typeof SEMESTER_STATUS[keyof typeof SEMESTER_STATUS];