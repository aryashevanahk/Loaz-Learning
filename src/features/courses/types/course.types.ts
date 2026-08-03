import { Course } from '@/types';

export type { Course };
export type CourseInput = Omit<Course, 'id' | 'createdAt' | 'updatedAt'>;
export type CourseFilter = {
  search?: string;
  category?: Course['category'];
};