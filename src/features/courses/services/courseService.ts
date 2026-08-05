/**
 * Course Service
 * Mengelola operasi CRUD untuk data Course di localStorage
 */

import { Course, CreateCourseDTO, UpdateCourseDTO } from '../types/course.types';

const STORAGE_KEY = 'loaz_courses';

// Type untuk data dari localStorage
interface RawCourse {
  id: string;
  code: string;
  name: string;
  description?: string;
  credits: number;
  semesterId?: string;
  instructor?: string;
  schedule?: string;
  room?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

class CourseService {
  private storageKey = STORAGE_KEY;

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  /**
   * Get all courses from localStorage
   */
  getAll(): Course[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return [];
      
      const courses: RawCourse[] = JSON.parse(data);
      return courses.map((c) => ({
        ...c,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt),
      }));
    } catch (error) {
      console.error('Error getting courses:', error);
      return [];
    }
  }

  /**
   * Get course by ID
   */
  getById(id: string): Course | null {
    const courses = this.getAll();
    return courses.find(c => c.id === id) || null;
  }

  /**
   * Get courses by semester ID
   */
  getBySemesterId(semesterId: string): Course[] {
    const courses = this.getAll();
    return courses.filter(c => c.semesterId === semesterId);
  }

  /**
   * Create new course
   */
  create(data: CreateCourseDTO): Course {
    const courses = this.getAll();
    const now = new Date();
    
    const newCourse: Course = {
      id: this.generateId(),
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    
    courses.push(newCourse);
    this.save(courses);
    
    return newCourse;
  }

  /**
   * Update course
   */
  update(id: string, data: UpdateCourseDTO): Course | null {
    const courses = this.getAll();
    const index = courses.findIndex(c => c.id === id);
    
    if (index === -1) return null;
    
    const updatedCourse: Course = {
      ...courses[index],
      ...data,
      updatedAt: new Date(),
    };
    
    courses[index] = updatedCourse;
    this.save(courses);
    
    return updatedCourse;
  }

  /**
   * Delete course
   */
  delete(id: string): boolean {
    const courses = this.getAll();
    const filtered = courses.filter(c => c.id !== id);
    
    if (filtered.length === courses.length) return false;
    
    this.save(filtered);
    return true;
  }

  /**
   * Initialize default data
   */
  initializeDefaultData(): void {
    const courses = this.getAll();
    
    if (courses.length === 0) {
      const defaultCourses: CreateCourseDTO[] = [
        {
          code: 'CS101',
          name: 'Introduction to Computer Science',
          description: 'Basic concepts of computer science',
          credits: 3,
          semesterId: '1',
          instructor: 'Dr. Smith',
          schedule: 'Mon/Wed 08:00-10:00',
          room: 'Room 101',
          color: '#4F46E5',
        },
        {
          code: 'CS201',
          name: 'Data Structures',
          description: 'Advanced data structures and algorithms',
          credits: 4,
          semesterId: '1',
          instructor: 'Prof. Johnson',
          schedule: 'Mon/Wed 10:00-12:00',
          room: 'Room 102',
          color: '#7C3AED',
        },
        {
          code: 'CS301',
          name: 'Algorithms',
          description: 'Algorithm design and analysis',
          credits: 3,
          semesterId: '1',
          instructor: 'Dr. Williams',
          schedule: 'Tue/Thu 08:00-10:00',
          room: 'Room 103',
          color: '#EC4899',
        },
      ];
      
      defaultCourses.forEach(c => this.create(c));
    }
  }

  /**
   * Save courses to localStorage
   */
  private save(courses: Course[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.storageKey, JSON.stringify(courses));
  }
}

// Export singleton instance
export const courseService = new CourseService();