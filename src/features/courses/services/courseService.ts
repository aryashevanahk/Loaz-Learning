import { StorageService } from '@/lib/storage';
import { Course, CourseInput } from '../types/course.types';

export class CourseService {
  static async getAllCourses(): Promise<Course[]> {
    return StorageService.getCourses();
  }

  static async getCourseById(id: string): Promise<Course | null> {
    const courses = StorageService.getCourses();
    return courses.find(c => c.id === id) || null;
  }

  static async createCourse(data: CourseInput): Promise<Course> {
    return StorageService.addCourse(data);
  }

  static async updateCourse(id: string, data: CourseInput): Promise<Course | null> {
    return StorageService.updateCourse(id, data);
  }

  static async deleteCourse(id: string): Promise<boolean> {
    return StorageService.deleteCourse(id);
  }

  static async initializeDefaultData(): Promise<void> {
    const courses = StorageService.getCourses();
    if (courses.length === 0) {
      const defaultCourses = StorageService.generateDefaultCourses();
      StorageService.saveCourses(defaultCourses);
    }
  }
}