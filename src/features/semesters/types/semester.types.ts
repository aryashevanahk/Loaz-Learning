/**
 * Semester Types
 * Mendefinisikan tipe data untuk fitur Semester
 */

export interface Semester {
  id: string;
  name: string;          // "Semester 1", "Semester 2", dll
  semesterNumber: number; // 1-8
  academicYear: string;   // "2024/2025"
  startDate: Date;
  endDate: Date;
  isActive: boolean;      // Semester aktif saat ini
  createdAt: Date;
  updatedAt: Date;
}

export type CreateSemesterDTO = Omit<Semester, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateSemesterDTO = Partial<CreateSemesterDTO>;

export interface SemesterFilter {
  search?: string;
  isActive?: boolean;
  academicYear?: string;
}

export const SEMESTER_NAMES = [
  'Semester 1',
  'Semester 2',
  'Semester 3',
  'Semester 4',
  'Semester 5',
  'Semester 6',
  'Semester 7',
  'Semester 8',
] as const;

export type SemesterName = typeof SEMESTER_NAMES[number];