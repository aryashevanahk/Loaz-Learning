/**
 * Semester Constants
 * Konstanta untuk fitur Semester
 */

import { SEMESTER_NAMES } from '@/features/semesters/types/semester.types';

export const DEFAULT_ACADEMIC_YEAR = '2024/2025';

export const SEMESTER_OPTIONS = SEMESTER_NAMES.map((name, index) => ({
  value: (index + 1).toString(),
  label: name,
  semesterNumber: index + 1,
}));

export const ACADEMIC_YEAR_OPTIONS = [
  '2022/2023',
  '2023/2024',
  '2024/2025',
  '2025/2026',
  '2026/2027',
] as const;

export const DEFAULT_SEMESTER_DATA = {
  name: 'Semester 1',
  semesterNumber: 1,
  academicYear: DEFAULT_ACADEMIC_YEAR,
  startDate: new Date(new Date().getFullYear(), 7, 1), // 1 Agustus tahun ini
  endDate: new Date(new Date().getFullYear() + 1, 0, 31), // 31 Januari tahun depan
  isActive: true,
};

export const STORAGE_KEYS = {
  SEMESTERS: 'loaz_semesters',
  ACTIVE_SEMESTER: 'loaz_active_semester',
} as const;