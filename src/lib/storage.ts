import { Course } from '@/types';
import { CourseInput } from '@/features/courses/types/course.types';

const STORAGE_KEY = 'courses_data';

export class StorageService {
  static getCourses(): Course[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }

  static saveCourses(courses: Course[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  static addCourse(course: CourseInput): Course {
    const courses = this.getCourses();
    const newCourse: Course = {
      ...course,
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    courses.push(newCourse);
    this.saveCourses(courses);
    return newCourse;
  }

  static updateCourse(id: string, updates: CourseInput): Course | null {
    const courses = this.getCourses();
    const index = courses.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    courses[index] = {
      ...courses[index],
      ...updates,
      updatedAt: new Date(),
    };
    this.saveCourses(courses);
    return courses[index];
  }

  static deleteCourse(id: string): boolean {
    const courses = this.getCourses();
    const filtered = courses.filter(c => c.id !== id);
    if (filtered.length === courses.length) return false;
    this.saveCourses(filtered);
    return true;
  }
}