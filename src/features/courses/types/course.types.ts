/**
 * Course Types
 * Mendefinisikan tipe data untuk fitur Course
 */

export interface Course {
  id: string;
  code: string;          // 'CS101'
  name: string;          // 'Introduction to Computer Science'
  description?: string;
  credits: number;
  semesterId?: string;   // Tambahan: relasi ke Semester
  instructor?: string;
  schedule?: string;
  room?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateCourseDTO = Omit<Course, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCourseDTO = Partial<CreateCourseDTO>;

export interface CourseFilter {
  semesterId?: string;
  search?: string;
  credits?: number;
  instructor?: string;
}