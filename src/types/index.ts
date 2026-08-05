/**
 * Global Types
 * Export semua tipe global di sini
 */

// Feature Types
export * from "@/features/courses/types/course.types";
export * from "@/features/timetable/types/timetable.types";
export * from "@/features/semesters/types/semester.types";

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

export type SortOrder = "asc" | "desc";

export interface SortOptions {
  field: string;
  order: SortOrder;
}

export interface FilterOptions {
  search?: string;
  limit?: number;
  offset?: number;
}
