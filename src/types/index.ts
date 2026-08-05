/**
 * Global Types
 * Export semua tipe global di sini
 */

// Feature Types
export type * from '@/features/courses/types/course.types';
export type * from '@/features/timetable/types/timetable.types';
export type * from '@/features/semesters/types/semester.types';

// Common Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export type SortOrder = 'asc' | 'desc';

export interface SortOptions {
  field: string;
  order: SortOrder;
}

export interface FilterOptions {
  search?: string;
  limit?: number;
  offset?: number;
}